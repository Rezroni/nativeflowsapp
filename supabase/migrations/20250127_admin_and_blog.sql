-- Admin roles table
create table if not exists public.admin_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  role text check (role in ('super_admin', 'admin', 'editor')) default 'editor',
  permissions jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog posts table
create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null, -- Store blocks/content as JSON
  featured_image_url text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  published_at timestamp with time zone,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  categories text[],
  tags text[],
  view_count integer default 0,
  reading_time_minutes integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Blog comments table (optional for future)
create table if not exists public.blog_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.blog_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.blog_comments(id) on delete cascade,
  content text not null,
  status text check (status in ('pending', 'approved', 'rejected', 'spam')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics aggregation table for dashboard
create table if not exists public.analytics_daily (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  total_users integer default 0,
  new_users integer default 0,
  active_subscriptions integer default 0,
  new_subscriptions integer default 0,
  canceled_subscriptions integer default 0,
  total_analyses integer default 0,
  total_revenue numeric(10, 2) default 0,
  mrr numeric(10, 2) default 0, -- Monthly Recurring Revenue
  churn_rate numeric(5, 2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for admin roles
alter table public.admin_roles enable row level security;

create policy "Admin roles viewable by admins only"
  on public.admin_roles for select
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

create policy "Only super admins can insert admin roles"
  on public.admin_roles for insert
  with check (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid() and ar.role = 'super_admin'
    )
  );

create policy "Only super admins can update admin roles"
  on public.admin_roles for update
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid() and ar.role = 'super_admin'
    )
  );

-- RLS Policies for blog posts
alter table public.blog_posts enable row level security;

create policy "Published blog posts are viewable by everyone"
  on public.blog_posts for select
  using (status = 'published' or exists (
    select 1 from public.admin_roles ar
    where ar.user_id = auth.uid()
  ));

create policy "Admins can insert blog posts"
  on public.blog_posts for insert
  with check (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

create policy "Admins can update blog posts"
  on public.blog_posts for update
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

create policy "Admins can delete blog posts"
  on public.blog_posts for delete
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

-- RLS Policies for blog comments
alter table public.blog_comments enable row level security;

create policy "Approved comments viewable by everyone"
  on public.blog_comments for select
  using (status = 'approved' or exists (
    select 1 from public.admin_roles ar
    where ar.user_id = auth.uid()
  ));

create policy "Authenticated users can insert comments"
  on public.blog_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.blog_comments for update
  using (auth.uid() = user_id);

create policy "Admins can delete any comment"
  on public.blog_comments for delete
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

-- RLS Policies for analytics
alter table public.analytics_daily enable row level security;

create policy "Analytics viewable by admins only"
  on public.analytics_daily for select
  using (
    exists (
      select 1 from public.admin_roles ar
      where ar.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
create trigger handle_admin_roles_updated_at before update on public.admin_roles
  for each row execute procedure public.handle_updated_at();

create trigger handle_blog_posts_updated_at before update on public.blog_posts
  for each row execute procedure public.handle_updated_at();

create trigger handle_blog_comments_updated_at before update on public.blog_comments
  for each row execute procedure public.handle_updated_at();

-- Function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Function to get dashboard statistics
create or replace function public.get_dashboard_stats()
returns jsonb as $$
declare
  result jsonb;
begin
  -- Check if user is admin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  select jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'active_subscriptions', (
      select count(*) from public.subscriptions
      where status in ('active', 'trialing')
    ),
    'total_analyses', (select count(*) from public.analyses),
    'analyses_today', (
      select count(*) from public.analyses
      where created_at >= current_date
    ),
    'new_users_this_week', (
      select count(*) from public.profiles
      where created_at >= current_date - interval '7 days'
    ),
    'new_users_this_month', (
      select count(*) from public.profiles
      where created_at >= current_date - interval '30 days'
    ),
    'revenue_this_month', (
      select coalesce(sum(
        case
          when plan_type = 'monthly' then 29.99
          when plan_type = 'annual' then 299.99 / 12
          else 0
        end
      ), 0)
      from public.subscriptions
      where status = 'active'
        and current_period_start >= current_date - interval '30 days'
    ),
    'mrr', (
      select coalesce(sum(
        case
          when plan_type = 'monthly' then 29.99
          when plan_type = 'annual' then 299.99 / 12
          else 0
        end
      ), 0)
      from public.subscriptions
      where status = 'active'
    ),
    'trial_conversion_rate', (
      select coalesce(
        round(
          (count(*) filter (where status = 'active' and trial_end is not null)::numeric /
          nullif(count(*) filter (where trial_end is not null), 0)::numeric) * 100,
          2
        ),
        0
      )
      from public.subscriptions
      where trial_end >= current_date - interval '90 days'
    )
  ) into result;

  return result;
end;
$$ language plpgsql security definer;

-- Function to get recent activity
create or replace function public.get_recent_activity(limit_count integer default 20)
returns table (
  id uuid,
  activity_type text,
  description text,
  user_email text,
  created_at timestamp with time zone
) as $$
begin
  -- Check if user is admin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  return query
  (
    select
      a.id,
      'analysis'::text as activity_type,
      'User analyzed a ' || a.market_type || ' chart'::text as description,
      p.email,
      a.created_at
    from public.analyses a
    join public.profiles p on p.id = a.user_id
    order by a.created_at desc
    limit limit_count / 2
  )
  union all
  (
    select
      s.id,
      'subscription'::text as activity_type,
      'User subscribed to ' || s.plan_type || ' plan'::text as description,
      p.email,
      s.created_at
    from public.subscriptions s
    join public.profiles p on p.id = s.user_id
    where s.status in ('active', 'trialing')
    order by s.created_at desc
    limit limit_count / 2
  )
  order by created_at desc
  limit limit_count;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at);
create index if not exists idx_blog_comments_post_id on public.blog_comments(post_id);
create index if not exists idx_analytics_daily_date on public.analytics_daily(date);
create index if not exists idx_admin_roles_user_id on public.admin_roles(user_id);
