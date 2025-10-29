'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HomeAnimations({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.from('.hero-badge', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      })

      gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      })

      gsap.from('.hero-description', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
      })

      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out'
      })

      gsap.from('.hero-features', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out'
      })

      // Animate feature cards on scroll
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        })
      })

      // Animate step cards with stagger
      gsap.utils.toArray<HTMLElement>('.step-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          x: index % 2 === 0 ? -60 : 60,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out'
        })
      })

      // Animate pricing cards
      gsap.utils.toArray<HTMLElement>('.pricing-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out(1.4)'
        })
      })

      // Animate testimonials with rotation
      gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 40,
          rotationX: -15,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out'
        })
      })

      // Section headings parallax
      gsap.utils.toArray<HTMLElement>('.section-heading').forEach((heading) => {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out'
        })
      })

      // Parallax effect for background elements
      gsap.to('.parallax-blob-1', {
        scrollTrigger: {
          trigger: '.parallax-blob-1',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: 200,
        ease: 'none'
      })

      gsap.to('.parallax-blob-2', {
        scrollTrigger: {
          trigger: '.parallax-blob-2',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        },
        y: -150,
        ease: 'none'
      })

      // CTA section scale animation
      gsap.from('.cta-card', {
        scrollTrigger: {
          trigger: '.cta-card',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.95,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return <div ref={containerRef}>{children}</div>
}
