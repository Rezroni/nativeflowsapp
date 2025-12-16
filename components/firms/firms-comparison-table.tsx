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
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FirmsComparisonTableProps {
  firms: FirmWithParsedData[]
}

type SortOption = 'rating' | 'name' | 'reviews' | 'country'

export function FirmsComparisonTable({ firms }: FirmsComparisonTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')

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

        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
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
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="font-semibold">FIRM</TableHead>
              <TableHead className="text-center font-semibold">RANK</TableHead>
              <TableHead className="text-center font-semibold">REVIEWS</TableHead>
              <TableHead className="text-center font-semibold">COUNTRY</TableHead>
              <TableHead className="text-center font-semibold">YEARS IN OPERATION</TableHead>
              <TableHead className="text-center font-semibold">ASSETS</TableHead>
              <TableHead className="text-center font-semibold">PLATFORMS</TableHead>
              <TableHead className="text-center font-semibold">MAX ALLOCATIONS</TableHead>
              <TableHead className="text-center font-semibold">PROMO</TableHead>
              <TableHead className="text-right font-semibold">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedFirms.map((firm, index) => (
              <TableRow key={firm.id} className="hover:bg-muted/30 transition-colors">
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

                {/* Firm Name with Logo and Rating */}
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[250px]">
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
                    <div>
                      <Link
                        href={`/firms/${firm.slug}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {firm.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
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
                        <span className="text-sm font-semibold ml-1">
                          {firm.overall_rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Rank */}
                <TableCell className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                </TableCell>

                {/* Reviews */}
                <TableCell className="text-center">
                  {firm.review_count > 0 && (
                    <div>
                      <Heart className="h-4 w-4 inline text-pink-500 mr-1" />
                      <span className="font-semibold">{firm.review_count.toLocaleString()}</span>
                    </div>
                  )}
                </TableCell>

                {/* Country */}
                <TableCell className="text-center">
                  {firm.regulation && firm.regulation.length > 0 ? (
                    <span className="text-sm">{firm.regulation[0]}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>

                {/* Years in Operation */}
                <TableCell className="text-center">
                  <span className="text-muted-foreground text-sm">-</span>
                </TableCell>

                {/* Assets */}
                <TableCell className="text-center">
                  {firm.markets && firm.markets.length > 0 ? (
                    <div className="flex gap-1 justify-center flex-wrap max-w-[150px]">
                      {firm.markets.slice(0, 4).map((market, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2 py-0">
                          {market}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>

                {/* Platforms */}
                <TableCell className="text-center">
                  {firm.trading_platforms && firm.trading_platforms.length > 0 ? (
                    <div className="flex gap-1 justify-center items-center">
                      {firm.trading_platforms.slice(0, 3).map((platform, idx) => (
                        <div key={idx} className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                          <span className="text-[10px] font-medium">
                            {platform.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>

                {/* Max Allocations */}
                <TableCell className="text-center">
                  {firm.maximum_leverage ? (
                    <div className="font-semibold text-sm">{firm.maximum_leverage}</div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>

                {/* Promo */}
                <TableCell className="text-center">
                  {firm.badges && firm.badges.length > 0 ? (
                    <Badge variant="secondary" className="bg-pink-500/10 text-pink-600 hover:bg-pink-500/20">
                      {firm.badges[0].text}
                    </Badge>
                  ) : null}
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
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Match
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-2"
                    >
                      <Link href={`/firms/${firm.slug}`}>
                        Firm
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
