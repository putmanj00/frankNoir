'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Progress } from '@heroui/react';

interface ScanButtonProps {
  targetObject: string; // e.g., "Sleepy Bee Chandelier", "Rose Quartz", "Mushroom Grid"
  scanDuration?: number; // milliseconds, default 3000
  onScanComplete: () => void;
}

/**
 * Placeholder "Scan" button that simulates AR scanning
 * Shows scanning animation and progress bar
 * In MVP, this replaces real AR.js integration
 */
export function ScanButton({
  targetObject,
  scanDuration = 3000,
  onScanComplete,
}: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / scanDuration) * 100, 100);
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(() => {
          onScanComplete();
        }, 500);
      }
    }, 50); // Update every 50ms for smooth animation
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="glass-card">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📸</div>
            <div className="flex-grow">
              <p className="text-sm text-gray-300 mb-1">
                <span className="font-semibold text-neon-magenta">Scan Target:</span>{' '}
                {targetObject}
              </p>
              <p className="text-xs text-gray-500">
                Position your device to capture the target object. The scan will complete automatically.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Scan Reticle (Visual Feedback) */}
      {isScanning && (
        <Card className="glass-card" style={{ borderColor: '#f53fe8' }}>
          <CardBody className="p-8">
            <div className="relative aspect-square max-w-xs mx-auto">
              {/* Animated Reticle */}
              <div className="absolute inset-0 border-2 border-neon-magenta rounded-lg animate-pulse">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neon-magenta" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neon-magenta" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neon-magenta" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neon-magenta" />

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-neon-magenta"
                    style={{
                      boxShadow: '0 0 20px #f53fe8',
                      animation: 'pulse 1s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>

              {/* Scanning Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-neon-magenta font-bold text-lg animate-pulse">
                    SCANNING...
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    {Math.round(scanProgress)}%
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Progress Bar */}
      {isScanning && (
        <div className="space-y-2">
          <Progress
            value={scanProgress}
            className="max-w-full"
            classNames={{
              indicator: 'bg-gradient-to-r from-lisa-frank-purple to-neon-magenta',
            }}
            style={{
              '--heroui-primary': '#f53fe8',
            } as React.CSSProperties}
          />
          <p className="text-xs text-gray-500 text-center font-mono">
            Analyzing target signature...
          </p>
        </div>
      )}

      {/* Scan Complete */}
      {isComplete && (
        <Card className="glass-card" style={{ borderColor: '#ac3cfe' }}>
          <CardBody className="p-4 text-center">
            <div className="text-4xl mb-2">✓</div>
            <p className="text-lisa-frank-purple font-bold">
              Scan Complete!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {targetObject} verified
            </p>
          </CardBody>
        </Card>
      )}

      {/* Scan Button */}
      {!isScanning && !isComplete && (
        <Button
          className="gradient-button w-full"
          size="lg"
          onPress={handleScan}
        >
          📸 Start Scan
        </Button>
      )}

      {/* MVP Note */}
      <div className="text-xs text-gray-500 text-center italic">
        MVP: Simulated scan (Real AR can be added post-Valentine's)
      </div>
    </div>
  );
}
