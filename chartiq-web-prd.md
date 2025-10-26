# 🌐 AI-AGENT DEVELOPMENT BRIEF
## ChartIQ AI - AI Trading Chart Analysis Web App

**Target AI Agents:** Cursor AI, Claude Code, Aider  
**Development Mode:** Solo Developer with AI Assistance  
**Expected Timeline:** 2-3 weeks for MVP  
**Tech Stack:** Next.js 15 + Supabase + Stripe + OpenAI GPT-4 Vision API + Vercel

**🆕 LATEST UPDATES:**
- **Next.js 15** - Latest with App Router and Server Actions
- **Supabase** - Modern PostgreSQL BaaS with real-time capabilities
- **Stripe Checkout** - Web-optimized subscription management
- **Smart Money Concepts (SMC)** - Advanced trading analysis methodology
- **1-Day Freemium** - Aggressive monetization strategy
- **Progressive Web App (PWA)** - Installable on desktop and mobile

---

## 📋 TABLE OF CONTENTS FOR AI AGENT

1. [Executive Summary for AI](#1-executive-summary-for-ai)
2. [Technical Architecture](#2-technical-architecture)
3. [Development Phases](#3-development-phases)
4. [Component-by-Component Build Instructions](#4-component-by-component-build-instructions)
5. [API Integrations](#5-api-integrations)
6. [State Management](#6-state-management)
7. [Testing Strategy](#7-testing-strategy)
8. [Deployment Checklist](#8-deployment-checklist)

---

## 1. EXECUTIVE SUMMARY FOR AI

### 🎯 What You're Building

A modern web application that uses GPT-4 Vision to analyze trading chart screenshots. Users upload a chart → AI analyzes it in ~5 seconds → Returns trend analysis, patterns, support/resistance levels, and educational insights. Optimized for desktop traders but fully responsive for mobile.

### 🔑 Core Value Proposition

**"Learn While You Analyze"** - Users first give their own analysis, then compare with AI feedback, creating a habit loop that improves trading skills.

### 📊 Key Metrics to Track in Code

```typescript
// Embed these analytics events in your code
const METRICS = {
  // User Engagement
  dailyActiveUsers: 'track_dau',
  weeklyActiveUsers: 'track_wau',
  averageAnalysesPerUser: 'track_avg_analyses',
  
  // Retention
  day1Retention: 'track_d1_retention', // Target: 60%
  day7Retention: 'track_d7_retention', // Target: 40%
  day30Retention: 'track_d30_retention', // Target: 25%
  
  // Monetization
  trialStartRate: 'track_trial_start', // Target: 3% of visits
  trialToPayConversion: 'track_trial_conversion', // Target: 50%
  monthlyChurnRate: 'track_churn', // Target: <5%
  
  // Product
  averageAnalysisTime: 'track_analysis_time', // Target: <5 seconds
  compareWithAIUsage: 'track_compare_usage', // Target: 60% of users
  educationalContentEngagement: 'track_edu_engagement',
  
  // Web-Specific
  browserTypes: 'track_browsers',
  deviceTypes: 'track_devices',
  uploadMethods: 'track_upload_methods', // file/paste/drag
};
```

### 🚨 Critical Constraints

1. **Legal Compliance:** Every screen MUST display: "Educational purposes only. Not financial advice."
2. **Performance:** Chart analysis must complete in <5 seconds (95th percentile)
3. **Cost Control:** Implement caching to reduce GPT-4 Vision API costs (identical charts = cached results)
4. **Browser Compatibility:** Support Chrome, Firefox, Safari, Edge (last 2 versions)
5. **Responsive Design:** Must work seamlessly on desktop (1920px+) down to mobile (375px)
6. **SEO:** Optimize landing pages for organic traffic
7. **Accessibility:** WCAG 2.1 AA compliance

---

## 2. TECHNICAL ARCHITECTURE

### 🏗️ Stack Overview

```
┌─────────────────────────────────────────────┐
│              CLIENT LAYER                   │
│  Next.js 15 (App Router) + TypeScript       │
│  - React 19 with Server Components          │
│  - TailwindCSS for styling                  │
│  - shadcn/ui for component library          │
│  - Framer Motion for animations             │
│  - React Query (TanStack Query) for state   │
└─────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────┐
│            ROUTING & MIDDLEWARE             │
│  - App Router (file-based routing)          │
│  - Middleware for auth & rate limiting      │
│  - Server Actions for mutations             │
│  - API Routes for webhooks                  │
└─────────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────┐
│            BACKEND SERVICES                 │
│  Supabase:                                  │
│  - Authentication (Email + Google + OAuth)  │
│  - PostgreSQL Database (user data, history) │
│  - Storage (chart images)                   │
│  - Realtime (live updates)                  │
│  - Edge Functions (serverless logic)        │
│                                             │
│  OpenAI:                                    │
│  - GPT-4 Vision API (chart analysis)        │
│  - GPT-4 Turbo (educational content)        │
│                                             │
│  Stripe:                                    │
│  - Checkout Sessions                        │
│  - Customer Portal                          │
│  - Subscription management                  │
│  - Webhooks for payment events              │
│                                             │
│  Vercel:                                    │
│  - Edge Network CDN                         │
│  - Serverless Functions                     │
│  - Analytics & Web Vitals                   │
│  - Preview Deployments                      │
└─────────────────────────────────────────────┘
```

### 📁 Project Structure

```
chartiq-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts              # OAuth callback handler
│   ├── (marketing)/
│   │   ├── page.tsx                      # Landing page
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── blog/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── analyze/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── compare/
│   │   │   └── page.tsx
│   │   ├── learn/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts                 # Chart analysis endpoint
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   │   └── route.ts             # Stripe webhook handler
│   │   │   └── supabase/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx                        # Root layout
│   ├── error.tsx                         # Error boundary
│   ├── loading.tsx                       # Loading state
│   └── not-found.tsx                     # 404 page
├── components/
│   ├── ui/                               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-nav.tsx
│   ├── common/
│   │   ├── disclaimer.tsx               # Legal disclaimer component
│   │   ├── loading-spinner.tsx
│   │   ├── error-message.tsx
│   │   └── trial-banner.tsx
│   ├── analysis/
│   │   ├── chart-uploader.tsx           # Multi-method upload
│   │   ├── analysis-result.tsx
│   │   ├── compare-with-ai.tsx
│   │   ├── trend-indicator.tsx
│   │   └── pattern-card.tsx
│   ├── smc/                              # Smart Money Concepts components
│   │   ├── order-block-card.tsx
│   │   ├── fair-value-gap-card.tsx
│   │   ├── liquidity-card.tsx
│   │   ├── market-structure-card.tsx
│   │   ├── premium-discount-array.tsx
│   │   └── trade-setup-card.tsx
│   ├── subscription/
│   │   ├── pricing-cards.tsx
│   │   ├── checkout-button.tsx
│   │   └── subscription-status.tsx
│   └── onboarding/
│       ├── welcome-modal.tsx
│       ├── feature-tour.tsx
│       └── profile-setup.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # Browser client
│   │   ├── server.ts                    # Server client
│   │   ├── middleware.ts                # Auth middleware
│   │   └── types.ts                     # Database types
│   ├── openai/
│   │   ├── chart-analysis.ts            # GPT-4 Vision integration
│   │   ├── prompts.ts                   # Prompt engineering templates
│   │   ├── cache.ts                     # Result caching
│   │   └── types.ts
│   ├── stripe/
│   │   ├── client.ts                    # Stripe client
│   │   ├── webhooks.ts                  # Webhook handlers
│   │   └── products.ts                  # Product definitions
│   ├── analytics/
│   │   ├── posthog.ts                   # PostHog analytics
│   │   └── events.ts                    # Event tracking
│   └── utils/
│       ├── image-processing.ts          # Image optimization
│       ├── cache.ts                     # Redis/Vercel KV cache
│       ├── validation.ts                # Zod schemas
│       ├── rate-limit.ts                # Rate limiting
│       └── constants.ts
├── hooks/
│   ├── use-auth.ts                      # Auth hook
│   ├── use-subscription.ts              # Subscription hook
│   ├── use-analysis.ts                  # Analysis hook
│   ├── use-upload.ts                    # File upload hook
│   └── use-toast.ts                     # Toast notifications
├── actions/                              # Server Actions
│   ├── auth-actions.ts
│   ├── analysis-actions.ts
│   └── subscription-actions.ts
├── types/
│   ├── analysis.ts
│   ├── user.ts
│   ├── subscription.ts
│   └── database.ts
├── styles/
│   └── globals.css                      # Global styles + Tailwind
├── public/
│   ├── images/
│   ├── icons/
│   └── manifest.json                    # PWA manifest
├── supabase/
│   ├── migrations/                      # Database migrations
│   ├── functions/                       # Edge functions
│   └── config.toml                      # Supabase config
├── .env.local                           # Environment variables
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 🔐 Environment Variables

```bash
# .env.local - AI AGENT: Set these up first

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_ORG_ID=org-...                   # Optional

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_ANNUAL=price_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Vercel (Auto-populated in production)
VERCEL_URL=auto
VERCEL_ENV=auto

# Rate Limiting
UPSTASH_REDIS_REST_URL=...              # For rate limiting
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 3. DEVELOPMENT PHASES

### 📅 Week 1: Foundation & Authentication

**Goal:** Working Next.js app with Supabase auth

#### Day 1-2: Project Setup
```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest chartiq-web --typescript --tailwind --app --use-npm

# Install core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @stripe/stripe-js stripe
npm install @tanstack/react-query
npm install framer-motion
npm install zod
npm install openai

# Install shadcn/ui
npx shadcn-ui@latest init

# Add essential components
npx shadcn-ui@latest add button card input dialog dropdown-menu toast tabs
```

**Tasks:**
- ✅ Initialize Next.js 15 with App Router
- ✅ Configure Tailwind CSS + shadcn/ui
- ✅ Set up environment variables
- ✅ Create basic folder structure
- ✅ Initialize Supabase project
- ✅ Set up Git repository

#### Day 3-4: Supabase Setup & Auth

**Database Schema:**

```sql
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
```

**Auth Implementation:**

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle errors from middleware/server components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle errors from middleware/server components
          }
        },
      },
    }
  )
}
```

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect app routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/reset-password') &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}
```

```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Tasks:**
- ✅ Create Supabase tables and policies
- ✅ Set up authentication (email, Google OAuth)
- ✅ Implement auth UI (login, signup, reset password)
- ✅ Create middleware for route protection
- ✅ Build auth context and hooks
- ✅ Test auth flow end-to-end

#### Day 5-7: UI Foundation & Landing Page

**Tasks:**
- ✅ Build responsive header/footer
- ✅ Create landing page with hero section
- ✅ Add pricing page
- ✅ Implement dark mode toggle
- ✅ Build onboarding modal
- ✅ Create dashboard layout
- ✅ Add mobile navigation

---

### 📅 Week 2: Core Functionality

**Goal:** Working chart analysis with GPT-4 Vision

#### Day 8-10: Chart Upload & Analysis

**Multi-Method Upload Component:**

```typescript
// components/analysis/chart-uploader.tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { analyzeChart } from '@/actions/analysis-actions'

export function ChartUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // File upload handler
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }, [])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
    }
  }, [toast])

  // Clipboard paste handler
  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        if (item.types.includes('image/png')) {
          const blob = await item.getType('image/png')
          const file = new File([blob], 'pasted-image.png', { type: 'image/png' })
          processImage(file)
          return
        }
      }
      toast({
        title: 'No image in clipboard',
        description: 'Copy an image to your clipboard first',
        variant: 'destructive',
      })
    } catch (error) {
      toast({
        title: 'Paste failed',
        description: 'Unable to access clipboard',
        variant: 'destructive',
      })
    }
  }, [toast])

  // Process and validate image
  const processImage = useCallback((file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Read and display image
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [toast])

  // Analyze chart
  const handleAnalyze = async () => {
    if (!image) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeChart({
        imageData: image,
        userAnalysis: null, // Optional: collect user's analysis first
      })

      // Handle result (will be implemented with results display)
      console.log('Analysis result:', result)
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Unable to analyze chart. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center space-y-4">
          {!image ? (
            <>
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upload Your Chart</h3>
                <p className="text-sm text-muted-foreground">
                  Drag & drop, paste from clipboard, or click to upload
                </p>
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="default"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button onClick={handlePaste} variant="outline">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Paste from Clipboard
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          ) : (
            <div className="space-y-4">
              <img
                src={image}
                alt="Uploaded chart"
                className="max-h-96 mx-auto rounded-lg"
              />
              <div className="flex gap-2 justify-center">
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Chart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setImage(null)}
                  disabled={isAnalyzing}
                >
                  Upload Different Chart
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-muted/50">
        <h4 className="font-medium mb-2">Tips for best results:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Use clear, high-resolution chart images</li>
          <li>• Include visible price levels and indicators</li>
          <li>• Ensure the timeframe is visible</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
      </Card>
    </div>
  )
}
```

**GPT-4 Vision Integration with SMC:**

```typescript
// lib/openai/chart-analysis.ts
import OpenAI from 'openai'
import { createHash } from 'crypto'
import { SMC_ANALYSIS_PROMPT } from './prompts'
import type { AnalysisResult } from '@/types/analysis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnalyzeChartParams {
  imageData: string // Base64 or URL
  userAnalysis?: {
    trend: string
    patterns: string[]
    support: number[]
    resistance: number[]
  }
  marketType?: string
  timeframe?: string
  symbol?: string
}

