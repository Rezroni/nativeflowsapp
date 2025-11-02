'use client';

/**
 * Status Animations Component
 *
 * Provides animated success, error, warning, and info indicators with various styles.
 * Includes checkmark bounce, error shake, and loading spinners.
 */

import { motion, Variants, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { bouncySpring } from '@/lib/animations/spring-configs';

// Animation variants for status icons
const checkmarkVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -180,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      ...bouncySpring,
      duration: 0.6,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const errorShakeVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Status type definition
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface StatusAnimationProps {
  status: StatusType;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
  className?: string;
  animate?: boolean;
}

/**
 * StatusAnimation Component
 *
 * Displays an animated status indicator with optional message.
 *
 * @example
 * ```tsx
 * <StatusAnimation status="success" message="Analysis complete!" />
 * <StatusAnimation status="error" message="Upload failed" />
 * <StatusAnimation status="loading" message="Processing..." />
 * ```
 */
export function StatusAnimation({
  status,
  message,
  size = 'md',
  showMessage = true,
  className,
  animate = true,
}: StatusAnimationProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const config = {
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      variants: checkmarkVariants,
      defaultMessage: 'Success!',
    },
    error: {
      icon: XCircle,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      variants: errorShakeVariants,
      defaultMessage: 'Error occurred',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      variants: checkmarkVariants,
      defaultMessage: 'Warning',
    },
    info: {
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      variants: checkmarkVariants,
      defaultMessage: 'Information',
    },
    loading: {
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      variants: spinnerVariants,
      defaultMessage: 'Loading...',
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;
  const displayMessage = message || statusConfig.defaultMessage;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          variants={animate ? statusConfig.variants : undefined}
          initial={animate ? 'hidden' : undefined}
          animate={animate ? (status === 'error' ? ['visible', 'shake'] : status === 'loading' ? 'spin' : 'visible') : undefined}
          exit={animate ? 'exit' : undefined}
          className={cn(
            'rounded-full border-2 flex items-center justify-center',
            sizeClasses[size],
            statusConfig.bgColor,
            statusConfig.borderColor
          )}
        >
          <Icon className={cn(sizeClasses[size], statusConfig.color)} />
        </motion.div>
      </AnimatePresence>

      {showMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            'font-medium text-center',
            textSizeClasses[size],
            statusConfig.color
          )}
        >
          {displayMessage}
        </motion.p>
      )}
    </div>
  );
}

/**
 * SuccessCheckmark Component
 *
 * Standalone animated success checkmark with bounce effect.
 *
 * @example
 * ```tsx
 * <SuccessCheckmark />
 * <SuccessCheckmark size="lg" message="Upload successful!" />
 * ```
 */
export function SuccessCheckmark({
  size = 'md',
  message,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}) {
  return (
    <StatusAnimation
      status="success"
      size={size}
      message={message}
      className={className}
    />
  );
}

/**
 * ErrorIcon Component
 *
 * Standalone animated error icon with shake effect.
 *
 * @example
 * ```tsx
 * <ErrorIcon />
 * <ErrorIcon size="lg" message="Upload failed!" />
 * ```
 */
export function ErrorIcon({
  size = 'md',
  message,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}) {
  return (
    <StatusAnimation
      status="error"
      size={size}
      message={message}
      className={className}
    />
  );
}

/**
 * LoadingSpinner Component
 *
 * Standalone animated loading spinner.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" message="Processing your chart..." />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  message,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}) {
  return (
    <StatusAnimation
      status="loading"
      size={size}
      message={message}
      className={className}
    />
  );
}

/**
 * StatusBadge Component
 *
 * Compact animated status badge with icon and text.
 *
 * @example
 * ```tsx
 * <StatusBadge status="success" text="Completed" />
 * <StatusBadge status="error" text="Failed" />
 * ```
 */
export function StatusBadge({
  status,
  text,
  className,
}: {
  status: StatusType;
  text: string;
  className?: string;
}) {
  const config = {
    success: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    error: {
      icon: XCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    info: {
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    loading: {
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
  };

  const statusConfig = config[status];
  const Icon = statusConfig.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
        statusConfig.bgColor,
        statusConfig.borderColor,
        className
      )}
    >
      {status === 'loading' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Icon className={cn('h-4 w-4', statusConfig.color)} />
        </motion.div>
      ) : (
        <Icon className={cn('h-4 w-4', statusConfig.color)} />
      )}
      <span className={cn('text-sm font-medium', statusConfig.color)}>
        {text}
      </span>
    </motion.div>
  );
}

/**
 * PulsingDot Component
 *
 * Animated pulsing dot indicator for status.
 *
 * @example
 * ```tsx
 * <PulsingDot color="emerald" />
 * <PulsingDot color="rose" size="lg" />
 * ```
 */
export function PulsingDot({
  color = 'primary',
  size = 'md',
  className,
}: {
  color?: 'primary' | 'emerald' | 'rose' | 'amber' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const colorClasses = {
    primary: 'bg-primary',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  };

  return (
    <motion.div
      variants={pulseVariants}
      animate="pulse"
      className={cn(
        'rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}
