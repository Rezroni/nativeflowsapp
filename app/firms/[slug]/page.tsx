import { notFound } from 'next/navigation'
import { getFirmBySlug } from '@/actions/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Users,
  Clock,
  CreditCard,
  Zap,
  Target,
  AlertCircle,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Make this page dynamic instead of statically generated
export const dynamic = 'force-dynamic'

interface FirmPageProps {
  params: Promise<{
    slug: string
  }>
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
      {/* Hero Section with Logo and CTA */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-7xl py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden bg-card border-2 border-border flex-shrink-0 shadow-lg">
                {firm.logo_url ? (
                  <Image
                    src={firm.logo_url}
                    alt={firm.name}
                    fill
                    className="object-contain p-3"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl font-bold text-muted-foreground">
                    {firm.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{firm.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  {firm.overall_rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(firm.overall_rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted'
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
                  {firm.badges.map((badge, index) => (
                    <Badge key={index} variant={badge.variant} className="text-xs">
                      {badge.text}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button size="lg" asChild className="w-full md:w-auto shadow-lg">
              <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="border-b bg-muted/30">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-6">
            {firm.minimum_deposit !== null && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Min Deposit</div>
                <div className="font-bold text-lg">
                  {firm.minimum_deposit_currency}
                  {firm.minimum_deposit}
                </div>
              </div>
            )}
            {firm.maximum_leverage && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Max Leverage</div>
                <div className="font-bold text-lg">{firm.maximum_leverage}</div>
              </div>
            )}
            {firm.spreads_from !== null && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Spreads From</div>
                <div className="font-bold text-lg">{firm.spreads_from} pips</div>
              </div>
            )}
            {firm.trading_platforms && firm.trading_platforms.length > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Platforms</div>
                <div className="font-bold text-lg">{firm.trading_platforms.length}</div>
              </div>
            )}
            {firm.regulation && firm.regulation.length > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Regulated</div>
                <div className="font-bold text-lg">{firm.regulation.length}</div>
              </div>
            )}
            {firm.user_count && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-1">Traders</div>
                <div className="font-bold text-lg">{firm.user_count}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-7xl">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  {firm.description && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-4">About {firm.name}</h2>
                        <p className="text-muted-foreground leading-relaxed">{firm.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Rating Breakdown */}
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-6">Rating Breakdown</h2>
                      <div className="space-y-4">
                        {firm.platform_rating && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Platform Quality</span>
                              <span className="font-bold">{firm.platform_rating.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all"
                                style={{ width: `${(firm.platform_rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {firm.execution_rating && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Execution Speed</span>
                              <span className="font-bold">{firm.execution_rating.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all"
                                style={{ width: `${(firm.execution_rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {firm.support_rating && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Customer Support</span>
                              <span className="font-bold">{firm.support_rating.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full transition-all"
                                style={{ width: `${(firm.support_rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {firm.fees_rating && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Fees & Costs</span>
                              <span className="font-bold">{firm.fees_rating.toFixed(1)}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all"
                                style={{ width: `${(firm.fees_rating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pros and Cons */}
                  {(firm.pros.length > 0 || firm.cons.length > 0) && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-6">Pros & Cons</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {firm.pros.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                                <Check className="h-5 w-5" />
                                Advantages
                              </h3>
                              <ul className="space-y-2">
                                {firm.pros.map((pro: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {firm.cons.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                <X className="h-5 w-5" />
                                Disadvantages
                              </h3>
                              <ul className="space-y-2">
                                {firm.cons.map((con: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
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

                  {/* Features */}
                  {firm.features.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {firm.features.map((feature, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-4 rounded-lg border ${
                                feature.available
                                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                                  : 'bg-muted border-border'
                              }`}
                            >
                              {feature.available ? (
                                <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <span
                                className={
                                  feature.available
                                    ? 'font-medium'
                                    : 'text-muted-foreground line-through'
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
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* CTA Card */}
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="pt-6 text-center space-y-4">
                      <Target className="h-12 w-12 mx-auto text-primary" />
                      <h3 className="font-bold text-xl">Ready to Start Trading?</h3>
                      <p className="text-sm text-muted-foreground">
                        Join thousands of traders using {firm.name}
                      </p>
                      <Button size="lg" className="w-full" asChild>
                        <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                          Open Account
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Trading Platforms */}
                  {firm.trading_platforms && firm.trading_platforms.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Trading Platforms
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {firm.trading_platforms.map((platform: string, index: number) => (
                            <Badge key={index} variant="secondary" className="font-normal">
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
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary" />
                          Available Markets
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {firm.markets.map((market: string, index: number) => (
                            <Badge key={index} variant="outline" className="font-normal">
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
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Regulation
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {firm.regulation.map((reg: string, index: number) => (
                            <Badge key={index} variant="secondary" className="font-normal">
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
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Account Types
                        </h3>
                        <ul className="space-y-2">
                          {firm.account_types.map((type: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary" />
                              <span>{type}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Detailed Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Financial Details
                        </h3>
                        <dl className="space-y-2 text-sm">
                          {firm.minimum_deposit !== null && (
                            <>
                              <div className="flex justify-between">
                                <dt className="text-muted-foreground">Minimum Deposit:</dt>
                                <dd className="font-medium">
                                  {firm.minimum_deposit_currency}
                                  {firm.minimum_deposit}
                                </dd>
                              </div>
                            </>
                          )}
                          {firm.maximum_leverage && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Maximum Leverage:</dt>
                              <dd className="font-medium">{firm.maximum_leverage}</dd>
                            </div>
                          )}
                          {firm.spreads_from !== null && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Spreads From:</dt>
                              <dd className="font-medium">{firm.spreads_from} pips</dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Info className="h-5 w-5 text-primary" />
                          Additional Info
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Status:</dt>
                            <dd>
                              <Badge variant="default">{firm.status}</Badge>
                            </dd>
                          </div>
                          {firm.is_featured && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Featured:</dt>
                              <dd>
                                <Badge variant="secondary">Yes</Badge>
                              </dd>
                            </div>
                          )}
                          {firm.is_top_rated && (
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">Top Rated:</dt>
                              <dd>
                                <Badge variant="secondary">Yes</Badge>
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Reviews section coming soon. Check back later for user feedback and ratings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Back to Comparison */}
      <section className="py-8 border-t bg-muted/30">
        <div className="container max-w-7xl flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/firms">← Back to Comparison</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
              Visit {firm.name}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