export async function analyzeChart(
  params: AnalyzeChartParams
): Promise<AnalysisResult> {
  const startTime = Date.now()

  // Generate hash for caching
  const imageHash = createHash('md5').update(params.imageData).digest('hex')

  // Check cache first (implement with Redis/Vercel KV)
  // const cachedResult = await checkCache(imageHash)
  // if (cachedResult) return cachedResult

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: SMC_ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: buildAnalysisPrompt(params),
            },
            {
              type: 'image_url',
              image_url: {
                url: params.imageData,
                detail: 'high',
              },
            },
          ],
        },
      ],
      temperature: 0.7,
    })

    const analysisText = response.choices[0].message.content
    const parsedAnalysis = parseAnalysisResponse(analysisText)

    const result: AnalysisResult = {
      ...parsedAnalysis,
      imageHash,
      analysisDuration: Date.now() - startTime,
      cacheHit: false,
      timestamp: new Date().toISOString(),
    }

    // Cache the result
    // await cacheResult(imageHash, result)

    return result
  } catch (error) {
    console.error('Chart analysis error:', error)
    throw new Error('Failed to analyze chart')
  }
}

function buildAnalysisPrompt(params: AnalyzeChartParams): string {
  let prompt = 'Analyze this trading chart using Smart Money Concepts (SMC) methodology.\n\n'

  if (params.symbol) prompt += `Symbol: ${params.symbol}\n`
  if (params.timeframe) prompt += `Timeframe: ${params.timeframe}\n`
  if (params.marketType) prompt += `Market: ${params.marketType}\n`

  if (params.userAnalysis) {
    prompt += '\nUser\'s preliminary analysis:\n'
    prompt += `- Trend: ${params.userAnalysis.trend}\n`
    prompt += `- Patterns: ${params.userAnalysis.patterns.join(', ')}\n`
    prompt += `- Support: ${params.userAnalysis.support.join(', ')}\n`
    prompt += `- Resistance: ${params.userAnalysis.resistance.join(', ')}\n`
    prompt += '\nPlease provide your professional analysis and compare with the user\'s observations.\n'
  }

  return prompt
}

