'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SectionToggleProps {
  defaultSection?: 'analysis' | 'firms'
  onSectionChange?: (section: 'analysis' | 'firms') => void
  className?: string
}

export function SectionToggle({
  defaultSection = 'analysis',
  onSectionChange,
  className
}: SectionToggleProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<'analysis' | 'firms'>(defaultSection)

  const handleToggle = (section: 'analysis' | 'firms') => {
    setActiveSection(section)
    onSectionChange?.(section)

    // Navigate to the appropriate page
    if (section === 'firms') {
      router.push('/firms')
    } else {
      router.push('/')
    }
  }

  return (
    <div className={cn("inline-flex rounded-full p-1 glass", className)}>
      <button
        onClick={() => handleToggle('analysis')}
        className={cn(
          "px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm md:text-base",
          activeSection === 'analysis'
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Analysis
      </button>
      <button
        onClick={() => handleToggle('firms')}
        className={cn(
          "px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm md:text-base",
          activeSection === 'firms'
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Firms
      </button>
    </div>
  )
}
