'use client';

/**
 * Scroll Animation Hooks
 *
 * Custom hooks for implementing scroll-based animations.
 * Detects when elements enter the viewport and triggers animations.
 */

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * useScrollAnimation Hook
 *
 * Returns whether an element is in view and provides animation state.
 * Triggers once when element enters viewport.
 *
 * @example
 * ```tsx
 * const { ref, isInView } = useScrollAnimation();
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       opacity: isInView ? 1 : 0,
 *       transform: isInView ? 'translateY(0)' : 'translateY(50px)',
 *     }}
 *   >
 *     Content
 *   </div>
 * );
 * ```
 */
export function useScrollAnimation(options?: {
  once?: boolean;
  amount?: number | 'some' | 'all';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.3,
  });

  return { ref, isInView };
}

/**
 * useScrollAnimationMultiple Hook
 *
 * For animating multiple elements with stagger effect.
 * Returns array of refs and their view states.
 *
 * @example
 * ```tsx
 * const items = useScrollAnimationMultiple(5);
 * return (
 *   <>
 *     {items.map((item, index) => (
 *       <div
 *         key={index}
 *         ref={item.ref}
 *         style={{
 *           opacity: item.isInView ? 1 : 0,
 *           transition: `all 0.5s ${index * 0.1}s`,
 *         }}
 *       >
 *         Item {index}
 *       </div>
 *     ))}
 *   </>
 * );
 * ```
 */
export function useScrollAnimationMultiple(count: number, options?: {
  once?: boolean;
  threshold?: number;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    new Array(count).fill(false)
  );

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewStates((prev) => {
              const newStates = [...prev];
              newStates[index] = true;
              return newStates;
            });

            if (options?.once ?? true) {
              observer.disconnect();
            }
          }
        },
        {
          threshold: options?.threshold ?? 0.3,
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [count, options]);

  return Array.from({ length: count }, (_, index) => ({
    ref: (el: HTMLDivElement | null) => {
      refs.current[index] = el;
    },
    isInView: inViewStates[index],
  }));
}

/**
 * useScrollProgress Hook
 *
 * Returns the scroll progress of an element (0 to 1).
 * Useful for progress indicators and parallax effects.
 *
 * @example
 * ```tsx
 * const { ref, progress } = useScrollProgress();
 * return (
 *   <div ref={ref}>
 *     <div
 *       style={{
 *         transform: `scaleX(${progress})`,
 *         transformOrigin: 'left',
 *       }}
 *       className="h-1 bg-primary"
 *     />
 *   </div>
 * );
 * ```
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate progress based on element position
      const scrolled = windowHeight - rect.top;
      const total = windowHeight + elementHeight;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);

      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

/**
 * useScrollDirection Hook
 *
 * Detects scroll direction (up or down).
 * Useful for showing/hiding headers or navigation.
 *
 * @example
 * ```tsx
 * const direction = useScrollDirection();
 * return (
 *   <header
 *     style={{
 *       transform: direction === 'down' ? 'translateY(-100%)' : 'translateY(0)',
 *       transition: 'transform 0.3s',
 *     }}
 *   >
 *     Navigation
 *   </header>
 * );
 * ```
 */
export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - lastScrollY.current;

      if (Math.abs(difference) < threshold) return;

      setDirection(difference > 0 ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return direction;
}

/**
 * useParallax Hook
 *
 * Creates a parallax effect based on scroll position.
 * Returns offset values for x and y axes.
 *
 * @example
 * ```tsx
 * const { ref, offsetY } = useParallax(0.5);
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       transform: `translateY(${offsetY}px)`,
 *     }}
 *   >
 *     Parallax Content
 *   </div>
 * );
 * ```
 */
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const offsetY = (scrolled - elementTop) * speed;

      setOffset({ x: 0, y: offsetY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offsetX: offset.x, offsetY: offset.y };
}

/**
 * useScrollTrigger Hook
 *
 * Triggers a callback when element enters viewport.
 * Useful for analytics, lazy loading, or custom effects.
 *
 * @example
 * ```tsx
 * const ref = useScrollTrigger(() => {
 *   console.log('Element visible!');
 *   // Track analytics, load content, etc.
 * });
 * return <div ref={ref}>Content</div>;
 * ```
 */
export function useScrollTrigger(
  callback: () => void,
  options?: {
    once?: boolean;
    threshold?: number;
  }
) {
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (options?.once && hasTriggered.current) return;

          callback();
          hasTriggered.current = true;

          if (options?.once ?? true) {
            observer.disconnect();
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.3,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}