function parseAnalysisResponse(text: string): Partial<AnalysisResult> {
  // Parse the GPT-4 response into structured data
  // This is a simplified version - implement full JSON parsing
  try {
    // Attempt to extract JSON if GPT returns structured format
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback: parse text response
    return {
      summary: text,
      confidence: 'medium',
      // Add more parsing logic
    }
  } catch (error) {
    return {
      summary: text,
      confidence: 'low',
    }
  }
}
```

```typescript
// lib/openai/prompts.ts
export const SMC_ANALYSIS_PROMPT = `You are an expert trading analyst specializing in Smart Money Concepts (SMC). Analyze trading charts with institutional trader perspective.

CRITICAL: Always include disclaimer at start: "Educational purposes only. Not financial advice."

Your analysis must include:

1. **Market Structure**
   - Identify Break of Structure (BOS) and Change of Character (CHoCH)
   - Determine current market phase (accumulation, markup, distribution, markdown)
   - Assess trend strength and momentum

2. **Order Blocks**
   - Locate bullish and bearish order blocks
   - Evaluate their validity and strength
   - Note if they've been tested or remain fresh

3. **Fair Value Gaps (FVG)**
   - Identify imbalances in price
   - Classify as bullish or bearish FVGs
   - Assess if they've been filled or remain open

4. **Liquidity Zones**
   - Mark equal highs/lows (liquidity pools)
   - Identify stop hunt zones
   - Note liquidity sweeps

5. **Premium/Discount Arrays**
   - Calculate 50% equilibrium level
   - Define premium zone (50-100%)
   - Define discount zone (0-50%)
   - Indicate current price position

6. **Trade Setups** (if applicable)
   - Entry zones (order blocks, FVGs)
   - Stop loss placement (beyond invalidation)
   - Take profit targets (using Fibonacci, structure)
   - Risk:reward ratios
   - Confluence factors (multiple SMC concepts aligning)
   - Time sensitivity of the setup

7. **Educational Insights**
   - Explain WHY smart money would act here
   - Reference institutional trading concepts
   - Provide learning points for the trader

**Response Format:**
Return analysis as structured JSON matching this schema:

\`\`\`json
{
  "disclaimer": "Educational purposes only. Not financial advice.",
  "market_structure": {
    "trend": "bullish|bearish|ranging",
    "phase": "accumulation|markup|distribution|markdown",
    "strength": "strong|moderate|weak",
    "bos_levels": [{ "price": 0, "type": "bullish|bearish", "date": "..." }],
    "choch_levels": [{ "price": 0, "type": "bullish|bearish", "date": "..." }]
  },
  "order_blocks": [
    {
      "type": "bullish|bearish",
      "high": 0,
      "low": 0,
      "strength": "strong|moderate|weak",
      "tested": boolean,
      "reasoning": "..."
    }
  ],
  "fair_value_gaps": [
    {
      "type": "bullish|bearish",
      "high": 0,
      "low": 0,
      "filled": boolean,
      "significance": "high|medium|low"
    }
  ],
  "liquidity_zones": [
    {
      "type": "equal_highs|equal_lows|stop_hunt",
      "levels": [0, 0, 0],
      "swept": boolean,
      "description": "..."
    }
  ],
  "premium_discount": {
    "equilibrium": 0,
    "premium_high": 0,
    "discount_low": 0,
    "current_position": "premium|equilibrium|discount",
    "range_percentage": 0
  },
  "trade_setups": [
    {
      "type": "long|short",
      "entry": {
        "zone_type": "order_block|fvg|liquidity",
        "price": 0,
        "entry_type": "market|limit|stop"
      },
      "stop_loss": {
        "price": 0,
        "reasoning": "..."
      },
      "take_profit": [
        {
          "price": 0,
          "target": "tp1|tp2|tp3",
          "percentage": "50%|30%|20%"
        }
      ],
      "risk_reward": "1:2",
      "confluence_rating": "high|medium|low",
      "probability": 0,
      "time_sensitivity": "...",
      "invalidation": {
        "price": 0,
        "condition": "..."
      },
      "notes": "..."
    }
  ],
  "educational_insights": {
    "key_concepts": ["...", "...", "..."],
    "smart_money_perspective": "...",
    "common_mistakes": "...",
    "learning_points": ["...", "...", "..."]
  },
  "summary": "Overall market analysis...",
  "confidence": "high|medium|low",
  "next_steps": "What the trader should watch for..."
}
\`\`\`

Be specific with price levels when possible. Provide actionable insights while emphasizing education.`
```

**Server Action for Analysis:**

```typescript
// actions/analysis-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { analyzeChart as analyzeChartAPI } from '@/lib/openai/chart-analysis'
import type { AnalysisResult } from '@/types/analysis'

