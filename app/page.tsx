'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StageCard } from '@/components/StageCard';
import { AdminPanel } from '@/components/AdminPanel';
import { PageTransition } from '@/components/PageTransition';
import { INITIAL_STAGES, type Stage } from '@/lib/stages';
import { loadProgress, saveProgress } from '@/lib/storage';
import {
  initializeStageStatuses,
  getProgress,
  isJourneyComplete,
} from '@/lib/unlock';
import { isMockGPSEnabled } from '@/hooks/useMockGPS';

export default function Home() {
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>(() =>
    initializeStageStatuses(INITIAL_STAGES)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for dev mode and mock GPS
  const [isDevMode, setIsDevMode] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDevMode(params.get('dev') === 'true');
      setIsMockMode(isMockGPSEnabled());
    }
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    const savedStages = loadProgress();
    if (savedStages) {
      setStages(savedStages);
    } else {
      // First time: initialize and save
      const initializedStages = initializeStageStatuses(INITIAL_STAGES);
      setStages(initializedStages);
      saveProgress(initializedStages);
    }
    setIsLoaded(true);
  }, []);

  // Save progress whenever stages change
  useEffect(() => {
    if (isLoaded) {
      saveProgress(stages);
    }
  }, [stages, isLoaded]);

  const handleStageClick = (stageId: number) => {
    const params = new URLSearchParams();
    if (isDevMode) params.set('dev', 'true');
    if (isMockMode) params.set('mock', 'true');
    const query = params.toString();
    router.push(`/stage/${stageId}${query ? `?${query}` : ''}`);
  };

  const handleStagesUpdate = (updatedStages: Stage[]) => {
    setStages(updatedStages);
    saveProgress(updatedStages);
  };

  const progress = getProgress(stages);
  const journeyComplete = isJourneyComplete(stages);

  // Show loading state
  if (!isLoaded) {
    return (
      <PageTransition>
        <main className="min-h-screen p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-neon-magenta text-lg font-mono">Loading...</div>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-neon-magenta tracking-wider">
            FRANKNOIR
          </h1>
          <p className="text-sm text-gray-400 font-mono">
            14-YEAR PROTOCOL // VALENTINE&apos;S DAY 2026
          </p>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />

          {/* Mode Indicators */}
          {(isDevMode || isMockMode) && (
            <div className="flex gap-2 justify-center pt-2">
              {isDevMode && (
                <span className="text-xs px-2 py-1 rounded bg-solar-flare-gold/20 text-solar-flare-gold font-mono">
                  🔧 DEV MODE
                </span>
              )}
              {isMockMode && (
                <span className="text-xs px-2 py-1 rounded bg-lisa-frank-purple/20 text-lisa-frank-purple font-mono">
                  📡 MOCK GPS
                </span>
              )}
            </div>
          )}
        </div>

        {/* Admin Panel */}
        {isDevMode && (
          <div className="mb-6">
            <AdminPanel
              stages={stages}
              onStagesUpdate={handleStagesUpdate}
              isVisible={isDevMode}
            />
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-4">
          {stages.map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              onClick={() => handleStageClick(stage.id)}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-500 font-mono">
            {progress.completed} / {progress.total} STAGES COMPLETED ({progress.percentage}%)
          </p>
          {journeyComplete && (
            <div className="glass-card p-4 animate-pulse">
              <p className="text-lg text-neon-magenta font-bold">
                🎉 JOURNEY COMPLETE 🎉
              </p>
              <p className="text-sm text-gray-400 mt-2">
                All protocols executed successfully
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
    </PageTransition>
  );
}
