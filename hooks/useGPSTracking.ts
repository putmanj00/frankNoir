import { useState, useEffect, useCallback, useRef } from 'react';
import type { GPSPosition, GPSError } from '@/lib/gps';
import { parseGPSError, getDistanceInMeters } from '@/lib/gps';

interface UseGPSTrackingOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  minAccuracy?: number; // Minimum acceptable accuracy in meters
  updateInterval?: number; // How often to poll for position (ms)
  mockPosition?: GPSPosition | null; // Override with mock GPS for testing
}

interface GPSTrackingState {
  position: GPSPosition | null;
  error: GPSError | null;
  isLoading: boolean;
  isSupported: boolean;
  distanceTo: (lat: number, lon: number) => number | null;
  refresh: () => void;
}

/**
 * Hook for tracking user's GPS position
 *
 * Features:
 * - Continuous position tracking
 * - Accuracy fallback (retries with lower accuracy if high accuracy fails)
 * - Distance calculation helper
 * - Error handling with user-friendly messages
 * - Loading states
 */
export function useGPSTracking(
  options: UseGPSTrackingOptions = {}
): GPSTrackingState {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    minAccuracy = 500, // Accept positions within 500m accuracy (lenient for testing)
    updateInterval = 5000, // Update every 5 seconds
    mockPosition = null,
  } = options;

  const [position, setPosition] = useState<GPSPosition | null>(null);
  const [error, setError] = useState<GPSError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported] = useState(() => 'geolocation' in navigator);

  const watchIdRef = useRef<number | null>(null);
  const hasAttemptedHighAccuracyRef = useRef(false);

  const handleSuccess = useCallback(
    (pos: GeolocationPosition) => {
      const newPosition: GPSPosition = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      };

      // Only update if accuracy is acceptable
      if (newPosition.accuracy <= minAccuracy || !position) {
        setPosition(newPosition);
        setError(null);
        setIsLoading(false);
      } else {
        console.warn(
          `GPS accuracy too low: ${newPosition.accuracy}m (need ${minAccuracy}m)`
        );
        // Keep the old position if new one is less accurate
        if (position && position.accuracy < newPosition.accuracy) {
          // Don't update
        } else {
          setPosition(newPosition);
          setIsLoading(false);
        }
      }
    },
    [minAccuracy, position]
  );

  const handleError = useCallback(
    (err: GeolocationPositionError) => {
      const parsedError = parseGPSError(err);
      setError(parsedError);
      setIsLoading(false);

      // Fallback: If high accuracy fails, try again with lower accuracy
      if (
        enableHighAccuracy &&
        !hasAttemptedHighAccuracyRef.current &&
        err.code === err.TIMEOUT
      ) {
        console.log('High accuracy timed out, trying with lower accuracy...');
        hasAttemptedHighAccuracyRef.current = true;
        // Will retry with enableHighAccuracy: false in the next effect cycle
      }
    },
    [enableHighAccuracy]
  );

  const refresh = useCallback(() => {
    if (!isSupported) return;

    setIsLoading(true);
    setError(null);

    // Get current position immediately
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: hasAttemptedHighAccuracyRef.current
        ? false
        : enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }, [isSupported, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    // If mock position provided, use it and skip real GPS
    if (mockPosition) {
      setPosition(mockPosition);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!isSupported) {
      setError({
        code: -1,
        message: 'Geolocation is not supported by your browser.',
      });
      setIsLoading(false);
      return;
    }

    // Initial position fetch
    refresh();

    // Set up continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: hasAttemptedHighAccuracyRef.current
          ? false
          : enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError, refresh, mockPosition]);

  // Helper function to calculate distance to target
  const distanceTo = useCallback(
    (targetLat: number, targetLon: number): number | null => {
      if (!position) return null;
      return getDistanceInMeters(
        position.latitude,
        position.longitude,
        targetLat,
        targetLon
      );
    },
    [position]
  );

  return {
    position,
    error,
    isLoading,
    isSupported,
    distanceTo,
    refresh,
  };
}
