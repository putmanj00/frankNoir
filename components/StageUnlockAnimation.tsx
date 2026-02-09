'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StageUnlockAnimationProps {
  show: boolean;
  stageNumber: number;
  onComplete?: () => void;
}

/**
 * Celebration animation when a stage is completed
 * Shows neon burst effect with stage number
 */
export function StageUnlockAnimation({
  show,
  stageNumber,
  onComplete,
}: StageUnlockAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/80 pointer-events-none"
        >
          {/* Outer glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border-4 border-neon-magenta"
          />

          {/* Middle glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border-4 border-lisa-frank-purple"
          />

          {/* Center content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              ease: 'backOut',
            }}
            className="relative z-10 text-center"
          >
            {/* Checkmark icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mb-4"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-neon-magenta to-lisa-frank-purple flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-neon-magenta mb-2">
                Stage {stageNumber.toString().padStart(2, '0')}
              </h2>
              <p className="text-xl text-lisa-frank-purple">Complete!</p>
            </motion.div>

            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  x: Math.cos((i * Math.PI * 2) / 8) * 150,
                  y: Math.sin((i * Math.PI * 2) / 8) * 150,
                  scale: 0,
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.3 + i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-acid-yellow"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
