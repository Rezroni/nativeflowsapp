-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- We'll extend it with a profiles table

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  trader_level text check (trader_level in ('beginner', 'intermediate', 'advanced', 'professional')),
  trading_style text check (trading_style in ('day_trader', 'swing_trader', 'position_trader', 'scalper')),
  preferred_markets text[], -- ['forex', 'stocks', 'crypto', 'futures']
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid')) not null,
  plan_type text check (plan_type in ('free', 'monthly', 'annual')) default 'free',
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analysis history table
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  chart_image_url text not null,
  chart_image_hash text, -- For duplicate detection
  user_analysis jsonb, -- User's own analysis before AI
  ai_analysis jsonb not null, -- Complete AI response
  market_type text, -- forex, stocks, crypto, etc.
  timeframe text, -- 1m, 5m, 15m, 1h, 4h, 1d, etc.
  symbol text, -- EURUSD, BTC/USD, AAPL, etc.
  analysis_duration_ms integer, -- How long AI took
  cache_hit boolean default false, -- Was this from cache?
  feedback_rating integer check (feedback_rating between 1 and 5),
  feedback_comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Usage tracking table
create table public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text not null, -- 'analysis', 'comparison', 'export', etc.
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved trade setups table
create table public.saved_setups (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete cascade,
  setup_data jsonb not null, -- Complete trade setup
  notes text,
  status text check (status in ('active', 'triggered', 'completed', 'invalidated')) default 'active',
  alert_enabled boolean default false,
  alert_price numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.analyses enable row level security;
alter table public.usage_logs enable row level security;
alter table public.saved_setups enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Analyses policies
create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- Usage logs policies
create policy "Users can view own usage logs"
  on public.usage_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage logs"
  on public.usage_logs for insert
  with check (auth.uid() = user_id);

-- Saved setups policies
create policy "Users can view own saved setups"
  on public.saved_setups for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved setups"
  on public.saved_setups for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved setups"
  on public.saved_setups for update
  using (auth.uid() = user_id);

create policy "Users can delete own saved setups"
  on public.saved_setups for delete
  using (auth.uid() = user_id);

-- Storage bucket for chart images
insert into storage.buckets (id, name, public)
values ('charts', 'charts', false);

-- Storage policies
create policy "Users can upload their own charts"
  on storage.objects for insert
  with check (
    bucket_id = 'charts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own charts"
  on storage.objects for select
  using (
    bucket_id = 'charts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own charts"
  on storage.objects for delete
  using (
    bucket_id = 'charts' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Create initial free subscription
  insert into public.subscriptions (user_id, status, plan_type)
  values (new.id, 'trialing', 'free');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

create trigger handle_saved_setups_updated_at before update on public.saved_setups
  for each row execute procedure public.handle_updated_at();
