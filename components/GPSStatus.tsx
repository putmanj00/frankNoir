import { Chip } from "@heroui/react";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { formatDistance, getAccuracyQuality } from "@/lib/gps";

interface GPSStatusProps {
  targetLat?: number;
  targetLon?: number;
  showDistance?: boolean;
}

export function GPSStatus({ targetLat, targetLon, showDistance = false }: GPSStatusProps) {
  const { position, error, isLoading, isSupported } = useGPSTracking();

  if (!isSupported) {
    return (
      <div className="text-xs text-red-500 font-mono">
        ⚠️ GPS not supported
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-red-500 font-mono">
        ⚠️ {error.message}
      </div>
    );
  }

  if (isLoading || !position) {
    return (
      <div className="text-xs text-gray-400 font-mono animate-pulse">
        📡 Acquiring GPS signal...
      </div>
    );
  }

  const accuracy = getAccuracyQuality(position.accuracy);

  // Calculate distance if target provided
  let distance: number | null = null;
  if (targetLat !== undefined && targetLon !== undefined) {
    const lat1 = position.latitude;
    const lon1 = position.longitude;
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (targetLat * Math.PI) / 180;
    const Δφ = ((targetLat - lat1) * Math.PI) / 180;
    const Δλ = ((targetLon - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = R * c;
  }

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <Chip
        size="sm"
        style={{ backgroundColor: accuracy.color, color: '#030303' }}
      >
        📡 {Math.round(position.accuracy)}m
      </Chip>
      {showDistance && distance !== null && (
        <span className="text-gray-400">
          🎯 {formatDistance(distance)} away
        </span>
      )}
    </div>
  );
}
