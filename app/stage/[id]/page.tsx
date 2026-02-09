'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, CardBody } from '@heroui/react';
import { loadProgress, saveProgress } from '@/lib/storage';
import { completeStage } from '@/lib/unlock';
import { ProximityUnlock } from '@/components/ProximityUnlock';
import { HintSystem } from '@/components/HintSystem';
import { RadioPuzzle } from '@/components/RadioPuzzle';
import { CoordinateInput } from '@/components/CoordinateInput';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useMockGPS, isMockGPSEnabled } from '@/hooks/useMockGPS';
import type { Stage } from '@/lib/stages';

export default function StagePage() {
  const router = useRouter();
  const params = useParams();
  const stageId = parseInt(params.id as string);

  const [stages, setStages] = useState<Stage[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for dev mode and mock GPS
  const isDevMode =
    typeof window !== 'undefined' &&
    (window.location.search.includes('dev=true') ||
      window.location.hostname === 'localhost');

  const isMockMode = typeof window !== 'undefined' && isMockGPSEnabled();
  const mockPosition = useMockGPS(stages, isMockMode);

  useEffect(() => {
    const savedStages = loadProgress();
    if (savedStages) {
      setStages(savedStages);
      const currentStage = savedStages.find((s) => s.id === stageId);
      setStage(currentStage || null);
    }
    setIsLoaded(true);
  }, [stageId]);

  const handleComplete = () => {
    const updatedStages = completeStage(stages, stageId);
    setStages(updatedStages);
    saveProgress(updatedStages);

    // Navigate back to timeline after short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  if (!isLoaded || !stage) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center text-gray-400">Loading...</div>
      </main>
    );
  }

  // Don't allow access to locked stages
  if (stage.status === 'locked') {
    return (
      <main className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Button variant="flat" onPress={() => router.push('/')}>
            ← Back
          </Button>
          <Card className="glass-card">
            <CardBody className="p-6 text-center">
              <p className="text-gray-400 mb-4">🔒 This stage is locked</p>
              <p className="text-sm text-gray-500">
                Complete the previous stage to unlock this one.
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="flat" onPress={() => router.push('/')}>
            ← Back
          </Button>
          <div className="text-sm font-mono text-gray-400">{stage.time}</div>
        </div>

        {/* Stage Info */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neon-magenta">
            {stage.title}
          </h1>
          <p className="text-xl text-lisa-frank-purple">{stage.subtitle}</p>
          <div className="flex items-center gap-2 text-gray-400">
            <span>📍</span>
            <span>{stage.location}</span>
          </div>
        </div>

        {/* Description */}
        <Card className="glass-card">
          <CardBody className="p-6">
            <p className="text-lg italic text-gray-300 mb-4">
              "{stage.description}"
            </p>
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-400 mb-2 font-bold">Your Mission:</p>
              <p className="text-gray-300">{stage.clue}</p>
            </div>
          </CardBody>
        </Card>

        {/* Unlock Mechanism */}
        <Card className="glass-card">
          <CardBody className="p-6">
            <h2 className="text-lg font-bold text-gray-300 mb-4">
              Unlock Method: {stage.unlockType.toUpperCase()}
            </h2>

            {stage.unlockType === 'gps' && (
              <>
                {isMockMode && (
                  <div className="mb-4 p-2 bg-lisa-frank-purple/20 border border-lisa-frank-purple rounded text-xs font-mono">
                    📡 Mock GPS Active: Simulating location at stage target
                  </div>
                )}
                <ProximityUnlock
                  stage={stage}
                  onUnlock={handleComplete}
                  showManualOverride={isDevMode}
                  mockPosition={mockPosition}
                />
              </>
            )}

            {stage.unlockType === 'puzzle' && (
              <div className="space-y-4">
                {stage.id === 3 ? (
                  // Stage 3: Radio frequency puzzle
                  <RadioPuzzle
                    targetFrequency={20.50}
                    onSolved={handleComplete}
                    tolerance={0.01}
                  />
                ) : (
                  // Other puzzle stages (placeholder)
                  <>
                    <p className="text-sm text-gray-400">
                      Complete the puzzle to unlock this stage.
                    </p>
                    {isDevMode && (
                      <Button
                        className="gradient-button w-full"
                        onPress={handleComplete}
                      >
                        🔓 Complete Puzzle (Dev)
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {stage.unlockType === 'scan' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Scan the target object to unlock this stage.
                </p>
                {/* Scan component will be added in later stories */}
                {isDevMode && (
                  <Button
                    className="gradient-button w-full"
                    onPress={handleComplete}
                  >
                    📸 Complete Scan (Dev)
                  </Button>
                )}
              </div>
            )}

            {stage.unlockType === 'time' && (
              <div className="space-y-4">
                {stage.id === 11 ? (
                  // Stage 11: Safe House - Time lock + Coordinate input
                  <>
                    <div className="p-4 bg-solar-flare-gold/10 border border-solar-flare-gold rounded mb-4">
                      <p className="text-sm text-solar-flare-gold font-bold mb-2">
                        ⏰ Recharge Protocol Active
                      </p>
                      <p className="text-xs text-gray-300">
                        Return home and wait for the designated time. Once unlocked,
                        find the vintage pharmacist bottle in the honor system area.
                      </p>
                    </div>

                    {/* Countdown Timer */}
                    <CountdownTimer
                      targetTime="17:00"
                      label="Recharge Protocol Ends In"
                    />

                    {/* Coordinate Input (always visible, but makes sense after timer) */}
                    <CoordinateInput
                      targetCoordinates={stage.coordinates || { lat: 39.1031, lng: -84.5120 }}
                      onSolved={handleComplete}
                      tolerance={0.001}
                    />
                  </>
                ) : (
                  // Other time-locked stages
                  <>
                    <p className="text-sm text-gray-400">
                      This stage unlocks at a specific time.
                    </p>
                    {isDevMode && (
                      <Button
                        className="gradient-button w-full"
                        onPress={handleComplete}
                      >
                        ⏰ Complete Time-lock (Dev)
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Hints Section */}
        <Card className="glass-card">
          <CardBody className="p-6">
            <HintSystem stage={stage} />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