export async function analyzeChart(params: {
  imageData: string
  userAnalysis?: any
  marketType?: string
  timeframe?: string
  symbol?: string
}) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isActive =
    subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing')

  if (!isActive) {
    throw new Error('Subscription required')
  }

  // Upload image to Supabase Storage
  const fileName = `${user.id}/${Date.now()}.png`
  const imageBuffer = Buffer.from(
    params.imageData.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  )

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('charts')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: false,
    })

  if (uploadError) {
    throw new Error('Failed to upload image')
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('charts').getPublicUrl(fileName)

  // Analyze chart with GPT-4 Vision
  const analysis = await analyzeChartAPI({
    ...params,
    imageData: publicUrl,
  })

  // Save analysis to database
  const { data: savedAnalysis, error: saveError } = await supabase
    .from('analyses')
    .insert({
      user_id: user.id,
      chart_image_url: publicUrl,
      chart_image_hash: analysis.imageHash,
      user_analysis: params.userAnalysis || null,
      ai_analysis: analysis,
      market_type: params.marketType,
      timeframe: params.timeframe,
      symbol: params.symbol,
      analysis_duration_ms: analysis.analysisDuration,
      cache_hit: analysis.cacheHit,
    })
    .select()
    .single()

  if (saveError) {
    throw new Error('Failed to save analysis')
  }

  // Log usage
  await supabase.from('usage_logs').insert({
    user_id: user.id,
    action_type: 'analysis',
    metadata: {
      analysis_id: savedAnalysis.id,
      market_type: params.marketType,
      timeframe: params.timeframe,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/history')

  return savedAnalysis
}
```

#### Day 11-14: Results Display & SMC Components

**Tasks:**
- ✅ Build analysis results display
- ✅ Create SMC visualization components (order blocks, FVGs, etc.)
- ✅ Implement compare-with-AI feature
- ✅ Add analysis history page
- ✅ Build saved setups functionality

---

### 📅 Week 3: Monetization & Polish

**Goal:** Working subscription system with Stripe

#### Day 15-17: Stripe Integration

**Stripe Setup:**

```typescript
// lib/stripe/client.ts
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}
```

```typescript
// lib/stripe/products.ts
export const STRIPE_PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY!,
    name: 'Pro Monthly',
    price: 29.99,
    interval: 'month',
    features: [
      'Unlimited chart analyses',
      'Advanced SMC insights',
      'Trade setup alerts',
      'Priority support',
      'Export to PDF',
      'Analysis history',
    ],
  },
  annual: {
    priceId: process.env.STRIPE_PRICE_ID_ANNUAL!,
    name: 'Pro Annual',
    price: 299.99,
    interval: 'year',
    features: [
      'Unlimited chart analyses',
      'Advanced SMC insights',
      'Trade setup alerts',
      'Priority support',
      'Export to PDF',
      'Analysis history',
      '2 months free',
    ],
  },
}
```

**Checkout Session:**

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabaseUserId: user.id,
        },
      })
      customerId = customer.id

      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 1, // 1-day trial
        metadata: {
          supabaseUserId: user.id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

**Webhook Handler:**

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        // Update subscription in database
        await supabaseAdmin
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            status: 'trialing',
            trial_start: new Date().toISOString(),
            trial_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
          })
          .eq('stripe_customer_id', customerId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status
        const customerId = subscription.customer as string

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: status as any,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_customer_id', customerId)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('stripe_customer_id', customerId)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
          })
          .eq('stripe_customer_id', customerId)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
```

