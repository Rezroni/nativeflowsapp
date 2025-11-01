/**
 * Shimmer Loading Component
 *
 * Skeleton loading component with shimmer animation effect.
 * Perfect for indicating loading states while content is being fetched.
 *
 * @module components/animations/shimmer
 */

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shimmerVariants, shouldReduceMotion } from '@/lib/animations/variants';

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the shimmer element
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the shimmer element
   * @default '1rem'
   */
  height?: string | number;
  /**
   * Border radius
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /**
   * Disable shimmer animation
   * @default false
   */
  static?: boolean;
}

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * Shimmer Loading Component
 *
 * @example
 * ```tsx
 * <Shimmer width="100%" height="2rem" rounded="md" />
 * ```
 */
export function Shimmer({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  static: isStatic = false,
  className,
  style,
  ...props
}: ShimmerProps) {
  const shouldAnimate = !isStatic && !shouldReduceMotion();

  const shimmerStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  if (shouldAnimate) {
    return (
      <motion.div
        className={cn(
          'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted',
          'bg-[length:200%_100%]',
          roundedClasses[rounded],
          className
        )}
        style={shimmerStyle}
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        {...props}
      />
    );
  }

  // Static version without animation
  return (
    <div
      className={cn(
        'bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={shimmerStyle}
      {...props}
    />
  );
}

/**
 * Shimmer Line
 * Pre-configured shimmer for text lines
 *
 * @example
 * ```tsx
 * <ShimmerLine />
 * <ShimmerLine width="80%" />
 * ```
 */
export function ShimmerLine({
  width = '100%',
  className,
  ...props
}: Omit<ShimmerProps, 'height' | 'rounded'>) {
  return (
    <Shimmer
      width={width}
      height="0.875rem"
      rounded="sm"
      className={className}
      {...props}
    />
  );
}

/**
 * Shimmer Circle
 * Pre-configured shimmer for avatars and icons
 *
 * @example
 * ```tsx
 * <ShimmerCircle size="3rem" />
 * ```
 */
export function ShimmerCircle({
  size = '2.5rem',
  className,
  ...props
}: Omit<ShimmerProps, 'width' | 'height' | 'rounded'> & {
  size?: string | number;
}) {
  return (
    <Shimmer
      width={size}
      height={size}
      rounded="full"
      className={className}
      {...props}
    />
  );
}

/**
 * Shimmer Card
 * Pre-configured shimmer for card components
 *
 * @example
 * ```tsx
 * <ShimmerCard />
 * ```
 */
export function ShimmerCard({
  width = '100%',
  height = '200px',
  className,
  ...props
}: Omit<ShimmerProps, 'rounded'>) {
  return (
    <Shimmer
      width={width}
      height={height}
      rounded="lg"
      className={cn('p-6', className)}
      {...props}
    />
  );
}

/**
 * Shimmer Button
 * Pre-configured shimmer for button components
 *
 * @example
 * ```tsx
 * <ShimmerButton />
 * ```
 */
export function ShimmerButton({
  width = '120px',
  className,
  ...props
}: Omit<ShimmerProps, 'height' | 'rounded'>) {
  return (
    <Shimmer
      width={width}
      height="2.5rem"
      rounded="md"
      className={className}
      {...props}
    />
  );
}

/**
 * Shimmer Text Block
 * Multiple lines of shimmer text with varying widths
 *
 * @example
 * ```tsx
 * <ShimmerTextBlock lines={3} />
 * ```
 */
export function ShimmerTextBlock({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ['100%', '95%', '90%', '85%', '80%'];

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <ShimmerLine
          key={index}
          width={widths[index % widths.length]}
        />
      ))}
    </div>
  );
}

/**
 * Shimmer Table Row
 * Pre-configured shimmer for table rows
 *
 * @example
 * ```tsx
 * <ShimmerTableRow columns={4} />
 * ```
 */
export function ShimmerTableRow({
  columns = 3,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      {Array.from({ length: columns }).map((_, index) => (
        <Shimmer
          key={index}
          width={`${100 / columns}%`}
          height="1rem"
          rounded="sm"
        />
      ))}
    </div>
  );
}

/**
 * Shimmer Analysis Card
 * Pre-configured shimmer for analysis result cards
 *
 * @example
 * ```tsx
 * <ShimmerAnalysisCard />
 * ```
 */
export function ShimmerAnalysisCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4 p-6 border rounded-lg bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShimmerCircle size="3rem" />
        <div className="flex-1 space-y-2">
          <ShimmerLine width="60%" />
          <ShimmerLine width="40%" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <ShimmerLine width="100%" />
        <ShimmerLine width="95%" />
        <ShimmerLine width="90%" />
      </div>

      {/* Footer */}
      <div className="flex gap-2">
        <ShimmerButton width="100px" />
        <ShimmerButton width="120px" />
      </div>
    </div>
  );
}

/**
 * Shimmer Dashboard Stats
 * Pre-configured shimmer for dashboard statistics
 *
 * @example
 * ```tsx
 * <ShimmerDashboardStats count={4} />
 * ```
 */
export function ShimmerDashboardStats({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-6 border rounded-lg bg-card space-y-3">
          <ShimmerLine width="50%" />
          <Shimmer width="100px" height="2rem" rounded="md" />
          <ShimmerLine width="70%" />
        </div>
      ))}
    </div>
  );
}

export default Shimmer;
