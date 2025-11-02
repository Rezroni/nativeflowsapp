import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Disclaimer } from '@/components/common/disclaimer'
import { SocialProof } from '@/components/common/social-proof'
import { HomeAnimations } from '@/components/common/home-animations'
import { PWARouter } from '@/components/pwa/pwa-router'
import { createClient } from '@/lib/supabase/server'
import {
  TrendingUp,
  Brain,
  Zap,
  Shield,
  LineChart,
  Award,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <PWARouter isAuthenticated={!!user} />
      <Header user={user} />
      <HomeAnimations>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-blob-1 absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="parallax-blob-2 absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="gradient-text font-semibold">AI-Powered Trading Analysis</span>
            </div>

            <h1 className="hero-title mb-8 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              Master Trading with{' '}
              <span className="gradient-text">Nativeflows AI</span>
            </h1>

            <p className="hero-description mb-12 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Analyze charts with AI Vision and Smart Money Concepts. Learn institutional trading strategies and make informed decisions.
            </p>

            <div className="hero-buttons flex flex-col gap-4 sm:flex-row sm:justify-center mb-12">
              {user ? (
                <Button size="lg" className="group hover-glow text-lg px-8 py-6" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="group hover-glow text-lg px-8 py-6" asChild>
                    <Link href="/pricing">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass hover-glow" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="hero-features flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Pay with cryptocurrency</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <SocialProof />

      {/* Disclaimer Banner */}
      <Disclaimer variant="banner" />

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 scroll-mt-20">
        <div className="container">
          <div className="section-heading mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Powerful Features for{' '}
              <span className="gradient-text">Serious Traders</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to analyze markets like institutional traders
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="feature-card">
              <FeatureCard
                icon={<Brain className="h-7 w-7" />}
                title="AI Chart Analysis"
                description="Upload any chart and get instant AI-powered analysis using our advanced AI Vision technology."
              />
            </div>
            <div className="feature-card">
              <FeatureCard
                icon={<LineChart className="h-7 w-7" />}
                title="Smart Money Concepts"
                description="Learn and apply institutional trading strategies like order blocks, liquidity zones, and market structure."
              />
            </div>
            <div className="feature-card">
              <FeatureCard
                icon={<Zap className="h-7 w-7" />}
                title="Real-Time Insights"
                description="Get instant feedback on chart patterns, trends, and potential trade setups."
              />
            </div>
            <div className="feature-card">
              <FeatureCard
                icon={<Shield className="h-7 w-7" />}
                title="Risk Management"
                description="Built-in tools to calculate position sizing, stop losses, and risk-reward ratios."
              />
            </div>
            <div className="feature-card">
              <FeatureCard
                icon={<Award className="h-7 w-7" />}
                title="Educational Focus"
                description="Learn as you trade with detailed explanations and educational resources."
              />
            </div>
            <div className="feature-card">
              <FeatureCard
                icon={<TrendingUp className="h-7 w-7" />}
                title="Multi-Market Support"
                description="Analyze stocks, forex, crypto, and commodities with the same powerful tools."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 scroll-mt-20 relative">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="container relative z-10">
          <div className="section-heading mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, powerful, and effective
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="step-card">
              <StepCard
                number="1"
                title="Upload Your Chart"
                description="Take a screenshot or upload any trading chart image from your platform."
              />
            </div>
            <div className="step-card">
              <StepCard
                number="2"
                title="AI Analysis"
                description="Our AI analyzes the chart using Smart Money Concepts and technical analysis."
              />
            </div>
            <div className="step-card">
              <StepCard
                number="3"
                title="Get Insights"
                description="Receive detailed analysis, trade ideas, and educational explanations."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 scroll-mt-20">
        <div className="container">
          <div className="section-heading mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            <div className="pricing-card">
              <PricingCard
                name="Weekly"
                price="$10"
                period="per week"
                features={[
                  "Unlimited chart analyses",
                  "Smart Money Concepts",
                  "Email support",
                  "Educational resources",
                  "Valid for 7 days"
                ]}
                cta="Get Started"
                href="/pricing"
              />
            </div>
            <div className="pricing-card">
              <PricingCard
                name="Monthly"
                price="$25"
                period="per month"
                features={[
                  "Unlimited chart analyses",
                  "Advanced Smart Money Concepts",
                  "Priority support",
                  "Advanced indicators",
                  "Trade journal",
                  "Market alerts",
                  "Premium AI models"
                ]}
                cta="Get Started"
                href="/pricing"
                featured
              />
            </div>
            <div className="pricing-card">
              <PricingCard
                name="Annual"
                price="$250"
                period="per year"
                features={[
                  "Unlimited chart analyses",
                  "Advanced Smart Money Concepts",
                  "Priority support",
                  "Advanced indicators",
                  "Trade journal",
                  "Market alerts",
                  "Premium AI models",
                  "Save $50 per year"
                ]}
                cta="Get Started"
                href="/pricing"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="container relative z-10">
          <div className="section-heading mx-auto max-w-3xl text-center mb-20">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Loved by Traders <span className="gradient-text">Worldwide</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="testimonial-card">
              <TestimonialCard
                quote="Nativeflows has completely transformed how I analyze charts. The Smart Money Concepts explanations are invaluable."
                author="Sarah Johnson"
                role="Day Trader"
                rating={5}
              />
            </div>
            <div className="testimonial-card">
              <TestimonialCard
                quote="The AI insights are incredibly accurate. It's like having a professional trader analyzing every chart with you."
                author="Michael Chen"
                role="Forex Trader"
                rating={5}
              />
            </div>
            <div className="testimonial-card">
              <TestimonialCard
                quote="Best educational tool I've found for learning institutional trading strategies. Highly recommend!"
                author="David Martinez"
                role="Crypto Trader"
                rating={5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="cta-card mx-auto max-w-4xl text-center rounded-3xl glass-card p-16 hover-glow">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Ready to Trade <span className="gradient-text">Smarter?</span>
            </h2>
            <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders using AI to improve their trading decisions
            </p>
            <Button size="lg" className="text-lg px-10 py-7 group" asChild>
              <Link href="/pricing">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      </HomeAnimations>
      <Footer />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl glass-card p-8 transition-all hover:-translate-y-2 hover-glow h-full flex flex-col">
      <div className="mb-6 inline-flex rounded-xl bg-primary/20 p-4 text-primary group-hover:bg-primary/30 transition-colors w-fit">
        {icon}
      </div>
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="relative rounded-2xl glass-card p-8 hover-glow transition-all hover:-translate-y-2 h-full flex flex-col">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">
        {number}
      </div>
      <h3 className="mb-4 text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  featured = false
}: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  href: string
  featured?: boolean
}) {
  return (
    <div className={`relative rounded-2xl glass-card p-8 transition-all hover:-translate-y-2 flex flex-col h-full ${featured ? 'border-2 border-primary hover-glow' : 'hover-glow'}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-4 text-2xl font-bold">{name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold gradient-text">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>

      <ul className="mb-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full"
        variant={featured ? 'default' : 'outline'}
        size="lg"
        asChild
      >
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  rating
}: {
  quote: string
  author: string
  role: string
  rating: number
}) {
  return (
    <div className="rounded-2xl glass-card p-8 hover-glow transition-all hover:-translate-y-2 h-full flex flex-col">
      <div className="mb-6 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
        ))}
      </div>
      <blockquote className="mb-6 text-lg leading-relaxed flex-grow">
        "{quote}"
      </blockquote>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
    </div>
  )
}