#### Day 18-21: Polish, Testing & Deployment

**Tasks:**
- ✅ Implement trial countdown UI
- ✅ Build customer portal link
- ✅ Add analytics tracking (PostHog, Vercel Analytics)
- ✅ Optimize images and performance
- ✅ Add error boundaries
- ✅ Implement rate limiting
- ✅ Write E2E tests (Playwright)
- ✅ SEO optimization
- ✅ Deploy to Vercel
- ✅ Set up domain and SSL
- ✅ Configure Stripe production keys
- ✅ Test production webhooks

---

## 4. COMPONENT-BY-COMPONENT BUILD INSTRUCTIONS

### Core UI Components

#### 1. Pricing Cards

```typescript
// components/subscription/pricing-cards.tsx
'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { STRIPE_PLANS } from '@/lib/stripe/products'
import { useToast } from '@/hooks/use-toast'

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async (priceId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url, error } = await response.json()

      if (error) throw new Error(error)

      if (url) window.location.href = url
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const plan = isAnnual ? STRIPE_PLANS.annual : STRIPE_PLANS.monthly

  return (
    <div className="container max-w-6xl py-8">
      {/* Annual/Monthly Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center rounded-full bg-muted p-1">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !isAnnual ? 'bg-background shadow-sm' : ''
            }`}
            onClick={() => setIsAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isAnnual ? 'bg-background shadow-sm' : ''
            }`}
            onClick={() => setIsAnnual(true)}
          >
            Annual
            <span className="ml-2 text-xs text-green-600 font-semibold">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="max-w-lg mx-auto">
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-3xl">{plan.name}</CardTitle>
            <CardDescription>
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground"> /{plan.interval}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleCheckout(plan.priceId)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start 1-Day Free Trial'}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Cancel anytime. No commitments.
        </p>
      </div>
    </div>
  )
}
```

