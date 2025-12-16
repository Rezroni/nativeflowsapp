'use client'

import { useState, useMemo } from 'react'
import { FirmWithParsedData } from '@/types/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Star,
  Heart,
  ExternalLink,
  Search,
  ArrowUpDown,
  Info,
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

type SortOption = 'rating' | 'name' | 'reviews'

export function FirmsComparisonTable({ firms }: FirmsComparisonTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')

  const filteredAndSortedFirms = useMemo(() => {
    let filtered = firms.filter((firm) =>
      firm.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.overall_rating || 0) - (a.overall_rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'reviews':
          return (b.review_count || 0) - (a.review_count || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [firms, searchQuery, sortBy])

  return (
    <div className="space-y-6">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('rating')}>
              Highest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('reviews')}>
              Most Reviews
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('name')}>
              Name (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Compact Card List */}
      <div className="space-y-3">
        {filteredAndSortedFirms.map((firm, index) => (
          <div
            key={firm.id}
            className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              {/* Left: Logo, Name, Rating - Always visible */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Favorite */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-pink-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Rank Badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Logo */}
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {firm.logo_url ? (
                    <Image
                      src={firm.logo_url}
                      alt={firm.name}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs font-bold">
                      {firm.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name and Rating */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/firms/${firm.slug}`}
                    className="font-semibold hover:text-primary transition-colors block truncate"
                  >
                    {firm.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(firm.overall_rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold">
                      {firm.overall_rating?.toFixed(1) || 'N/A'}
                    </span>
                    {firm.review_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({firm.review_count.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle: Quick Info - Hidden on mobile, visible on tablet+ */}
              <div className="hidden md:flex items-center gap-3 flex-wrap">
                {/* Assets/Markets */}
                {firm.markets && firm.markets.length > 0 && (
                  <div className="flex gap-1">
                    {firm.markets.slice(0, 3).map((market, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {market}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Platforms */}
                {firm.trading_platforms && firm.trading_platforms.length > 0 && (
                  <div className="flex gap-1">
                    {firm.trading_platforms.slice(0, 2).map((platform, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded bg-muted flex items-center justify-center"
                        title={platform}
                      >
                        <span className="text-[10px] font-medium">
                          {platform.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Max Leverage */}
                {firm.maximum_leverage && (
                  <Badge variant="outline" className="font-semibold">
                    {firm.maximum_leverage}
                  </Badge>
                )}
              </div>

              {/* Right: Promo and Actions - Always visible */}
              <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap lg:justify-end">
                {/* Promo Badge */}
                {firm.badges && firm.badges.length > 0 && (
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 whitespace-nowrap">
                    {firm.badges[0].text}
                  </Badge>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg"
                    size="sm"
                  >
                    <Link href={firm.website_url || '#'} target="_blank" rel="noopener noreferrer">
                      Visit
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-2"
                  >
                    <Link href={`/firms/${firm.slug}`}>
                      <Info className="mr-1 h-3 w-3" />
                      Info
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile-only: Show quick info below */}
            <div className="md:hidden mt-3 pt-3 border-t flex flex-wrap gap-2">
              {firm.markets && firm.markets.length > 0 && (
                <>
                  {firm.markets.slice(0, 4).map((market, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {market}
                    </Badge>
                  ))}
                </>
              )}
              {firm.maximum_leverage && (
                <Badge variant="outline" className="font-semibold text-xs">
                  Leverage: {firm.maximum_leverage}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFirms.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No firms found matching your criteria</p>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredAndSortedFirms.length} of {firms.length} prop firms
      </div>
    </div>
  )
}
