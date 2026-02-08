'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import type { Stage } from '@/lib/stages';
import { forceUnlockStage, resetAllStages } from '@/lib/unlock';
import { clearProgress } from '@/lib/storage';

interface AdminPanelProps {
  stages: Stage[];
  onStagesUpdate: (stages: Stage[]) => void;
  isVisible: boolean;
}

export function AdminPanel({ stages, onStagesUpdate, isVisible }: AdminPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const handleForceUnlock = (stageId: number) => {
    const updatedStages = forceUnlockStage(stages, stageId);
    onStagesUpdate(updatedStages);
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      const resetStages = resetAllStages(stages);
      onStagesUpdate(resetStages);
      clearProgress();
      // Also clear all hint states
      for (let i = 1; i <= 15; i++) {
        localStorage.removeItem(`frankNoir:hints:stage${i}`);
      }
      alert('Progress reset successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#ffb622';
      case 'completed':
        return '#ac3cfe';
      default:
        return '#666';
    }
  };

  return (
    <Card className="glass-card border-2 border-solar-flare-gold">
      <CardHeader
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-solar-flare-gold font-bold">🔧 ADMIN PANEL</span>
          <Chip size="sm" color="warning" variant="flat">
            DEV MODE
          </Chip>
        </div>
        <Button
          size="sm"
          variant="light"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'}
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardBody className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-mono">QUICK ACTIONS:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={handleReset}
              >
                🔄 Reset All Progress
              </Button>
              <Button
                size="sm"
                color="warning"
                variant="flat"
                onPress={() => window.location.href = '/?mock=true'}
              >
                📡 Enable Mock GPS
              </Button>
            </div>
          </div>

          {/* Stage Controls */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-mono">FORCE UNLOCK STAGES:</p>
            <div className="grid grid-cols-5 gap-2">
              {stages.map((stage) => (
                <Button
                  key={stage.id}
                  size="sm"
                  variant="flat"
                  style={{
                    backgroundColor: `${getStatusColor(stage.status)}22`,
                    borderColor: getStatusColor(stage.status),
                    borderWidth: 1,
                  }}
                  onPress={() => handleForceUnlock(stage.id)}
                  isDisabled={stage.status === 'active'}
                >
                  {stage.id}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 italic">
              Click a locked stage number to unlock it
            </p>
          </div>

          {/* Status Overview */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-mono">STATUS OVERVIEW:</p>
            <div className="text-xs font-mono space-y-1">
              <div>
                Completed: {stages.filter((s) => s.status === 'completed').length}
              </div>
              <div>
                Active: {stages.filter((s) => s.status === 'active').length}
              </div>
              <div>
                Locked: {stages.filter((s) => s.status === 'locked').length}
              </div>
            </div>
          </div>

          {/* URL Params Info */}
          <div className="text-xs text-gray-500 space-y-1 border-t border-gray-700 pt-2">
            <p className="font-mono">AVAILABLE URL PARAMS:</p>
            <p>?dev=true - Enable admin panel</p>
            <p>?mock=true - Enable mock GPS mode</p>
          </div>
        </CardBody>
      )}
    </Card>
  );
}
