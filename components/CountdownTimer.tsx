'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@heroui/react';

interface CountdownTimerProps {
  targetTime: string; // "HH:MM" format, e.g., "17:00" for 5:00 PM
  onTimeReached?: () => void;
  label?: string;
}

/**
 * Countdown timer for time-locked stages
 * Shows hours, minutes, seconds until target time
 * Optionally triggers callback when time reached
 */
export function CountdownTimer({
  targetTime,
  onTimeReached,
  label = 'Time until unlock',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  const [hasReached, setHasReached] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const [targetHour, targetMinute] = targetTime.split(':').map(Number);

      // Create target date for today
      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);

      // If target time already passed today, set for tomorrow
      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        // Time reached!
        if (!hasReached) {
          setHasReached(true);
          if (onTimeReached) {
            onTimeReached();
          }
        }
        return { hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, total: diff };
    };

    // Update immediately
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, hasReached, onTimeReached]);

  const formatTimeUnit = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const isAlmostReached = timeRemaining.total > 0 && timeRemaining.total < 5 * 60 * 1000; // Last 5 minutes

  return (
    <Card
      className="glass-card"
      style={{
        borderColor: hasReached
          ? '#ac3cfe'
          : isAlmostReached
          ? '#ffb622'
          : '#f53fe8',
      }}
    >
      <CardBody className="p-6">
        <div className="text-center space-y-4">
          {/* Label */}
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            {label}
          </p>

          {/* Timer Display */}
          {hasReached ? (
            <div className="text-3xl font-bold text-lisa-frank-purple animate-pulse">
              ✓ TIME REACHED
            </div>
          ) : (
            <div className="flex justify-center gap-2 font-mono">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div
                  className="text-5xl font-bold"
                  style={{
                    color: isAlmostReached ? '#ffb622' : '#f53fe8',
                    textShadow: isAlmostReached ? '0 0 20px #ffb622' : 'none',
                  }}
                >
                  {formatTimeUnit(timeRemaining.hours)}
                </div>
                <div className="text-xs text-gray-500 mt-1">HRS</div>
              </div>

              <div className="text-5xl font-bold text-gray-600">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div
                  className="text-5xl font-bold"
                  style={{
                    color: isAlmostReached ? '#ffb622' : '#f53fe8',
                    textShadow: isAlmostReached ? '0 0 20px #ffb622' : 'none',
                  }}
                >
                  {formatTimeUnit(timeRemaining.minutes)}
                </div>
                <div className="text-xs text-gray-500 mt-1">MIN</div>
              </div>

              <div className="text-5xl font-bold text-gray-600">:</div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div
                  className="text-5xl font-bold"
                  style={{
                    color: isAlmostReached ? '#ffb622' : '#f53fe8',
                    textShadow: isAlmostReached ? '0 0 20px #ffb622' : 'none',
                  }}
                >
                  {formatTimeUnit(timeRemaining.seconds)}
                </div>
                <div className="text-xs text-gray-500 mt-1">SEC</div>
              </div>
            </div>
          )}

          {/* Target Time */}
          <div className="text-xs text-gray-500">
            {hasReached ? (
              'Stage is now unlocked!'
            ) : (
              <>
                Unlocks at <span className="font-mono text-solar-flare-gold">{targetTime}</span>
                {isAlmostReached && (
                  <span className="ml-2 text-solar-flare-gold">⚡ Almost there!</span>
                )}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
