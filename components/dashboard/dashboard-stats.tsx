'use client';

/**
 * Dashboard Stats Component
 *
 * Client component for animated dashboard statistics cards.
 * Features count-up animations and staggered card appearance.
 */

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnimatedCounter } from '@/components/animations/animated-counter';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations/variants';

interface DashboardStatsProps {
  totalAnalyses: number;
  monthlyAnalyses: number;
  currentPlan: string | null;
  hasActivePlan: boolean;
  lastAnalysisDate?: string;
  lastAnalysisTime?: string;
}

export function DashboardStats({
  totalAnalyses,
  monthlyAnalyses,
  currentPlan,
  hasActivePlan,
  lastAnalysisDate,
  lastAnalysisTime,
}: DashboardStatsProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {/* Total Analyses */}
      <motion.div variants={staggerItemVariants}>
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Analyses
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={totalAnalyses} duration={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              All time chart analyses
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* This Month */}
      <motion.div variants={staggerItemVariants}>
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={monthlyAnalyses} duration={2} />
            </div>
            <p className="text-xs text-muted-foreground">
              {hasActivePlan ? 'Unlimited analyses' : 'No active plan'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={staggerItemVariants}>
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-2xl font-bold capitalize"
            >
              {currentPlan || 'No Plan'}
            </motion.div>
            <p className="text-xs text-muted-foreground mb-3">
              {hasActivePlan ? 'Unlimited analyses' : 'Subscribe to start analyzing'}
            </p>
            {!hasActivePlan && (
              <Link href="/pricing">
                <Button size="sm" className="w-full text-xs">
                  View Plans
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Last Analysis */}
      <motion.div variants={staggerItemVariants}>
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-2xl font-bold"
            >
              {lastAnalysisDate || 'Never'}
            </motion.div>
            <p className="text-xs text-muted-foreground">
              {lastAnalysisTime || 'Upload your first chart'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
