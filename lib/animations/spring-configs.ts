/**
 * Spring Animation Configurations
 *
 * Physics-based spring animations for natural motion.
 * These configs follow iOS and Material Design spring animation principles.
 *
 * @module lib/animations/spring-configs
 */

/**
 * Spring animation type from Framer Motion
 */
export interface SpringConfig {
  type: 'spring';
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
}

/**
 * Spring presets for different use cases
 */

/**
 * Smooth spring
 * Best for: General UI animations, cards, modals
 * Feel: Gentle, refined motion
 */
export const smoothSpring: SpringConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Bouncy spring
 * Best for: Playful interactions, success states, celebrations
 * Feel: Fun, energetic with overshoot
 */
export const bouncySpring: SpringConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
  mass: 1,
};

/**
 * Stiff spring
 * Best for: Quick, snappy interactions, buttons, toggles
 * Feel: Fast, responsive, minimal overshoot
 */
export const stiffSpring: SpringConfig = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.8,
};

/**
 * Gentle spring
 * Best for: Large elements, page transitions, modals
 * Feel: Slow, smooth, elegant
 */
export const gentleSpring: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1.2,
};

/**
 * Snappy spring
 * Best for: Micro-interactions, hover effects, tooltips
 * Feel: Very quick, instant feedback
 */
export const snappySpring: SpringConfig = {
  type: 'spring',
  stiffness: 600,
  damping: 40,
  mass: 0.5,
};

/**
 * Wobbly spring
 * Best for: Loading states, attention-grabbing elements
 * Feel: Exaggerated bounce, playful
 */
export const wobblySpring: SpringConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
  mass: 1,
};

/**
 * Molasses spring
 * Best for: Heavy elements, dramatic reveals
 * Feel: Very slow, deliberate
 */
export const molassesSpring: SpringConfig = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1.5,
};

/**
 * iOS Native spring
 * Mimics iOS native spring animations
 * Best for: Native feel on mobile
 */
export const iOSSpring: SpringConfig = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 1,
};

/**
 * Material Design spring
 * Follows Material Design motion guidelines
 * Best for: Material Design aesthetic
 */
export const materialSpring: SpringConfig = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 1,
};

/**
 * Customizable spring generator
 * Create custom spring configs based on desired feel
 *
 * @param options - Spring configuration options
 * @returns SpringConfig
 *
 * @example
 * const mySpring = createSpring({ feel: 'bouncy', speed: 'fast' });
 */
export const createSpring = (options: {
  feel?: 'smooth' | 'bouncy' | 'stiff' | 'gentle' | 'snappy' | 'wobbly' | 'molasses';
  speed?: 'slow' | 'normal' | 'fast';
  mass?: number;
}): SpringConfig => {
  const { feel = 'smooth', speed = 'normal', mass: customMass } = options;

  // Base configurations for each feel
  const feelConfigs: Record<string, { stiffness: number; damping: number }> = {
    smooth: { stiffness: 300, damping: 30 },
    bouncy: { stiffness: 400, damping: 20 },
    stiff: { stiffness: 500, damping: 35 },
    gentle: { stiffness: 200, damping: 25 },
    snappy: { stiffness: 600, damping: 40 },
    wobbly: { stiffness: 300, damping: 15 },
    molasses: { stiffness: 100, damping: 20 },
  };

  // Speed multipliers
  const speedMultipliers: Record<string, number> = {
    slow: 0.7,
    normal: 1,
    fast: 1.4,
  };

  const baseConfig = feelConfigs[feel] ?? feelConfigs.smooth;
  const speedMultiplier = speedMultipliers[speed] ?? 1;

  return {
    type: 'spring',
    stiffness: baseConfig.stiffness * speedMultiplier,
    damping: baseConfig.damping * speedMultiplier,
    mass: customMass ?? 1,
  };
};

/**
 * Spring animation calculator
 * Calculate spring properties based on duration and bounce
 *
 * @param duration - Desired duration in seconds
 * @param bounce - Desired bounce amount (0 = no bounce, 1 = maximum bounce)
 * @returns SpringConfig
 *
 * @example
 * const spring = calculateSpring(0.3, 0.2); // 300ms with slight bounce
 */
export const calculateSpring = (duration: number, bounce: number = 0): SpringConfig => {
  // Convert duration to stiffness (approximate)
  // Formula derived from Framer Motion's spring physics
  const stiffness = Math.max(100, (1 / duration) * 400);

  // Calculate damping based on bounce
  // Less bounce = more damping
  const damping = Math.max(10, 40 - bounce * 30);

  return {
    type: 'spring',
    stiffness,
    damping,
    mass: 1,
  };
};

/**
 * Collection of spring presets for easy access
 */
export const springPresets = {
  smooth: smoothSpring,
  bouncy: bouncySpring,
  stiff: stiffSpring,
  gentle: gentleSpring,
  snappy: snappySpring,
  wobbly: wobblySpring,
  molasses: molassesSpring,
  iOS: iOSSpring,
  material: materialSpring,
} as const;

/**
 * Type for spring preset names
 */
export type SpringPreset = keyof typeof springPresets;

/**
 * Get a spring preset by name
 *
 * @param preset - Name of the spring preset
 * @returns SpringConfig
 *
 * @example
 * const spring = getSpringPreset('bouncy');
 */
export const getSpringPreset = (preset: SpringPreset): SpringConfig => {
  return springPresets[preset];
};

/**
 * Spring animation helper for gesture-based animations
 * Optimized for drag, swipe, and pan gestures
 */
export const gestureSpring: SpringConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 35,
  mass: 0.8,
  restSpeed: 0.5,
  restDelta: 0.01,
};

/**
 * Spring animation helper for layout animations
 * Optimized for layout shifts and size changes
 */
export const layoutSpring: SpringConfig = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
  mass: 1,
};

/**
 * Spring animation helper for modal/dialog animations
 * Optimized for enter/exit animations
 */
export const modalSpring: SpringConfig = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 1,
};

/**
 * Spring animation helper for scroll animations
 * Optimized for smooth scroll-triggered animations
 */
export const scrollSpring: SpringConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
  mass: 1.1,
};

/**
 * Spring animation helper for loading states
 * Optimized for continuous motion
 */
export const loadingSpring: SpringConfig = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
  mass: 1,
};

/**
 * Export default spring configuration
 * This is the recommended default for most use cases
 */
export const defaultSpring = smoothSpring;

/**
 * Export all spring configs as a collection
 */
export const springs = {
  default: defaultSpring,
  smooth: smoothSpring,
  bouncy: bouncySpring,
  stiff: stiffSpring,
  gentle: gentleSpring,
  snappy: snappySpring,
  wobbly: wobblySpring,
  molasses: molassesSpring,
  iOS: iOSSpring,
  material: materialSpring,
  gesture: gestureSpring,
  layout: layoutSpring,
  modal: modalSpring,
  scroll: scrollSpring,
  loading: loadingSpring,
} as const;

export default springs;
