'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { duration, easing } from '@/lib/animations/variants';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.normal, ease: easing.smooth }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo with animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: duration.slow,
              ease: easing.smooth,
              delay: 0.2,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/icons/icon-512x512.png"
                alt="Nativeflows"
                width={160}
                height={160}
                className="rounded-3xl"
                priority
              />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-3xl bg-primary/30 blur-2xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* App name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: duration.normal,
              ease: easing.smooth,
              delay: 0.4,
            }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Nativeflows
            </h1>
            <p className="text-sm text-muted-foreground">
              AI Trading Chart Analysis
            </p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
