import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { MessageCircle, Mail, BookOpen, HelpCircle, Search, Clock } from 'lucide-react'

// Force dynamic rendering to avoid Sentry instrumentation issues
export const dynamic = 'force-dynamic'

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="gradient-text font-semibold">Support Center</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              How Can We <span className="gradient-text">Help You?</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the support you need to succeed with Nativeflows
            </p>
          </div>

          {/* Support Options */}
          <section className="mb-20 max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              <SupportCard
                icon={<MessageCircle className="h-6 w-6" />}
                title="Live Chat"
                description="Chat with our support team in real-time"
                action="Start Chat"
                available="Available 9 AM - 5 PM EST"
              />
              <SupportCard
                icon={<Mail className="h-6 w-6" />}
                title="Email Support"
                description="Send us an email and we'll respond within 24 hours"
                action="Send Email"
                available="support@nativeflows.com"
              />
              <SupportCard
                icon={<BookOpen className="h-6 w-6" />}
                title="Documentation"
                description="Browse our comprehensive guides and tutorials"
                action="View Docs"
                available="Available 24/7"
                href="/docs"
              />
            </div>
          </section>

          {/* Common Questions */}
          <section className="mb-20 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Questions</h2>
            <div className="glass-card rounded-2xl p-8 md:p-12 space-y-8">
              <SupportFAQ
                question="How do I upload a chart for analysis?"
                answer="Navigate to the 'Analyze' page from your dashboard, click the upload button, and select your chart image. Supported formats include PNG, JPG, and JPEG. For best results, ensure your chart is clear and includes relevant price action and timeframe information."
              />
              <SupportFAQ
                question="What should I do if the AI analysis seems incorrect?"
                answer="While our AI is highly accurate, it's important to remember it's an educational tool. If you believe an analysis is incorrect, you can: 1) Try uploading a clearer image, 2) Provide additional context in your prompt, 3) Contact our support team with the analysis ID for review."
              />
              <SupportFAQ
                question="How do I upgrade my subscription?"
                answer="You can upgrade your subscription at any time from the Settings page. Go to Settings > Subscription and select your preferred plan. Changes take effect immediately, and we'll prorate any remaining time on your current plan."
              />
              <SupportFAQ
                question="Can I cancel my subscription anytime?"
                answer="Yes! You can cancel your subscription at any time from the Settings page. You'll continue to have access to premium features until the end of your current billing period."
              />
              <SupportFAQ
                question="How do I share my analysis results?"
                answer="Each analysis has a 'Share' button that generates a shareable link. You can also export your analysis as a PDF or image file for sharing on social media or with your trading community."
              />
              <SupportFAQ
                question="Is my data secure?"
                answer="Absolutely. We take security seriously. All uploaded charts are encrypted, stored securely, and only accessible to you. We never share your trading data with third parties. See our Privacy Policy for more details."
              />
            </div>
          </section>

          {/* Help Topics */}
          <section className="mb-20 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse Help Topics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <HelpTopic
                title="Getting Started"
                items={[
                  "Creating an account",
                  "First chart upload",
                  "Understanding results",
                  "Platform overview"
                ]}
              />
              <HelpTopic
                title="Account & Billing"
                items={[
                  "Managing subscription",
                  "Payment methods",
                  "Billing history",
                  "Refund policy"
                ]}
              />
              <HelpTopic
                title="Features & Tools"
                items={[
                  "AI analysis features",
                  "Smart Money Concepts",
                  "Analysis history",
                  "Export options"
                ]}
              />
              <HelpTopic
                title="Troubleshooting"
                items={[
                  "Upload issues",
                  "Account access",
                  "Browser compatibility",
                  "Mobile app problems"
                ]}
              />
              <HelpTopic
                title="Trading Education"
                items={[
                  "Smart Money basics",
                  "Chart reading tips",
                  "Risk management",
                  "Strategy development"
                ]}
              />
              <HelpTopic
                title="Advanced Features"
                items={[
                  "Custom indicators",
                  "API access",
                  "Batch analysis",
                  "Team collaboration"
                ]}
              />
            </div>
          </section>

          {/* Contact CTA */}
          <section className="mx-auto max-w-3xl text-center">
            <div className="glass-card rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our support team is here to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">View Documentation</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SupportCard({
  icon,
  title,
  description,
  action,
  available,
  href
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: string
  available: string
  href?: string
}) {
  return (
    <div className="glass-card rounded-2xl p-8 hover-glow transition-all hover:-translate-y-2 flex flex-col">
      <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-4 text-primary w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Clock className="h-4 w-4" />
        <span>{available}</span>
      </div>
      <Button className="w-full" variant="outline" asChild>
        <Link href={href || '/contact'}>{action}</Link>
      </Button>
    </div>
  )
}

function SupportFAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 flex items-start gap-3">
        <Search className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        {question}
      </h3>
      <p className="text-muted-foreground leading-relaxed ml-8">{answer}</p>
    </div>
  )
}

function HelpTopic({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover-glow transition-all hover:-translate-y-2">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
