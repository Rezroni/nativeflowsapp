import { getAllFirms } from '@/actions/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionToggle } from '@/components/common/section-toggle'
import { FirmsComparisonTable } from '@/components/firms/firms-comparison-table'
import { Star, Trophy, Shield, TrendingUp } from 'lucide-react'
import Link from 'next/link'

// Make this page dynamic to avoid build-time data fetching issues
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Compare the Best Prop Firms of 2025 | Nativeflows',
  description:
    'Compare ratings, fees, and features of the top prop trading firms. Find the perfect broker for your trading needs.',
}

export default async function FirmsPage() {
  const { firms } = await getAllFirms({
    status: 'published',
    sort_by: 'display_order',
    limit: 50,
  })

  const featuredFirms = firms.filter((f) => f.is_featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl" />

        <div className="container max-w-7xl relative z-10">
          {/* Section Toggle */}
          <div className="mb-8 flex justify-center">
            <SectionToggle defaultSection="firms" className="shadow-xl" />
          </div>

          <div className="text-center space-y-6 mb-12">
            <div className="inline-block">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                Top Rated Prop Firms 2025
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-purple-600">
              Compare the Best Prop Firms
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Find your perfect trading partner. Compare ratings, fees, and features of the
              world leading prop trading firms.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{firms.length}+</p>
                <p className="text-sm text-muted-foreground">Firms Compared</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Reviews Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">Daily</p>
                <p className="text-sm text-muted-foreground">Updated</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Award Winners</span>
            </div>
            <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Real-time Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Firms Highlight */}
      {featuredFirms.length > 0 && (
        <section className="py-8 border-t border-b bg-card/50 backdrop-blur-sm">
          <div className="container max-w-7xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                Featured This Month
              </h2>
              <Badge variant="outline">{featuredFirms.length} Firms</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {featuredFirms.map((firm) => (
                <Link
                  key={firm.id}
                  href={`/firms/${firm.slug}`}
                  className="flex items-center gap-2 bg-background border rounded-lg px-4 py-2 hover:border-primary transition-colors"
                >
                  <span className="font-medium text-sm">{firm.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {firm.overall_rating?.toFixed(1)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Comparison Table */}
      <section className="py-12">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">All Prop Firms Comparison</h2>
            <p className="text-muted-foreground">
              Compare side-by-side to find the best prop firm for your trading style
            </p>
          </div>

          <FirmsComparisonTable firms={firms} />
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10" />
        <div className="container max-w-4xl relative z-10">
          <div className="bg-card border rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of traders who trust our comparisons to find the best prop firms.
              Get started with our free analysis tools today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/blog">Read Our Guides</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 border-t">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about prop firms</p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-2">What is a prop trading firm?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A proprietary (prop) trading firm provides traders with capital to trade financial
                markets in exchange for a share of the profits. They handle the risk while you focus
                on trading.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-2">How do I choose the best prop firm?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Consider factors like minimum deposit requirements, profit splits, available
                platforms, trading rules, and customer support. Use our comparison tool to evaluate
                firms side-by-side.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-2">Are prop firms regulated?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Many reputable prop firms are regulated by financial authorities. Always check the
                regulation status in our comparison table before signing up.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/blog">View More FAQs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
