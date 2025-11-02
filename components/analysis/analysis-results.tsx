'use client';

/**
 * Analysis Results Component
 *
 * Client component wrapper for displaying analysis results with animations.
 * Provides staggered fade-in animations for result cards.
 */

import { motion } from 'framer-motion';
import { MarketStructureCard } from '@/components/smc/market-structure-card';
import { OrderBlockCard } from '@/components/smc/order-block-card';
import { FVGCard } from '@/components/smc/fvg-card';
import { LiquidityCard } from '@/components/smc/liquidity-card';
import { PremiumDiscountCard } from '@/components/smc/premium-discount-card';
import { TradeSetupCard } from '@/components/smc/trade-setup-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations/variants';

interface AnalysisResultsProps {
  marketStructure: any;
  tradeSetup: any;
  premiumDiscount: any;
  orderBlocks: any[];
  fvgs: any[];
  liquidity: any;
  educationalInsights: any;
}

export function AnalysisResults({
  marketStructure,
  tradeSetup,
  premiumDiscount,
  orderBlocks,
  fvgs,
  liquidity,
  educationalInsights,
}: AnalysisResultsProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Primary Analysis Results */}
      <motion.div
        variants={staggerItemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Market Structure */}
        {marketStructure && (
          <motion.div variants={staggerItemVariants}>
            <MarketStructureCard structure={marketStructure} />
          </motion.div>
        )}

        {/* Trade Setup */}
        {tradeSetup && (
          <motion.div variants={staggerItemVariants}>
            <TradeSetupCard setup={tradeSetup} />
          </motion.div>
        )}
      </motion.div>

      {/* Premium/Discount Zones */}
      {premiumDiscount && (
        <motion.div variants={staggerItemVariants} className="mb-8">
          <PremiumDiscountCard premiumDiscount={premiumDiscount} />
        </motion.div>
      )}

      {/* Order Blocks */}
      {orderBlocks && orderBlocks.length > 0 && (
        <motion.div variants={staggerItemVariants} className="mb-8">
          <motion.h2
            variants={staggerItemVariants}
            className="text-2xl font-bold mb-4"
          >
            Order Blocks
          </motion.h2>
          <motion.div
            variants={staggerContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {orderBlocks.map((ob: any, index: number) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <OrderBlockCard orderBlock={ob} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Fair Value Gaps */}
      {fvgs && fvgs.length > 0 && (
        <motion.div variants={staggerItemVariants} className="mb-8">
          <motion.h2
            variants={staggerItemVariants}
            className="text-2xl font-bold mb-4"
          >
            Fair Value Gaps
          </motion.h2>
          <motion.div
            variants={staggerContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {fvgs.map((fvg: any, index: number) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <FVGCard fvg={fvg} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Liquidity */}
      {liquidity && liquidity.type && (
        <motion.div variants={staggerItemVariants} className="mb-8">
          <LiquidityCard liquidity={liquidity} />
        </motion.div>
      )}

      {/* Educational Insights */}
      {educationalInsights && (
        <motion.div variants={staggerItemVariants}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Educational Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Concepts */}
              {educationalInsights.key_concepts && educationalInsights.key_concepts.length > 0 && (
                <motion.div variants={staggerItemVariants}>
                  <h3 className="font-semibold mb-2">Key Concepts</h3>
                  <motion.div
                    variants={staggerContainerVariants}
                    className="flex flex-wrap gap-2"
                  >
                    {educationalInsights.key_concepts.map((concept: string, index: number) => (
                      <motion.div
                        key={index}
                        variants={staggerItemVariants}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {concept}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Smart Money Perspective */}
              {educationalInsights.smart_money_perspective && (
                <motion.div variants={staggerItemVariants}>
                  <h3 className="font-semibold mb-2">Smart Money Perspective</h3>
                  <p className="text-sm text-muted-foreground">
                    {educationalInsights.smart_money_perspective}
                  </p>
                </motion.div>
              )}

              {/* Common Mistakes */}
              {educationalInsights.common_mistakes && (
                <motion.div variants={staggerItemVariants}>
                  <h3 className="font-semibold mb-2">Common Mistakes to Avoid</h3>
                  <p className="text-sm text-muted-foreground">
                    {educationalInsights.common_mistakes}
                  </p>
                </motion.div>
              )}

              {/* Learning Points */}
              {educationalInsights.learning_points && educationalInsights.learning_points.length > 0 && (
                <motion.div variants={staggerItemVariants}>
                  <h3 className="font-semibold mb-2">Learning Points</h3>
                  <motion.ul
                    variants={staggerContainerVariants}
                    className="space-y-2"
                  >
                    {educationalInsights.learning_points.map((point: string, index: number) => (
                      <motion.li
                        key={index}
                        variants={staggerItemVariants}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-blue-600 mt-0.5">📚</span>
                        <span className="text-muted-foreground">{point}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
