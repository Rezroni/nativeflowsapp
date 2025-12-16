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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface FirmsComparisonTableProps {
  firms: FirmWithParsedData[]
}

type SortOption = 'rating' | 'name' | 'reviews' | 'rank'

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
        case 'rank':
          return a.display_order - b.display_order
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
            <DropdownMenuItem onClick={() => setSortBy('rank')}>
              Display Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[50px]">RANK</TableHead>
              <TableHead className="min-w-[200px]">FIRM</TableHead>
              <TableHead className="w-[120px]">REVIEWS</TableHead>
              <TableHead className="w-[120px]">COUNTRY</TableHead>
              <TableHead className="w-[100px]">YEARS</TableHead>
              <TableHead className="w-[150px]">ASSETS</TableHead>
              <TableHead className="w-[120px]">PLATFORMS</TableHead>
              <TableHead className="w-[120px]">MAX ALLOC.</TableHead>
              <TableHead className="w-[120px]">PROMO</TableHead>
              <TableHead className="w-[180px] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedFirms.map((firm, index) => (
              <TableRow key={firm.id} className="hover:bg-muted/50">
                {/* Favorite */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-pink-500"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </TableCell>

                {/* Rank */}
                <TableCell>
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                </TableCell>

                {/* Firm */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                    <div>
                      <Link
                        href={`/firms/${firm.slug}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {firm.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>

                {/* Reviews */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {firm.overall_rating?.toFixed(1) || 'N/A'}
                      </span>
                      {firm.review_count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({firm.review_count})
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Country */}
                <TableCell>
                  <span className="text-sm">{firm.country || '-'}</span>
                </TableCell>

                {/* Years in Operation */}
                <TableCell>
                  <span className="text-sm">
                    {firm.years_in_operation ? `${firm.years_in_operation}y` : '-'}
                  </span>
                </TableCell>

                {/* Assets */}
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {firm.markets && firm.markets.length > 0 ? (
                      firm.markets.slice(0, 2).map((market, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {market}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>

                {/* Platforms */}
                <TableCell>
                  <div className="flex gap-1">
                    {firm.trading_platforms && firm.trading_platforms.length > 0 ? (
                      firm.trading_platforms.slice(0, 2).map((platform, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded bg-muted flex items-center justify-center"
                          title={platform}
                        >
                          <span className="text-[10px] font-medium">
                            {platform.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>

                {/* Max Allocations */}
                <TableCell>
                  <span className="text-sm font-medium">
                    {firm.max_allocations || '-'}
                  </span>
                </TableCell>

                {/* Promo */}
                <TableCell>
                  {firm.promo ? (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 text-xs">
                      {firm.promo}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
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
                    >
                      <Link href={`/firms/${firm.slug}`}>
                        <Info className="mr-1 h-3 w-3" />
                        Info
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-3">
        {filteredAndSortedFirms.map((firm, index) => (
          <div
            key={firm.id}
            className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className="flex flex-col gap-4">
              {/* Top: Logo, Name, Rating */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-pink-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </div>

                <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/firms/${firm.slug}`}
                    className="font-semibold hover:text-primary transition-colors block truncate"
                  >
                    {firm.name}
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">
                      {firm.overall_rating?.toFixed(1) || 'N/A'}
                    </span>
                    {firm.review_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({firm.review_count})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {firm.country && (
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <span className="ml-1 font-medium">{firm.country}</span>
                  </div>
                )}
                {firm.years_in_operation && (
                  <div>
                    <span className="text-muted-foreground">Years:</span>
                    <span className="ml-1 font-medium">{firm.years_in_operation}y</span>
                  </div>
                )}
                {firm.max_allocations && (
                  <div>
                    <span className="text-muted-foreground">Max Alloc:</span>
                    <span className="ml-1 font-medium">{firm.max_allocations}</span>
                  </div>
                )}
              </div>

              {/* Markets and Promo */}
              <div className="flex flex-wrap gap-2">
                {firm.markets && firm.markets.length > 0 && (
                  <>
                    {firm.markets.slice(0, 3).map((market, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {market}
                      </Badge>
                    ))}
                  </>
                )}
                {firm.promo && (
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 text-xs">
                    {firm.promo}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex-1"
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
                  className="flex-1"
                >
                  <Link href={`/firms/${firm.slug}`}>
                    <Info className="mr-1 h-3 w-3" />
                    Info
                  </Link>
                </Button>
              </div>
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
