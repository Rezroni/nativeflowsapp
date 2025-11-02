'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { duration, easing } from '@/lib/animations/variants';

export type AnalysisStage =
  | 'uploading'
  | 'processing'
  | 'analyzing'
  | 'generating'
  | 'complete';

export interface AnalysisProgressProps {
  /**
   * Current stage of the analysis
   */
  currentStage: AnalysisStage;

  /**
   * Optional error message
   */
  error?: string;

  /**
   * Optional custom stage labels
   */
  stageLabels?: {
    uploading?: string;
    processing?: string;
    analyzing?: string;
    generating?: string;
    complete?: string;
  };
}

const defaultStageLabels = {
  uploading: 'Uploading chart',
  processing: 'Processing image',
  analyzing: 'Analyzing patterns',
  generating: 'Generating insights',
  complete: 'Analysis complete',
};

const stages: AnalysisStage[] = [
  'uploading',
  'processing',
  'analyzing',
  'generating',
  'complete',
];

export function AnalysisProgress({
  currentStage,
  error,
  stageLabels = {},
}: AnalysisProgressProps) {
  const labels = { ...defaultStageLabels, ...stageLabels };
  const currentIndex = stages.indexOf(currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background track */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          {/* Animated progress fill */}
          <motion.div
            className={cn(
              'h-full rounded-full',
              error ? 'bg-destructive' : 'bg-primary'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: duration.slow,
              ease: easing.smooth,
            }}
          />
        </div>

        {/* Shimmer effect on progress bar */}
        {!error && currentStage !== 'complete' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ width: `${progress}%` }}
          />
        )}
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between items-start">
        {stages.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={stage}
              className="flex flex-col items-center gap-2 flex-1"
            >
              {/* Stage icon */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: isCurrent ? 0.6 : 0,
                  repeat: isCurrent ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300',
                  isComplete && 'bg-primary border-primary',
                  isCurrent && !error && 'border-primary bg-primary/10',
                  isCurrent && error && 'border-destructive bg-destructive/10',
                  isPending && 'border-muted bg-background'
                )}
              >
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                )}

                {isCurrent && !error && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Loader2 className="w-5 h-5 text-primary" />
                  </motion.div>
                )}

                {isCurrent && error && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  >
                    <Circle className="w-5 h-5 text-destructive fill-destructive" />
                  </motion.div>
                )}

                {isPending && (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}

                {/* Pulse ring for current stage */}
                {isCurrent && !error && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Stage label */}
              <motion.p
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isCurrent ? 1 : 0.5,
                  scale: isCurrent ? 1 : 0.9,
                }}
                transition={{
                  duration: duration.fast,
                  ease: easing.smooth,
                }}
                className={cn(
                  'text-xs text-center font-medium transition-colors duration-300',
                  isComplete && 'text-primary',
                  isCurrent && !error && 'text-foreground',
                  isCurrent && error && 'text-destructive',
                  isPending && 'text-muted-foreground'
                )}
              >
                {labels[stage]}
              </motion.p>
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{
            duration: duration.normal,
            ease: easing.smooth,
          }}
          className="overflow-hidden"
        >
          <motion.div
            initial={{ x: -4 }}
            animate={{ x: [0, -4, 4, -4, 4, 0] }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        </motion.div>
      )}

      {/* Success message */}
      {currentStage === 'complete' && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: duration.normal,
            ease: easing.smooth,
          }}
          className="p-4 rounded-lg bg-primary/10 text-primary text-sm font-medium text-center"
        >
          ✓ Analysis completed successfully!
        </motion.div>
      )}
    </div>
  );
}
