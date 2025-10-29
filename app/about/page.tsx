import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Target, Users, Lightbulb, Award, TrendingUp, Shield, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">About Us</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Empowering Traders with{' '}
              <span className="gradient-text">AI Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to democratize institutional trading strategies through AI-powered education
            </p>
          </div>

          {/* Mission Statement */}
          <section className="mb-20 mx-auto max-w-4xl">
            <div className="glass-card rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
                At Nativeflows, we believe that everyone should have access to institutional-grade trading education.
                By combining cutting-edge AI technology with proven Smart Money Concepts, we're making professional
                trading analysis accessible to traders of all levels. Our platform helps you understand market structure,
                identify high-probability setups, and make informed trading decisions.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mb-20 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ValueCard
                icon={<Target className="h-6 w-6" />}
                title="Education First"
                description="We prioritize learning over profits. Our platform is designed to teach you how to think like institutional traders, not just provide signals."
              />
              <ValueCard
                icon={<Shield className="h-6 w-6" />}
                title="Transparency"
                description="We're honest about what AI can and cannot do. Our analysis is a learning tool, not financial advice, and we make that clear."
              />
              <ValueCard
                icon={<Lightbulb className="h-6 w-6" />}
                title="Innovation"
                description="We leverage the latest AI technology to provide insights that were previously only available to professional traders."
              />
              <ValueCard
                icon={<Users className="h-6 w-6" />}
                title="Community"
                description="We're building a community of educated traders who share knowledge and help each other grow."
              />
              <ValueCard
                icon={<Award className="h-6 w-6" />}
                title="Quality"
                description="We're committed to providing accurate, reliable analysis backed by proven trading concepts and methodologies."
              />
              <ValueCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Continuous Improvement"
                description="We constantly refine our AI models and add new features based on user feedback and market developments."
              />
            </div>
          </section>

          {/* Story */}
          <section className="mb-20 mx-auto max-w-4xl">
            <div className="glass-card rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Nativeflows was born from a simple observation: while institutional traders have access to
                  sophisticated analysis tools and education, retail traders often struggle to understand complex
                  market concepts like Smart Money Concepts, order flow, and institutional behavior.
                </p>
                <p>
                  As traders ourselves, we experienced the frustration of trying to decode market movements without
                  the resources available to professional traders. We spent years studying Smart Money Concepts,
                  market structure, and institutional trading strategies, and we realized that AI could help bridge
                  this knowledge gap.
                </p>
                <p>
                  By combining GPT-4 Vision with proven trading concepts, we created a platform that can analyze
                  any chart and explain what's happening in terms that traders can understand and learn from.
                  Today, thousands of traders use Nativeflows to improve their market understanding and make more
                  informed trading decisions.
                </p>
                <p>
                  We're just getting started. Our vision is to continue expanding our educational resources,
                  refining our AI models, and building tools that help traders at every level improve their skills
                  and confidence in the markets.
                </p>
              </div>
            </div>
          </section>

          {/* What Sets Us Apart */}
          <section className="mb-20 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">What Sets Us Apart</h2>
            <div className="glass-card rounded-2xl p-8 md:p-12 space-y-6">
              <Feature
                title="AI-Powered Analysis"
                description="We use GPT-4 Vision, the most advanced AI vision model available, to analyze chart patterns and market structure with unprecedented accuracy."
              />
              <Feature
                title="Smart Money Concepts"
                description="Our analysis is grounded in institutional trading concepts like order blocks, liquidity zones, and market structure - strategies used by professional traders."
              />
              <Feature
                title="Educational Focus"
                description="Every analysis includes detailed explanations of why we see what we see, helping you learn and develop your own analytical skills."
              />
              <Feature
                title="Multi-Market Support"
                description="Whether you trade stocks, forex, crypto, or commodities, our AI can analyze charts from any market with the same level of insight."
              />
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-3xl text-center">
            <div className="glass-card rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start learning institutional trading strategies today
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

function ValueCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 hover-glow transition-all hover:-translate-y-2">
      <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
