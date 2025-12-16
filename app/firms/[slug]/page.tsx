import { notFound } from 'next/navigation'
import { getFirmBySlug, getAllFirms } from '@/actions/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Star,
  ExternalLink,
  Check,
  X,
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
  Globe,
  Award,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FirmPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const { firms } = await getAllFirms({ status: 'published', limit: 100 })
  return firms.map((firm) => ({
    slug: firm.slug,
  }))
}

export async function generateMetadata({ params }: FirmPageProps) {
  const { slug } = await params
  const { firm } = await getFirmBySlug(slug)

  if (!firm) {
    return {
      title: 'Firm Not Found',
    }
  }

  return {
    title: `${firm.name} Review - Ratings, Fees & Features | Nativeflows`,
    description:
      firm.description ||
      `Comprehensive review of ${firm.name}. Compare ratings, fees, trading platforms, and features.`,
  }
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { slug } = await params
  const { firm, error } = await getFirmBySlug(slug)

  if (error || !firm) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Logo */}
            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-card border flex-shrink-0">
              {firm.logo_url ? (
                <Image
                  src={firm.logo_url}
                  alt={firm.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl font-bold">
                  {firm.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{firm.name}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {firm.badges.map((badge, index) => (
                  <Badge key={index} variant={badge.variant}>
                    {badge.text}
                  </Badge>
                ))}
                {firm.is_featured && <Badge variant="secondary">Featured</Badge>}
                {firm.is_top_rated && <Badge variant="secondary">Top Rated</Badge>}
              </div>
              <p className="text-muted-foreground">{firm.description}</p>
              <div className="flex items-center gap-4 mt-4">
                {firm.overall_rating && (
                  <div className="flex items-center gap-2">
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
                    <span className="font-bold text-2xl">{firm.overall_rating.toFixed(1)}</span>
                  </div>
                )}
                {firm.review_count > 0 && (
                  <span className="text-muted-foreground">
                    ({firm.review_count.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <Button size="lg" asChild className="md:self-start">
              <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ratings Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                  <CardDescription>Detailed performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {firm.platform_rating && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Platform Quality</span>
                        <span className="font-bold">{firm.platform_rating.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(firm.platform_rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {firm.execution_rating && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Execution Speed</span>
                        <span className="font-bold">{firm.execution_rating.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(firm.execution_rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {firm.support_rating && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Customer Support</span>
                        <span className="font-bold">{firm.support_rating.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(firm.support_rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {firm.fees_rating && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Fees & Costs</span>
                        <span className="font-bold">{firm.fees_rating.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(firm.fees_rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Features */}
              {firm.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                    <CardDescription>What this firm offers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {firm.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          {feature.available ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.available ? 'font-medium' : 'text-muted-foreground line-through'
                            }
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pros and Cons */}
              {(firm.pros.length > 0 || firm.cons.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pros & Cons</CardTitle>
                    <CardDescription>Advantages and disadvantages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {firm.pros.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3">Pros</h4>
                          <ul className="space-y-2">
                            {firm.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {firm.cons.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3">Cons</h4>
                          <ul className="space-y-2">
                            {firm.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              {/* Key Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {firm.minimum_deposit !== null && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Minimum Deposit</p>
                        <p className="font-semibold">
                          {firm.minimum_deposit_currency}
                          {firm.minimum_deposit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {firm.maximum_leverage && (
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Maximum Leverage</p>
                        <p className="font-semibold">{firm.maximum_leverage}</p>
                      </div>
                    </div>
                  )}
                  {firm.spreads_from !== null && (
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Spreads From</p>
                        <p className="font-semibold">{firm.spreads_from} pips</p>
                      </div>
                    </div>
                  )}
                  {firm.user_count && (
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Traders</p>
                        <p className="font-semibold">{firm.user_count}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trading Platforms */}
              {firm.trading_platforms && firm.trading_platforms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Trading Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {firm.trading_platforms.map((platform: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Markets */}
              {firm.markets && firm.markets.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Available Markets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {firm.markets.map((market: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {market}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Regulation */}
              {firm.regulation && firm.regulation.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Regulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {firm.regulation.map((reg: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Types */}
              {firm.account_types && firm.account_types.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Account Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {firm.account_types.map((type: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{type}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-lg">Ready to Get Started?</h3>
                  <Button size="lg" variant="secondary" asChild className="w-full">
                    <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                      Visit {firm.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Comparison */}
      <section className="py-8 border-t">
        <div className="container max-w-5xl">
          <Button variant="outline" asChild>
            <Link href="/firms">← Back to Comparison</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