#### 2. Trial Banner

```typescript
// components/common/trial-banner.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

interface TrialBannerProps {
  trialEnd: string
  onUpgrade?: () => void
}

export function TrialBanner({ trialEnd, onUpgrade }: TrialBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')
  const router = useRouter()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(trialEnd).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft('Trial ended')
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      setTimeLeft(`${hours}h ${minutes}m remaining`)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [trialEnd])

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/pricing')
    }
  }

  if (!isVisible) return null

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Free trial: {timeLeft}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={handleUpgrade}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Upgrade Now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
```

### SMC Visualization Components

*[Include the SMC components from the original PRD - Order Block Card, Fair Value Gap Card, Market Structure Card, Premium/Discount Array, Trade Setup Card]*

---

## 5. API INTEGRATIONS

### OpenAI GPT-4 Vision API

```typescript
// Detailed implementation in lib/openai/chart-analysis.ts (shown above)
```

### Supabase

```typescript
// Client and server utilities (shown above)
// Database schema (shown above)
```

### Stripe

```typescript
// Checkout, webhooks, customer portal (shown above)
```

---

## 6. STATE MANAGEMENT

### React Query Setup

```typescript
// lib/react-query.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.Node }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Custom Hooks

```typescript
// hooks/use-subscription.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useSubscription() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    },
  })

  const isActive =
    subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing')

  const isTrialing = subscription?.status === 'trialing'

  const trialEndsAt = subscription?.trial_end

  return {
    subscription,
    isLoading,
    isActive,
    isTrialing,
    trialEndsAt,
  }
}
```

---

## 7. TESTING STRATEGY

### E2E Tests with Playwright

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should sign up new user', async ({ page }) => {
    await page.goto('/signup')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('should log in existing user', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })
})

// tests/e2e/analysis.spec.ts
test.describe('Chart Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should upload and analyze chart', async ({ page }) => {
    await page.goto('/analyze')

    // Upload chart image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('./tests/fixtures/sample-chart.png')

    // Wait for image to load
    await expect(page.locator('img[alt="Uploaded chart"]')).toBeVisible()

    // Click analyze
    await page.click('button:has-text("Analyze Chart")')

    // Wait for results
    await expect(page.locator('text=Analysis Results')).toBeVisible({
      timeout: 10000,
    })
  })
})
```

