import { Button, Progress } from "@heroui/react";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { formatDistance, isWithinRadius } from "@/lib/gps";
import type { Stage } from "@/lib/stages";
import type { GPSPosition } from "@/lib/gps";

interface ProximityUnlockProps {
  stage: Stage;
  onUnlock: () => void;
  showManualOverride?: boolean;
  mockPosition?: GPSPosition | null;
}

export function ProximityUnlock({
  stage,
  onUnlock,
  showManualOverride = false,
  mockPosition = null,
}: ProximityUnlockProps) {
  const { position, error, isLoading } = useGPSTracking({ mockPosition });

  if (!stage.coordinates || stage.unlockType !== 'gps') {
    return null;
  }

  const { lat: targetLat, lng: targetLon } = stage.coordinates;
  const radius = stage.unlockRadius || 50;

  // Check if user is within unlock radius
  const inRange =
    position &&
    isWithinRadius(
      position.latitude,
      position.longitude,
      targetLat,
      targetLon,
      radius
    );

  // Calculate distance for display
  let distance: number | null = null;
  if (position) {
    const R = 6371e3;
    const φ1 = (position.latitude * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - position.latitude) * Math.PI) / 180;
    const Δλ = ((targetLon - position.longitude) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = R * c;
  }

  // Calculate progress percentage (how close to target)
  const progressPercentage = distance
    ? Math.max(0, Math.min(100, ((radius - distance) / radius) * 100))
    : 0;

  return (
    <div className="space-y-4">
      {/* GPS Status */}
      {isLoading && (
        <div className="text-sm text-gray-400 font-mono animate-pulse">
          📡 Acquiring GPS signal...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 font-mono">
          ⚠️ {error.message}
        </div>
      )}

      {/* Distance Display */}
      {position && distance !== null && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Distance to target:</span>
            <span
              className={
                inRange ? 'text-lisa-frank-purple font-bold' : 'text-gray-300'
              }
            >
              {formatDistance(distance)}
            </span>
          </div>

          {/* Progress bar */}
          <Progress
            value={progressPercentage}
            color={inRange ? 'secondary' : 'default'}
            className="max-w-full"
            style={{
              '--heroui-secondary': inRange ? '#ac3cfe' : '#666',
            } as React.CSSProperties}
          />

          <div className="text-xs text-gray-500 font-mono text-center">
            {inRange
              ? '✅ In range! You can unlock this stage.'
              : `🎯 Get within ${radius}m to unlock`}
          </div>
        </div>
      )}

      {/* Unlock Button */}
      {inRange && (
        <Button
          className="gradient-button w-full"
          size="lg"
          onPress={onUnlock}
        >
          🔓 Unlock Stage
        </Button>
      )}

      {/* Manual Override (Dev Mode) */}
      {showManualOverride && !inRange && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2 font-mono">
            🔧 DEV MODE
          </div>
          <Button
            size="sm"
            variant="flat"
            color="warning"
            onPress={onUnlock}
            className="w-full"
          >
            ⚠️ Force Unlock (Admin)
          </Button>
        </div>
      )}
    </div>
  );
}
