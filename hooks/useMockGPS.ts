import { useState, useEffect } from 'react';
import type { GPSPosition } from '@/lib/gps';
import type { Stage } from '@/lib/stages';

/**
 * Mock GPS hook for testing without real location
 * Simulates being at the current active stage's location
 */
export function useMockGPS(stages: Stage[], enabled: boolean) {
  const [mockPosition, setMockPosition] = useState<GPSPosition | null>(null);

  useEffect(() => {
    if (!enabled) {
      setMockPosition(null);
      return;
    }

    // Find the current active stage
    const activeStage = stages.find((s) => s.status === 'active');

    if (activeStage && activeStage.coordinates) {
      // Simulate being at the active stage's location
      setMockPosition({
        latitude: activeStage.coordinates.lat,
        longitude: activeStage.coordinates.lng,
        accuracy: 10, // Excellent accuracy in mock mode
        timestamp: Date.now(),
      });
    }
  }, [stages, enabled]);

  return mockPosition;
}

/**
 * Check if mock GPS mode is enabled
 */
export function isMockGPSEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  return params.get('mock') === 'true';
}
