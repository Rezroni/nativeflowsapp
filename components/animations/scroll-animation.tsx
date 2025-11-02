'use client';

/**
 * Scroll Animation Components
 *
 * Ready-to-use components for scroll-based animations.
 * Wraps content with fade-in, slide-in, and scale effects on scroll.
 */

import { motion, Variants } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

// Animation variants for scroll effects
const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const fadeInDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const fadeInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const fadeInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const slideInUpVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Animation type definition
export type ScrollAnimationType =
  | 'fade'
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scale'
  | 'slideUp';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

/**
 * ScrollAnimation Component
 *
 * Wraps content with scroll-triggered animations.
 * Content animates in when it enters the viewport.
 *
 * @example
 * ```tsx
 * <ScrollAnimation animation="fadeUp">
 *   <Card>Content</Card>
 * </ScrollAnimation>
 *
 * <ScrollAnimation animation="scale" delay={0.2}>
 *   <div>Delayed content</div>
 * </ScrollAnimation>
 * ```
 */
export function ScrollAnimation({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  threshold = 0.3,
}: ScrollAnimationProps) {
  const { ref, isInView } = useScrollAnimation({
    once,
    amount: threshold,
  });

  const variantMap: Record<ScrollAnimationType, Variants> = {
    fade: fadeInVariants,
    fadeUp: fadeInUpVariants,
    fadeDown: fadeInDownVariants,
    fadeLeft: fadeInLeftVariants,
    fadeRight: fadeInRightVariants,
    scale: scaleInVariants,
    slideUp: slideInUpVariants,
  };

  const variants = variantMap[animation];

  // Apply custom duration and delay
  const customVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...(typeof variants.visible === 'object' ? variants.visible : {}),
      transition: {
        duration,
        delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollFadeIn Component
 *
 * Simple fade-in animation on scroll.
 *
 * @example
 * ```tsx
 * <ScrollFadeIn>
 *   <p>Fades in when visible</p>
 * </ScrollFadeIn>
 * ```
 */
export function ScrollFadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <ScrollAnimation animation="fade" delay={delay} className={className}>
      {children}
    </ScrollAnimation>
  );
}

/**
 * ScrollSlideUp Component
 *
 * Slide up animation with fade on scroll.
 *
 * @example
 * ```tsx
 * <ScrollSlideUp>
 *   <Card>Slides up when visible</Card>
 * </ScrollSlideUp>
 * ```
 */
export function ScrollSlideUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <ScrollAnimation animation="fadeUp" delay={delay} className={className}>
      {children}
    </ScrollAnimation>
  );
}

/**
 * ScrollScale Component
 *
 * Scale in animation on scroll.
 *
 * @example
 * ```tsx
 * <ScrollScale>
 *   <div>Scales in when visible</div>
 * </ScrollScale>
 * ```
 */
export function ScrollScale({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <ScrollAnimation animation="scale" delay={delay} className={className}>
      {children}
    </ScrollAnimation>
  );
}

/**
 * StaggeredCards Component
 *
 * Container for cards that animate in with stagger effect on scroll.
 *
 * @example
 * ```tsx
 * <StaggeredCards>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggeredCards>
 * ```
 */
export function StaggeredCards({
  children,
  staggerDelay = 0.1,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const { ref, isInView } = useScrollAnimation();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/**
 * RevealOnScroll Component
 *
 * Reveals content with a clip-path animation.
 *
 * @example
 * ```tsx
 * <RevealOnScroll direction="left">
 *   <Image src="/hero.jpg" alt="Hero" />
 * </RevealOnScroll>
 * ```
 */
export function RevealOnScroll({
  children,
  direction = 'bottom',
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  className?: string;
}) {
  const { ref, isInView } = useScrollAnimation();

  const clipPathVariants: Record<typeof direction, { hidden: string; visible: string }> = {
    left: {
      hidden: 'inset(0 100% 0 0)',
      visible: 'inset(0 0% 0 0)',
    },
    right: {
      hidden: 'inset(0 0 0 100%)',
      visible: 'inset(0 0 0 0)',
    },
    top: {
      hidden: 'inset(0 0 100% 0)',
      visible: 'inset(0 0 0% 0)',
    },
    bottom: {
      hidden: 'inset(100% 0 0 0)',
      visible: 'inset(0% 0 0 0)',
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clipPathVariants[direction].hidden }}
      animate={{
        clipPath: isInView
          ? clipPathVariants[direction].visible
          : clipPathVariants[direction].hidden,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: 'easeInOut',
      }}
      className={cn('overflow-hidden', className)}
    >
      {children}
    </motion.div>
  );
}
