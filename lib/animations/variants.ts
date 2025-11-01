/**
 * Animation Variants Library
 *
 * Reusable Framer Motion animation variants for consistent animations throughout the app.
 * These variants follow modern animation principles with proper easing and timing.
 *
 * @module lib/animations/variants
 */

import { Variants } from 'framer-motion';

/**
 * Animation duration constants (in seconds)
 * Following Material Design and iOS Human Interface Guidelines
 */
export const duration = {
  instant: 0,
  fast: 0.15,      // 150ms - Quick interactions
  normal: 0.3,     // 300ms - Standard animations
  slow: 0.5,       // 500ms - Emphasis animations
  slower: 0.7,     // 700ms - Complex animations
} as const;

/**
 * Easing functions for natural motion
 * Based on cubic-bezier curves
 */
export const easing = {
  // Standard easing for most animations
  smooth: [0.4, 0.0, 0.2, 1],          // ease-in-out

  // Emphasized easing for important elements
  emphasized: [0.05, 0.7, 0.1, 1.0],   // Material Design emphasized

  // Decelerated easing for exits
  decelerate: [0.0, 0.0, 0.2, 1],      // ease-out

  // Accelerated easing for entrances
  accelerate: [0.4, 0.0, 1, 1],        // ease-in

  // Bouncy easing for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55],  // Bouncy effect

  // Sharp easing for quick snappy animations
  sharp: [0.4, 0.0, 0.6, 1],           // Quick snap
} as const;

/**
 * Fade animations
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
};

/**
 * Fade in with slight upward movement
 * Perfect for content appearing from below
 */
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

/**
 * Fade in with slight downward movement
 * Perfect for dropdowns and modals
 */
export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

/**
 * Slide from left animations
 * Perfect for page transitions
 */
export const slideLeftVariants: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.accelerate,
    },
  },
};

/**
 * Slide from right animations
 * Perfect for page transitions (forward navigation)
 */
export const slideRightVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.normal,
      ease: easing.accelerate,
    },
  },
};

/**
 * Scale animations
 * Perfect for modals, dialogs, and popovers
 */
export const scaleVariants: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
};

/**
 * Scale with bounce
 * Perfect for success messages and celebrations
 */
export const scaleBounceVariants: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.bounce,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
};

/**
 * Stagger container
 * Perfect for lists and grids
 */
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger item
 * Used inside staggerContainer
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.fast,
      ease: easing.accelerate,
    },
  },
};

/**
 * Rotate animations
 * Perfect for loading spinners and icons
 */
export const rotateVariants: Variants = {
  hidden: {
    rotate: -180,
    opacity: 0,
  },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.emphasized,
    },
  },
  exit: {
    rotate: 180,
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
};

/**
 * Blur animations
 * Perfect for focus/blur effects
 */
export const blurVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      duration: duration.fast,
      ease: easing.decelerate,
    },
  },
};

/**
 * Shimmer loading animation
 * Perfect for skeleton loaders
 */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Pulse animation
 * Perfect for drawing attention
 */
export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: easing.smooth,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Shake animation
 * Perfect for error states
 */
export const shakeVariants: Variants = {
  initial: {
    x: 0,
  },
  animate: {
    x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
    transition: {
      duration: 0.5,
      ease: easing.sharp,
    },
  },
};

/**
 * Success checkmark animation
 * Perfect for success messages
 */
export const checkmarkVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: duration.slow,
        ease: easing.emphasized,
      },
      opacity: {
        duration: duration.fast,
      },
    },
  },
};

/**
 * Card hover interaction
 * Perfect for interactive cards
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      ease: easing.smooth,
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: duration.fast,
      ease: easing.emphasized,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: duration.instant,
    },
  },
};

/**
 * Button interaction
 * Perfect for all button types
 */
export const buttonVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: duration.fast,
      ease: easing.emphasized,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: duration.instant,
    },
  },
};

/**
 * Icon button interaction
 * Smaller scale changes for icon-only buttons
 */
export const iconButtonVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: duration.fast,
      ease: easing.emphasized,
    },
  },
  tap: {
    scale: 0.9,
    rotate: 5,
    transition: {
      duration: duration.instant,
    },
  },
};

/**
 * Helper function to check if user prefers reduced motion
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Helper function to get reduced motion variants
 * Returns instant transitions if user prefers reduced motion
 */
export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (!shouldReduceMotion()) return variants;

  const reducedVariants: Variants = {};

  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (typeof variant === 'object') {
      reducedVariants[key] = {
        ...variant,
        transition: {
          duration: 0,
        },
      };
    }
  });

  return reducedVariants;
};

/**
 * Export all variants as a collection
 */
export const animationVariants = {
  fade: fadeVariants,
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  scaleBounce: scaleBounceVariants,
  staggerContainer: staggerContainerVariants,
  staggerItem: staggerItemVariants,
  rotate: rotateVariants,
  blur: blurVariants,
  shimmer: shimmerVariants,
  pulse: pulseVariants,
  shake: shakeVariants,
  checkmark: checkmarkVariants,
  cardHover: cardHoverVariants,
  button: buttonVariants,
  iconButton: iconButtonVariants,
} as const;

export default animationVariants;
