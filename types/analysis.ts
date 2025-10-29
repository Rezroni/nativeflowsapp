export type TrendType = 'bullish' | 'bearish' | 'ranging'
export type PhaseType = 'accumulation' | 'markup' | 'distribution' | 'markdown'
export type StrengthType = 'strong' | 'moderate' | 'weak'
export type ConfidenceLevel = 'high' | 'medium' | 'low'
export type SignificanceLevel = 'high' | 'medium' | 'low'

export interface BOSLevel {
  price: number
  type: 'bullish' | 'bearish'
  date: string
}

export interface CHoCHLevel {
  price: number
  type: 'bullish' | 'bearish'
  date: string
}

export interface MarketStructure {
  trend: TrendType
  phase: PhaseType
  strength: StrengthType
  bos_levels: BOSLevel[]
  choch_levels: CHoCHLevel[]
}

export interface OrderBlock {
  type: 'bullish' | 'bearish'
  high: number
  low: number
  strength: StrengthType
  tested: boolean
  reasoning: string
}

export interface FairValueGap {
  type: 'bullish' | 'bearish'
  high: number
  low: number
  filled: boolean
  significance: SignificanceLevel
}

export interface LiquidityZone {
  type: 'equal_highs' | 'equal_lows' | 'stop_hunt'
  levels: number[]
  swept: boolean
  description: string
}

export interface PremiumDiscount {
  equilibrium: number
  premium_high: number
  discount_low: number
  current_position: 'premium' | 'equilibrium' | 'discount'
  range_percentage: number
}

export interface EntryZone {
  zone_type: 'order_block' | 'fvg' | 'liquidity'
  price: number
  entry_type: 'market' | 'limit' | 'stop'
}

export interface StopLoss {
  price: number
  reasoning: string
}

export interface TakeProfit {
  price: number
  target: 'tp1' | 'tp2' | 'tp3'
  percentage: string
}

export interface Invalidation {
  price: number
  condition: string
}

export interface TradeSetup {
  type: 'long' | 'short'
  entry: EntryZone
  stop_loss: StopLoss
  take_profit: TakeProfit[]
  risk_reward: string
  confluence_rating: 'high' | 'medium' | 'low'
  probability: number
  time_sensitivity: string
  invalidation: Invalidation
  notes: string
}

export interface EducationalInsights {
  key_concepts: string[]
  smart_money_perspective: string
  common_mistakes: string
  learning_points: string[]
}

export interface AnalysisResult {
  id?: string
  userId?: string
  imageUrl?: string
  analysisData?: {
    disclaimer: string
    market_structure: MarketStructure
    order_blocks: OrderBlock[]
    fair_value_gaps: FairValueGap[]
    liquidity_zones: LiquidityZone[]
    premium_discount: PremiumDiscount
    trade_setups: TradeSetup[]
    educational_insights: EducationalInsights
    summary: string
    confidence: ConfidenceLevel
    next_steps: string
  }
  createdAt?: string
  metadata?: {
    model?: string
    tokensUsed?: number
    provider?: string
  }
  // Legacy fields for backward compatibility
  disclaimer?: string
  market_structure?: MarketStructure
  order_blocks?: OrderBlock[]
  fair_value_gaps?: FairValueGap[]
  liquidity_zones?: LiquidityZone[]
  premium_discount?: PremiumDiscount
  trade_setups?: TradeSetup[]
  educational_insights?: EducationalInsights
  summary?: string
  confidence?: ConfidenceLevel
  next_steps?: string
  imageHash?: string
  analysisDuration?: number
  cacheHit?: boolean
  timestamp?: string
}
