import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Brain, LineChart, Shield, Zap, ArrowRight } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">Documentation</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Learn How to Use <span className="gradient-text">Nativeflows</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know to master trading with AI-powered chart analysis
            </p>
          </div>

          {/* Quick Start */}
          <section className="mb-20 mx-auto max-w-4xl">
            <div className="glass-card rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Quick Start Guide</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                    <p className="text-muted-foreground">
                      Sign up for an account and choose your preferred plan to get started with unlimited chart analyses.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your First Chart</h3>
                    <p className="text-muted-foreground">
                      Take a screenshot of any trading chart from your platform and upload it to the analysis page.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Get AI-Powered Insights</h3>
                    <p className="text-muted-foreground">
                      Our AI will analyze your chart using Smart Money Concepts and provide detailed insights and trade ideas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Topics */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Documentation Topics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <DocCard
                icon={<Brain className="h-6 w-6" />}
                title="AI Analysis"
                description="Learn how our AI analyzes charts using GPT-4 Vision and Smart Money Concepts"
                items={[
                  "Understanding AI insights",
                  "Reading analysis results",
                  "Confidence scores explained"
                ]}
              />
              <DocCard
                icon={<LineChart className="h-6 w-6" />}
                title="Smart Money Concepts"
                description="Master institutional trading strategies and concepts"
                items={[
                  "Order blocks",
                  "Liquidity zones",
                  "Market structure",
                  "Fair value gaps"
                ]}
              />
              <DocCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Chart Upload"
                description="Best practices for uploading and analyzing charts"
                items={[
                  "Supported formats",
                  "Image quality tips",
                  "Timeframe selection"
                ]}
              />
              <DocCard
                icon={<Shield className="h-6 w-6" />}
                title="Risk Management"
                description="Tools and features for managing trading risk"
                items={[
                  "Position sizing",
                  "Stop loss calculation",
                  "Risk-reward ratios"
                ]}
              />
              <DocCard
                icon={<Zap className="h-6 w-6" />}
                title="Features"
                description="Explore all platform features and capabilities"
                items={[
                  "Analysis history",
                  "Sharing results",
                  "Export options"
                ]}
              />
              <DocCard
                icon={<BookOpen className="h-6 w-6" />}
                title="Learning Resources"
                description="Educational content to improve your trading"
                items={[
                  "Trading tutorials",
                  "Strategy guides",
                  "Video lessons"
                ]}
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="glass-card rounded-2xl p-8 md:p-12 space-y-8">
              <FAQItem
                question="What markets does Nativeflows support?"
                answer="Nativeflows works with all markets including stocks, forex, crypto, and commodities. Our AI can analyze any chart regardless of the market or timeframe."
              />
              <FAQItem
                question="How accurate is the AI analysis?"
                answer="Our AI uses GPT-4 Vision combined with Smart Money Concepts to provide highly accurate analysis. However, it's important to use these insights as educational tools and always perform your own due diligence."
              />
              <FAQItem
                question="Can I use Nativeflows on mobile?"
                answer="Yes! Nativeflows is fully responsive and works on all devices. You can upload charts and receive analysis from your smartphone or tablet."
              />
              <FAQItem
                question="How many charts can I analyze?"
                answer="The free trial includes 10 chart analyses. Pro plan users get unlimited chart analyses. See our pricing page for more details."
              />
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-3xl text-center">
            <div className="glass-card rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start analyzing charts with AI today
              </p>
              <Button size="lg" className="group" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function DocCard({
  icon,
  title,
  description,
  items
}: {
  icon: React.ReactNode
  title: string
  description: string
  items: string[]
}) {
  return (
    <div className="glass-card rounded-2xl p-6 hover-glow transition-all hover:-translate-y-2">
      <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{question}</h3>
      <p className="text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  )
}
