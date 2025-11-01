/**
 * Page Transition Component
 *
 * Provides smooth page transitions using Framer Motion.
 * Automatically detects navigation direction and applies appropriate animations.
 * Respects user's motion preferences (prefers-reduced-motion).
 *
 * @module components/animations/page-transition
 */

'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { fadeVariants, slideRightVariants, slideLeftVariants, shouldReduceMotion } from '@/lib/animations/variants';
import { smoothSpring } from '@/lib/animations/spring-configs';

/**
 * Page transition types
 */
export type TransitionType = 'fade' | 'slide' | 'none';

/**
 * Page transition direction
 */
export type TransitionDirection = 'forward' | 'backward' | 'none';

interface PageTransitionProps {
  children: ReactNode;
  /**
   * Type of transition animation
   * @default 'fade'
   */
  type?: TransitionType;
  /**
   * Custom transition variants
   */
  variants?: Variants;
  /**
   * Disable transitions globally
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom className for the wrapper
   */
  className?: string;
}

/**
 * Get transition variants based on type and direction
 */
const getTransitionVariants = (
  type: TransitionType,
  direction: TransitionDirection
): Variants => {
  // Respect reduced motion preference
  if (shouldReduceMotion()) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }

  switch (type) {
    case 'slide':
      return direction === 'forward' ? slideRightVariants : slideLeftVariants;
    case 'fade':
      return fadeVariants;
    case 'none':
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 1 },
      };
    default:
      return fadeVariants;
  }
};

/**
 * Page Transition Component
 *
 * Wrap your page content with this component to add smooth transitions
 *
 * @example
 * ```tsx
 * <PageTransition type="slide">
 *   <YourPageContent />
 * </PageTransition>
 * ```
 *
 * @example With custom variants
 * ```tsx
 * <PageTransition variants={myCustomVariants}>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  type = 'fade',
  variants: customVariants,
  disabled = false,
  className,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState<TransitionDirection>('forward');
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Detect navigation direction
  useEffect(() => {
    if (prevPathname === pathname) return;

    // Determine direction based on route hierarchy
    // This is a simple implementation - can be enhanced with route history
    const prevSegments = prevPathname.split('/').filter(Boolean);
    const currentSegments = pathname.split('/').filter(Boolean);

    if (currentSegments.length > prevSegments.length) {
      setDirection('forward');
    } else if (currentSegments.length < prevSegments.length) {
      setDirection('backward');
    } else {
      setDirection('none');
    }

    setPrevPathname(pathname);
  }, [pathname, prevPathname]);

  // If transitions are disabled, render children directly
  if (disabled) {
    return <>{children}</>;
  }

  // Get appropriate variants
  const variants = customVariants || getTransitionVariants(type, direction);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className={className}
        // Prevent layout shift during animation
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Page Transition with Spring
 *
 * Alternative version using spring physics for more natural motion
 *
 * @example
 * ```tsx
 * <PageTransitionSpring>
 *   <YourPageContent />
 * </PageTransitionSpring>
 * ```
 */
export function PageTransitionSpring({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  const springVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: smoothSpring,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: smoothSpring,
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={shouldReduceMotion() ? fadeVariants : springVariants}
        className={className}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Modal Transition Component
 *
 * Optimized transition for modals and dialogs
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <ModalTransition>
 *       <YourModalContent />
 *     </ModalTransition>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function ModalTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        ...smoothSpring,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={shouldReduceMotion() ? fadeVariants : modalVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Drawer Transition Component
 *
 * Optimized transition for side drawers and panels
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <DrawerTransition side="right">
 *       <YourDrawerContent />
 *     </DrawerTransition>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function DrawerTransition({
  children,
  side = 'right',
  className,
}: {
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}) {
  const getDrawerVariants = (): Variants => {
    const offset = {
      left: { x: '-100%', y: 0 },
      right: { x: '100%', y: 0 },
      top: { x: 0, y: '-100%' },
      bottom: { x: 0, y: '100%' },
    }[side];

    return {
      hidden: {
        ...offset,
        opacity: 0,
      },
      visible: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: smoothSpring,
      },
      exit: {
        ...offset,
        opacity: 0,
        transition: smoothSpring,
      },
    };
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={shouldReduceMotion() ? fadeVariants : getDrawerVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Dropdown Transition Component
 *
 * Optimized transition for dropdowns and popovers
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isOpen && (
 *     <DropdownTransition>
 *       <YourDropdownContent />
 *     </DropdownTransition>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function DropdownTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={shouldReduceMotion() ? fadeVariants : dropdownVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
