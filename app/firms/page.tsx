import { getAllFirms } from '@/actions/firms'
import { FirmWithParsedData } from '@/types/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SectionToggle } from '@/components/common/section-toggle'
import {
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  Check,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Make this page dynamic to avoid build-time data fetching issues
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Compare the Best Prop Firms of 2025 | Nativeflows',
  description:
    'Compare ratings, fees, and features of the top prop trading firms. Find the perfect broker for your trading needs.',
}

function FirmCard({ firm }: { firm: FirmWithParsedData }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header with Logo and Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {firm.logo_url ? (
              <Image
                src={firm.logo_url}
                alt={firm.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm font-bold">
                {firm.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{firm.name}</h3>
            {firm.review_count > 0 && (
              <p className="text-sm text-muted-foreground">
                {firm.review_count.toLocaleString()} reviews
              </p>
            )}
          </div>
          {firm.badges.length > 0 && (
            <Badge variant={firm.badges[0].variant}>{firm.badges[0].text}</Badge>
          )}
        </div>

        {/* Overall Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(firm.overall_rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-xl">
            {firm.overall_rating?.toFixed(1) || 'N/A'}
          </span>
        </div>

        {/* Sub Ratings */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {firm.platform_rating && (
            <div className="text-sm">
              <span className="text-muted-foreground">Platform:</span>{' '}
              <span className="font-semibold">{firm.platform_rating.toFixed(1)}</span>
            </div>
          )}
          {firm.execution_rating && (
            <div className="text-sm">
              <span className="text-muted-foreground">Execution:</span>{' '}
              <span className="font-semibold">{firm.execution_rating.toFixed(1)}</span>
            </div>
          )}
          {firm.support_rating && (
            <div className="text-sm">
              <span className="text-muted-foreground">Support:</span>{' '}
              <span className="font-semibold">{firm.support_rating.toFixed(1)}</span>
            </div>
          )}
          {firm.fees_rating && (
            <div className="text-sm">
              <span className="text-muted-foreground">Fees:</span>{' '}
              <span className="font-semibold">{firm.fees_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {firm.minimum_deposit !== null && (
            <div className="text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Min Deposit</p>
              <p className="font-semibold">
                {firm.minimum_deposit_currency}
                {firm.minimum_deposit}
              </p>
            </div>
          )}
          {firm.maximum_leverage && (
            <div className="text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Max Leverage</p>
              <p className="font-semibold">{firm.maximum_leverage}</p>
            </div>
          )}
          {firm.spreads_from !== null && (
            <div className="text-center">
              <BarChart3 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Spreads From</p>
              <p className="font-semibold">{firm.spreads_from} pips</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {/* Features Grid */}
        {firm.features.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-3">Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {firm.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {feature.available ? (
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <span
                    className={feature.available ? '' : 'text-muted-foreground line-through'}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platforms & Markets */}
        <div className="space-y-2 mb-4">
          {firm.trading_platforms && firm.trading_platforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {firm.trading_platforms.map((platform: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          )}
          {firm.markets && firm.markets.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {firm.markets.slice(0, 4).map((market: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {market}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
              Visit Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/firms/${firm.slug}`}>
              Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* User Count */}
        {firm.user_count && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {firm.user_count} traders
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default async function FirmsPage() {
  const { firms } = await getAllFirms({
    status: 'published',
    sort_by: 'display_order',
    limit: 50,
  })

  const featuredFirms = firms.filter((f) => f.is_featured)
  const topRatedFirms = firms.filter((f) => f.is_top_rated)
  const allFirms = firms

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-20">
        <div className="container max-w-7xl">
          {/* Section Toggle */}
          <div className="mb-8 flex justify-center">
            <SectionToggle defaultSection="firms" className="shadow-xl" />
          </div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Compare the Best Prop Firms of 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your perfect trading partner. Compare ratings, fees, and features of the
              world's leading prop trading firms and brokers.
            </p>
          </div>

          {/* Featured Badges */}
          {featuredFirms.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="text-sm">
                {firms.length}+ Firms Compared
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Updated Daily
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Unbiased Reviews
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Featured Firms */}
      {featuredFirms.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Firms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFirms.slice(0, 3).map((firm) => (
                <FirmCard key={firm.id} firm={firm} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Firms */}
      {topRatedFirms.length > 0 && (
        <section className="py-12">
          <div className="container max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Top Rated Firms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedFirms.slice(0, 6).map((firm) => (
                <FirmCard key={firm.id} firm={firm} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Firms */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">All Firms</h2>
            <p className="text-muted-foreground">
              Showing {allFirms.length} {allFirms.length === 1 ? 'firm' : 'firms'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFirms.map((firm) => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of traders who trust our comparisons to find the best prop firms
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
