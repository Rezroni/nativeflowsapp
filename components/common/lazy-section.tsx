'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Lazy Section - Only renders content when it's near viewport
 * Improves initial page load by deferring below-the-fold content
 */
export function LazySection({
  children,
  threshold = 0.1,
  rootMargin = '200px',
}: {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [threshold, rootMargin])

  return (
    <div ref={sectionRef} style={{ minHeight: isVisible ? 'auto' : '400px' }}>
      {isVisible ? children : null}
    </div>
  )
}