---

## 8. DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All environment variables set in Vercel
- [ ] Supabase production database migrated
- [ ] Stripe production keys configured
- [ ] Webhook endpoints registered with Stripe
- [ ] Domain configured and SSL active
- [ ] Analytics (PostHog, Vercel Analytics) set up
- [ ] Error tracking (Sentry) configured
- [ ] All tests passing
- [ ] Lighthouse score > 90

### Deployment

```bash
# Connect to Vercel
npx vercel login
npx vercel link

# Deploy to production
npx vercel --prod

# Set environment variables
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add OPENAI_API_KEY
npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
npx vercel env add STRIPE_SECRET_KEY
npx vercel env add STRIPE_WEBHOOK_SECRET
# ... add all environment variables
```

### Post-Deployment

- [ ] Test production auth flow
- [ ] Test Stripe checkout and webhooks
- [ ] Verify chart analysis works
- [ ] Check real-time subscriptions
- [ ] Monitor error rates
- [ ] Set up uptime monitoring
- [ ] Configure backups

---

## 🚨 CRITICAL WEB-SPECIFIC CONSIDERATIONS

### Performance Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

### PWA Configuration

```json
// public/manifest.json
{
  "name": "ChartIQ AI - Trading Chart Analysis",
  "short_name": "ChartIQ AI",
  "description": "AI-powered trading chart analysis with Smart Money Concepts",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### SEO Configuration

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ChartIQ AI',
    default: 'ChartIQ AI - AI Trading Chart Analysis',
  },
  description:
    'Analyze trading charts with GPT-4 Vision and Smart Money Concepts. Learn institutional trading strategies while getting AI-powered insights.',
  keywords: [
    'trading',
    'chart analysis',
    'smart money concepts',
    'AI trading',
    'technical analysis',
    'forex',
    'stocks',
    'crypto',
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chartiq.ai',
    title: 'ChartIQ AI - AI Trading Chart Analysis',
    description:
      'Analyze trading charts with GPT-4 Vision and Smart Money Concepts',
    siteName: 'ChartIQ AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChartIQ AI - AI Trading Chart Analysis',
    description:
      'Analyze trading charts with GPT-4 Vision and Smart Money Concepts',
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

---

## 🎯 PRIORITY ORDER

1. **Week 1:** Next.js setup + Supabase + Auth + Landing page
2. **Week 2:** GPT-4 Vision integration + Chart upload + Analysis display
3. **Week 3:** Stripe integration + Trial management + Deployment

---

## 💡 PRO TIPS FOR AI AGENT

- Use `next/image` for all images for automatic optimization
- Implement loading states with Suspense boundaries
- Use Server Components by default, Client Components only when needed
- Leverage Vercel Edge Functions for low latency
- Test with real chart images from TradingView
- Implement proper error boundaries at route level
- Use TypeScript strict mode for better type safety
- Optimize bundle size with dynamic imports
- Set up proper CORS for API routes
- Use Vercel Analytics to track Web Vitals
- Implement proper rate limiting on API routes
- Cache expensive computations with React Cache
- Use Progressive Enhancement for better UX
- Test on real mobile devices, not just DevTools
- Implement proper meta tags for social sharing

---

**END OF WEB APP AI-AGENT PRD**

Last Updated: 2025-10-26  
Version: 3.0 - Web App Edition with Next.js + Supabase  
Changes: Complete rewrite for modern web stack with Next.js 15, Supabase, Stripe, SMC methodology, 1-day trial

*This document is optimized for AI agents (Cursor, Claude Code) with latest web technologies and best practices.*