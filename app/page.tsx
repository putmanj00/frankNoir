'use client';

import { useState, useEffect, useCallback } from 'react';
import { StageCard } from '@/components/StageCard';
import { INITIAL_STAGES, type Stage } from '@/lib/stages';
import { loadProgress, saveProgress } from '@/lib/storage';
import {
  completeStage,
  initializeStageStatuses,
  getProgress,
  isJourneyComplete,
} from '@/lib/unlock';

export default function Home() {
  const [stages, setStages] = useState<Stage[]>(() =>
    initializeStageStatuses(INITIAL_STAGES)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const savedStages = loadProgress();
    if (savedStages) {
      setStages(savedStages);
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
    // TODO: Navigate to stage detail page (will implement in later stories)
    console.log('Stage clicked:', stageId);
  };

  const handleCompleteStage = useCallback((stageId: number) => {
    setStages((prevStages) => completeStage(prevStages, stageId));
  }, []);

  const progress = getProgress(stages);
  const journeyComplete = isJourneyComplete(stages);

  // Show loading state
  if (!isLoaded) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-magenta text-lg font-mono">Loading...</div>
        </div>
      </main>
    );
  }

  return (
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
        </div>

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
  );
}
