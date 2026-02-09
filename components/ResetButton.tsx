'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';

interface ResetButtonProps {
  onReset: () => void;
}

/**
 * Emergency reset button for production testing
 * Long-press to reset all progress
 */
export function ResetButton({ onReset }: ResetButtonProps) {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const handlePressStart = () => {
    setHoldProgress(0);
    const interval = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onReset();
          return 0;
        }
        return prev + 5;
      });
    }, 100);
    setPressTimer(interval);
  };

  const handlePressEnd = () => {
    if (pressTimer) {
      clearInterval(pressTimer);
      setPressTimer(null);
    }
    setHoldProgress(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="sm"
        variant="flat"
        color="danger"
        onPressStart={handlePressStart}
        onPressEnd={handlePressEnd}
        className="opacity-30 hover:opacity-100 transition-opacity"
        style={{
          background: holdProgress > 0
            ? `linear-gradient(to right, #dc2626 ${holdProgress}%, transparent ${holdProgress}%)`
            : undefined
        }}
      >
        {holdProgress > 0 ? `Resetting... ${Math.round(holdProgress)}%` : '🔄 Hold to Reset'}
      </Button>
    </div>
  );
}
