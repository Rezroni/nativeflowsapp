# Nativeflows - AI Trading Chart Analysis Web App

An AI-powered trading chart analysis web application using GPT-4 Vision and Smart Money Concepts (SMC) methodology.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI GPT-4 Vision API
- **Payments**: Stripe (Subscriptions)
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel

## 📦 Project Structure

```
chartiq-web/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Auth routes (login, signup, etc.)
│   ├── (marketing)/         # Public marketing pages
│   ├── (app)/               # Protected app routes
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components (header, footer)
│   ├── common/              # Shared components
│   ├── analysis/            # Chart analysis components
│   ├── smc/                 # Smart Money Concepts components
│   └── subscription/        # Subscription/pricing components
├── lib/
│   ├── supabase/           # Supabase client/server utilities
│   ├── openai/             # OpenAI GPT-4 Vision integration
│   ├── stripe/             # Stripe integration
│   ├── analytics/          # Analytics integration
│   └── utils/              # Utility functions
├── hooks/                   # Custom React hooks
├── actions/                 # Server Actions
├── types/                   # TypeScript type definitions
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
├── public/                  # Static assets
└── styles/                  # Global styles

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

### 3. Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Enable the storage bucket for chart images

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create products and prices for monthly/annual subscriptions
3. Set up webhook endpoint pointing to `/api/webhooks/stripe`
4. Add webhook secret to environment variables

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Features

### ✅ Implemented
- Next.js 15 project structure
- TypeScript configuration
- Tailwind CSS setup
- Supabase client/server utilities
- Database schema with RLS policies
- Middleware for authentication
- Type definitions for database and analysis
- Environment variable template

### 🚧 In Progress
- Authentication UI (login, signup, reset password)
- Landing page with hero section
- Chart upload component
- OpenAI GPT-4 Vision integration
- SMC analysis components
- Subscription/pricing system
- Dashboard and user interface

### 📋 Planned
- Analysis history
- Saved trade setups
- Export functionality
- PWA configuration
- Analytics integration
- E2E testing

## 🎯 Key Features

1. **Multi-Method Chart Upload**: Drag-and-drop, file upload, or paste from clipboard
2. **GPT-4 Vision Analysis**: Advanced AI-powered chart analysis
3. **Smart Money Concepts (SMC)**:
   - Order Blocks
   - Fair Value Gaps (FVG)
   - Liquidity Zones
   - Premium/Discount Arrays
   - Market Structure Analysis
   - Trade Setup Recommendations
4. **Compare with AI**: Users provide their analysis first, then compare with AI
5. **1-Day Free Trial**: Aggressive monetization with Stripe subscriptions
6. **Educational Focus**: Learn institutional trading while analyzing charts

## 📄 License

Private - All Rights Reserved

## 🤝 Contributing

This is a private project. Contributions are not currently accepted.

---

**Disclaimer**: Educational purposes only. Not financial advice.
