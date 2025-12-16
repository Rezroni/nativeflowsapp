'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FirmWithParsedData, FirmFormData, FirmFeature, FirmBadge } from '@/types/firms'
import { createFirm, updateFirm } from '@/actions/firms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface FirmFormProps {
  firm?: FirmWithParsedData
  isEditing?: boolean
}

export function FirmForm({ firm, isEditing = false }: FirmFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic Information
  const [name, setName] = useState(firm?.name || '')
  const [slug, setSlug] = useState(firm?.slug || '')
  const [logoUrl, setLogoUrl] = useState(firm?.logo_url || '')
  const [description, setDescription] = useState(firm?.description || '')
  const [websiteUrl, setWebsiteUrl] = useState(firm?.website_url || '')

  // Ratings
  const [overallRating, setOverallRating] = useState(firm?.overall_rating?.toString() || '')
  const [platformRating, setPlatformRating] = useState(firm?.platform_rating?.toString() || '')
  const [executionRating, setExecutionRating] = useState(firm?.execution_rating?.toString() || '')
  const [supportRating, setSupportRating] = useState(firm?.support_rating?.toString() || '')
  const [feesRating, setFeesRating] = useState(firm?.fees_rating?.toString() || '')

  // Financial Details
  const [minimumDeposit, setMinimumDeposit] = useState(firm?.minimum_deposit?.toString() || '')
  const [minimumDepositCurrency, setMinimumDepositCurrency] = useState(
    firm?.minimum_deposit_currency || 'USD'
  )
  const [maximumLeverage, setMaximumLeverage] = useState(firm?.maximum_leverage || '')
  const [spreadsFrom, setSpreadsFrom] = useState(firm?.spreads_from?.toString() || '')

  // Features
  const [features, setFeatures] = useState<FirmFeature[]>(firm?.features || [])
  const [newFeatureName, setNewFeatureName] = useState('')

  // Trading Information (arrays)
  const [tradingPlatforms, setTradingPlatforms] = useState<string[]>(firm?.trading_platforms || [])
  const [newTradingPlatform, setNewTradingPlatform] = useState('')

  const [markets, setMarkets] = useState<string[]>(firm?.markets || [])
  const [newMarket, setNewMarket] = useState('')

  const [regulation, setRegulation] = useState<string[]>(firm?.regulation || [])
  const [newRegulation, setNewRegulation] = useState('')

  const [accountTypes, setAccountTypes] = useState<string[]>(firm?.account_types || [])
  const [newAccountType, setNewAccountType] = useState('')

  // Badges
  const [badges, setBadges] = useState<FirmBadge[]>(firm?.badges || [])
  const [newBadgeText, setNewBadgeText] = useState('')
  const [newBadgeVariant, setNewBadgeVariant] = useState<FirmBadge['variant']>('default')

  // Highlights
  const [isFeatured, setIsFeatured] = useState(firm?.is_featured || false)
  const [isTopRated, setIsTopRated] = useState(firm?.is_top_rated || false)

  // Additional Information
  const [pros, setPros] = useState<string[]>(firm?.pros || [])
  const [newPro, setNewPro] = useState('')

  const [cons, setCons] = useState<string[]>(firm?.cons || [])
  const [newCon, setNewCon] = useState('')

  // Social Proof
  const [reviewCount, setReviewCount] = useState(firm?.review_count?.toString() || '')
  const [userCount, setUserCount] = useState(firm?.user_count || '')

  // Status
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(firm?.status || 'draft')
  const [displayOrder, setDisplayOrder] = useState(firm?.display_order?.toString() || '0')

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    if (!isEditing) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(autoSlug)
    }
  }

  // Array management helpers
  const addFeature = () => {
    if (newFeatureName.trim()) {
      setFeatures([...features, { name: newFeatureName.trim(), available: true }])
      setNewFeatureName('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const toggleFeatureAvailability = (index: number) => {
    setFeatures(
      features.map((feature, i) =>
        i === index ? { ...feature, available: !feature.available } : feature
      )
    )
  }

  const addBadge = () => {
    if (newBadgeText.trim()) {
      setBadges([...badges, { text: newBadgeText.trim(), variant: newBadgeVariant }])
      setNewBadgeText('')
      setNewBadgeVariant('default')
    }
  }

  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index))
  }

  const addToArray = (
    arr: string[],
    setArr: (arr: string[]) => void,
    value: string,
    setValue: (value: string) => void
  ) => {
    if (value.trim()) {
      setArr([...arr, value.trim()])
      setValue('')
    }
  }

  const removeFromArray = (arr: string[], setArr: (arr: string[]) => void, index: number) => {
    setArr(arr.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !slug.trim()) {
      toast.error('Name and slug are required')
      return
    }

    setIsSubmitting(true)

    const formData: FirmFormData = {
      name: name.trim(),
      slug: slug.trim(),
      logo_url: logoUrl.trim() || undefined,
      description: description.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      overall_rating: overallRating ? parseFloat(overallRating) : undefined,
      platform_rating: platformRating ? parseFloat(platformRating) : undefined,
      execution_rating: executionRating ? parseFloat(executionRating) : undefined,
      support_rating: supportRating ? parseFloat(supportRating) : undefined,
      fees_rating: feesRating ? parseFloat(feesRating) : undefined,
      minimum_deposit: minimumDeposit ? parseFloat(minimumDeposit) : undefined,
      minimum_deposit_currency: minimumDepositCurrency,
      maximum_leverage: maximumLeverage.trim() || undefined,
      spreads_from: spreadsFrom ? parseFloat(spreadsFrom) : undefined,
      features: features.length > 0 ? features : undefined,
      trading_platforms: tradingPlatforms.length > 0 ? tradingPlatforms : undefined,
      markets: markets.length > 0 ? markets : undefined,
      regulation: regulation.length > 0 ? regulation : undefined,
      account_types: accountTypes.length > 0 ? accountTypes : undefined,
      badges: badges.length > 0 ? badges : undefined,
      is_featured: isFeatured,
      is_top_rated: isTopRated,
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
      review_count: reviewCount ? parseInt(reviewCount) : undefined,
      user_count: userCount.trim() || undefined,
      status,
      display_order: displayOrder ? parseInt(displayOrder) : 0,
    }

    const result = isEditing && firm
      ? await updateFirm(firm.id, formData)
      : await createFirm(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast.success(isEditing ? 'Firm updated successfully' : 'Firm created successfully')
      router.push('/admin/firms')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to save firm')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            General information about the firm or broker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., IC Markets"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., ic-markets"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the firm..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings</CardTitle>
          <CardDescription>Rating scores out of 5.0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overall-rating">Overall Rating</Label>
              <Input
                id="overall-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
                placeholder="4.8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-rating">Platform</Label>
              <Input
                id="platform-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={platformRating}
                onChange={(e) => setPlatformRating(e.target.value)}
                placeholder="4.7"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="execution-rating">Execution</Label>
              <Input
                id="execution-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={executionRating}
                onChange={(e) => setExecutionRating(e.target.value)}
                placeholder="4.9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-rating">Support</Label>
              <Input
                id="support-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={supportRating}
                onChange={(e) => setSupportRating(e.target.value)}
                placeholder="4.6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fees-rating">Fees</Label>
              <Input
                id="fees-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={feesRating}
                onChange={(e) => setFeesRating(e.target.value)}
                placeholder="4.8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Details */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
          <CardDescription>Deposit requirements and trading conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimum-deposit">Minimum Deposit</Label>
              <Input
                id="minimum-deposit"
                type="number"
                step="0.01"
                value={minimumDeposit}
                onChange={(e) => setMinimumDeposit(e.target.value)}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={minimumDepositCurrency}
                onChange={(e) => setMinimumDepositCurrency(e.target.value)}
                placeholder="USD"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leverage">Maximum Leverage</Label>
              <Input
                id="leverage"
                value={maximumLeverage}
                onChange={(e) => setMaximumLeverage(e.target.value)}
                placeholder="1:500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spreads">Spreads From</Label>
              <Input
                id="spreads"
                type="number"
                step="0.01"
                value={spreadsFrom}
                onChange={(e) => setSpreadsFrom(e.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>List of features and their availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="Feature name"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <Switch
                  checked={feature.available}
                  onCheckedChange={() => toggleFeatureAvailability(index)}
                />
                <span className="flex-1">{feature.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Information */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Information</CardTitle>
          <CardDescription>Platforms, markets, and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trading Platforms */}
          <div className="space-y-2">
            <Label>Trading Platforms</Label>
            <div className="flex gap-2">
              <Input
                value={newTradingPlatform}
                onChange={(e) => setNewTradingPlatform(e.target.value)}
                placeholder="e.g., MT4, MT5, cTrader"
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addToArray(tradingPlatforms, setTradingPlatforms, newTradingPlatform, setNewTradingPlatform))
                }
              />
              <Button
                type="button"
                onClick={() =>
                  addToArray(tradingPlatforms, setTradingPlatforms, newTradingPlatform, setNewTradingPlatform)
                }
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tradingPlatforms.map((platform, index) => (
                <Badge key={index} variant="secondary">
                  {platform}
                  <button
                    type="button"
                    onClick={() => removeFromArray(tradingPlatforms, setTradingPlatforms, index)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Markets */}
          <div className="space-y-2">
            <Label>Markets</Label>
            <div className="flex gap-2">
              <Input
                value={newMarket}
                onChange={(e) => setNewMarket(e.target.value)}
                placeholder="e.g., Forex, Stocks, Crypto"
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), addToArray(markets, setMarkets, newMarket, setNewMarket))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray(markets, setMarkets, newMarket, setNewMarket)}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {markets.map((market, index) => (
                <Badge key={index} variant="secondary">
                  {market}
                  <button
                    type="button"
                    onClick={() => removeFromArray(markets, setMarkets, index)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Regulation */}
          <div className="space-y-2">
            <Label>Regulation</Label>
            <div className="flex gap-2">
              <Input
                value={newRegulation}
                onChange={(e) => setNewRegulation(e.target.value)}
                placeholder="e.g., FCA, ASIC, CySEC"
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), addToArray(regulation, setRegulation, newRegulation, setNewRegulation))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray(regulation, setRegulation, newRegulation, setNewRegulation)}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {regulation.map((reg, index) => (
                <Badge key={index} variant="secondary">
                  {reg}
                  <button
                    type="button"
                    onClick={() => removeFromArray(regulation, setRegulation, index)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Account Types */}
          <div className="space-y-2">
            <Label>Account Types</Label>
            <div className="flex gap-2">
              <Input
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)}
                placeholder="e.g., Standard, ECN, Islamic"
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), addToArray(accountTypes, setAccountTypes, newAccountType, setNewAccountType))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray(accountTypes, setAccountTypes, newAccountType, setNewAccountType)}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {accountTypes.map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type}
                  <button
                    type="button"
                    onClick={() => removeFromArray(accountTypes, setAccountTypes, index)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Highlight special features or awards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newBadgeText}
              onChange={(e) => setNewBadgeText(e.target.value)}
              placeholder="Badge text"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
            />
            <Select
              value={newBadgeVariant}
              onValueChange={(value) => setNewBadgeVariant(value as FirmBadge['variant'])}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={addBadge} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant}>
                {badge.text}
                <button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pros and Cons */}
      <Card>
        <CardHeader>
          <CardTitle>Pros and Cons</CardTitle>
          <CardDescription>Advantages and disadvantages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pros */}
          <div className="space-y-2">
            <Label>Pros</Label>
            <div className="flex gap-2">
              <Input
                value={newPro}
                onChange={(e) => setNewPro(e.target.value)}
                placeholder="Add a pro"
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addToArray(pros, setPros, newPro, setNewPro))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray(pros, setPros, newPro, setNewPro)}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-1 mt-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="flex-1">✓ {pro}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromArray(pros, setPros, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Cons */}
          <div className="space-y-2">
            <Label>Cons</Label>
            <div className="flex gap-2">
              <Input
                value={newCon}
                onChange={(e) => setNewCon(e.target.value)}
                placeholder="Add a con"
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addToArray(cons, setCons, newCon, setNewCon))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray(cons, setCons, newCon, setNewCon)}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-1 mt-2">
              {cons.map((con, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="flex-1">✗ {con}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromArray(cons, setCons, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof & Status */}
      <Card>
        <CardHeader>
          <CardTitle>Social Proof & Status</CardTitle>
          <CardDescription>Review counts, user metrics, and publication status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="review-count">Review Count</Label>
              <Input
                id="review-count"
                type="number"
                value={reviewCount}
                onChange={(e) => setReviewCount(e.target.value)}
                placeholder="1247"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-count">User Count (Display)</Label>
              <Input
                id="user-count"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                placeholder="2.5M+"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="text-sm text-muted-foreground">Show in featured section</p>
              </div>
              <Switch
                id="featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="top-rated">Top Rated</Label>
                <p className="text-sm text-muted-foreground">Mark as top rated</p>
              </div>
              <Switch
                id="top-rated"
                checked={isTopRated}
                onCheckedChange={setIsTopRated}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="display-order">Display Order</Label>
              <Input
                id="display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/firms')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
            ? 'Update Firm'
            : 'Create Firm'}
        </Button>
      </div>
    </form>
  )
}
