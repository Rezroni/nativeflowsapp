'use client';

/**
 * Detailed Analysis Card Component
 *
 * Modern card-based analysis sections inspired by premium financial apps.
 * Features smooth animations, glass morphism, and expandable sections.
 * Optimized for PWA mobile experience.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DetailedAnalysisSection {
  id: string;
  number: number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  badge?: string;
  isExpandable?: boolean;
}

interface DetailedAnalysisCardProps {
  sections: DetailedAnalysisSection[];
  title?: string;
  className?: string;
}

export function DetailedAnalysisCard({
  sections,
  title = 'Detailed Analysis',
  className,
}: DetailedAnalysisCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <Card className={cn('glass-card overflow-hidden', className)}>
      {title && (
        <div className="p-6 pb-4 border-b border-border/40">
          <h2 className="text-xl font-bold gradient-text">{title}</h2>
        </div>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                onClick={() => section.isExpandable && toggleSection(section.id)}
                disabled={!section.isExpandable}
                className={cn(
                  'w-full px-6 py-4 flex items-center gap-4 transition-all',
                  'hover:bg-muted/30 active:scale-[0.98]',
                  section.isExpandable && 'cursor-pointer',
                  !section.isExpandable && 'cursor-default',
                  expandedSection === section.id && 'bg-muted/20'
                )}
              >
                {/* Number Badge */}
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full',
                  'flex items-center justify-center',
                  'bg-primary/10 text-primary font-semibold text-sm',
                  'transition-all duration-300',
                  expandedSection === section.id && 'bg-primary text-primary-foreground scale-110'
                )}>
                  {section.number}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground">
                      {section.title}
                    </h3>
                    {section.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {section.description}
                    </p>
                  )}
                </div>

                {/* Icon or Arrow */}
                {section.icon ? (
                  <div className="flex-shrink-0 text-muted-foreground">
                    {section.icon}
                  </div>
                ) : section.isExpandable ? (
                  <motion.div
                    animate={{ rotate: expandedSection === section.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {section.isExpandable && expandedSection === section.id && section.content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pl-[4.5rem]">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                        {section.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
