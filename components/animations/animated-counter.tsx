'use client';

/**
 * Animated Counter Component
 *
 * Provides smooth count-up animations for numeric stats.
 * Uses framer-motion and easing functions for natural animations.
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { smoothSpring } from '@/lib/animations/spring-configs';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * AnimatedCounter Component
 *
 * Animates a number from 0 to the target value with a smooth counting effect.
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1234} />
 * <AnimatedCounter value={45} suffix="%" />
 * <AnimatedCounter value={9999} prefix="$" decimals={2} />
 * ```
 */
export function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  className,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    const animation = animate(count, value, {
      duration,
      ease: 'easeOut',
    });

    return animation.stop;
  }, [count, value, duration]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

/**
 * SpringCounter Component
 *
 * Animates a number with spring physics for a more bouncy feel.
 *
 * @example
 * ```tsx
 * <SpringCounter value={42} />
 * <SpringCounter value={100} suffix=" analyses" />
 * ```
 */
export function SpringCounter({
  value,
  decimals = 0,
  className,
  suffix = '',
  prefix = '',
}: Omit<AnimatedCounterProps, 'duration'>) {
  const count = useMotionValue(0);
  const spring = useSpring(count, smoothSpring);
  const rounded = useTransform(spring, (latest) => {
    return prefix + Math.round(latest).toFixed(decimals) + suffix;
  });

  useEffect(() => {
    count.set(value);
  }, [count, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

/**
 * PercentageCounter Component
 *
 * Specialized counter for percentage values with automatic formatting.
 *
 * @example
 * ```tsx
 * <PercentageCounter value={85} />
 * <PercentageCounter value={42.5} decimals={1} />
 * ```
 */
export function PercentageCounter({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      value={value}
      decimals={decimals}
      suffix="%"
      className={className}
      duration={1.5}
    />
  );
}

/**
 * CurrencyCounter Component
 *
 * Specialized counter for currency values with automatic formatting.
 *
 * @example
 * ```tsx
 * <CurrencyCounter value={1234.56} symbol="$" />
 * <CurrencyCounter value={999} symbol="€" decimals={0} />
 * ```
 */
export function CurrencyCounter({
  value,
  symbol = '$',
  decimals = 2,
  className,
}: {
  value: number;
  symbol?: string;
  decimals?: number;
  className?: string;
}) {
  return (
    <AnimatedCounter
      value={value}
      decimals={decimals}
      prefix={symbol}
      className={className}
      duration={2}
    />
  );
}

/**
 * StatsCard Counter Component
 *
 * Optimized counter component for dashboard stat cards.
 * Includes fade-in animation along with the count-up effect.
 *
 * @example
 * ```tsx
 * <StatsCounter value={42} label="Total Analyses" />
 * <StatsCounter value={85} label="Success Rate" suffix="%" />
 * ```
 */
export function StatsCounter({
  value,
  label,
  icon,
  suffix = '',
  prefix = '',
  decimals = 0,
  className,
}: {
  value: number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">
        <AnimatedCounter
          value={value}
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
        />
      </div>
    </motion.div>
  );
}
