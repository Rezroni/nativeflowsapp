'use client'

import { useState, useMemo } from 'react'
import { FirmWithParsedData } from '@/types/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FirmsComparisonTableProps {
  firms: FirmWithParsedData[]
}

type SortOption = 'rating' | 'name' | 'min_deposit' | 'leverage'

export function FirmsComparisonTable({ firms }: FirmsComparisonTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedFirms = useMemo(() => {
    let filtered = firms.filter((firm) =>
      firm.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.overall_rating || 0) - (a.overall_rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'min_deposit':
          return (a.minimum_deposit || 0) - (b.minimum_deposit || 0)
        case 'leverage':
          const aLev = parseInt(a.maximum_leverage?.replace(/\D/g, '') || '0')
          const bLev = parseInt(b.maximum_leverage?.replace(/\D/g, '') || '0')
          return bLev - aLev
        default:
          return 0
      }
    })

    return filtered
  }, [firms, searchQuery, sortBy])

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search prop firms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort: {sortBy === 'rating' ? 'Rating' : sortBy === 'name' ? 'Name' : sortBy === 'min_deposit' ? 'Deposit' : 'Leverage'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Highest Rating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('min_deposit')}>
                Lowest Deposit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('leverage')}>
                Highest Leverage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedFirms.length} of {firms.length} prop firms
      </div>

      {/* Comparison Table */}
      <div className="space-y-4">
        {filteredAndSortedFirms.map((firm, index) => (
          <div
            key={firm.id}
            className="bg-card border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left: Logo, Name, Rating */}
              <div className="lg:col-span-3 flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {firm.logo_url ? (
                    <Image
                      src={firm.logo_url}
                      alt={firm.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-lg font-bold">
                      {firm.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-lg">{firm.name}</h3>
                    {firm.badges.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {firm.badges[0].text}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(firm.overall_rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg">
                      {firm.overall_rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  {firm.review_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {firm.review_count.toLocaleString()} reviews
                    </p>
                  )}
                </div>
              </div>

              {/* Middle: Stats Grid */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Min Deposit */}
                  {firm.minimum_deposit !== null && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Min Deposit</p>
                      </div>
                      <p className="font-bold text-sm">
                        {firm.minimum_deposit_currency}
                        {firm.minimum_deposit}
                      </p>
                    </div>
                  )}

                  {/* Max Leverage */}
                  {firm.maximum_leverage && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Leverage</p>
                      </div>
                      <p className="font-bold text-sm">{firm.maximum_leverage}</p>
                    </div>
                  )}

                  {/* Spreads */}
                  {firm.spreads_from !== null && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Spreads</p>
                      </div>
                      <p className="font-bold text-sm">{firm.spreads_from} pips</p>
                    </div>
                  )}

                  {/* Platforms */}
                  {firm.trading_platforms && firm.trading_platforms.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Platforms</p>
                      <p className="font-bold text-sm">{firm.trading_platforms[0]}</p>
                      {firm.trading_platforms.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{firm.trading_platforms.length - 1} more
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                {firm.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {firm.features.slice(0, 4).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 text-xs bg-background rounded-full px-2 py-1"
                      >
                        {feature.available ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className={!feature.available ? 'line-through text-muted-foreground' : ''}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                    {firm.features.length > 4 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{firm.features.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="lg:col-span-4 flex flex-col gap-2 justify-center">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Platform</p>
                    <p className="font-semibold text-sm">
                      {firm.platform_rating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Support</p>
                    <p className="font-semibold text-sm">
                      {firm.support_rating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Execution</p>
                    <p className="font-semibold text-sm">
                      {firm.execution_rating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Fees</p>
                    <p className="font-semibold text-sm">
                      {firm.fees_rating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                      Visit Site
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/firms/${firm.slug}`}>
                      Details
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                {firm.user_count && (
                  <p className="text-center text-xs text-muted-foreground mt-1">
                    {firm.user_count} traders
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFirms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No firms found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
