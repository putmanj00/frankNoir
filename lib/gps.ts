/**
 * GPS tracking and distance calculation utilities
 */

export interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  timestamp: number;
}

export interface GPSError {
  code: number;
  message: string;
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in meters
 */
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if user is within radius of target coordinates
 */
export function isWithinRadius(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radiusMeters: number
): boolean {
  const distance = getDistanceInMeters(userLat, userLon, targetLat, targetLon);
  return distance <= radiusMeters;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get accuracy quality indicator
 */
export function getAccuracyQuality(accuracy: number): {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  description: string;
} {
  if (accuracy <= 10) {
    return {
      quality: 'excellent',
      color: '#ac3cfe', // Lisa Frank Purple
      description: 'GPS signal excellent',
    };
  }
  if (accuracy <= 30) {
    return {
      quality: 'good',
      color: '#ffb622', // Solar Flare Gold
      description: 'GPS signal good',
    };
  }
  if (accuracy <= 100) {
    return {
      quality: 'fair',
      color: '#fffd42', // Acid Yellow
      description: 'GPS signal fair',
    };
  }
  return {
    quality: 'poor',
    color: '#f53fe8', // Neon Magenta
    description: 'GPS signal poor',
  };
}

/**
 * Parse Geolocation API error
 */
export function parseGPSError(error: GeolocationPositionError): GPSError {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        code: error.code,
        message: 'Location access denied. Please enable location services.',
      };
    case error.POSITION_UNAVAILABLE:
      return {
        code: error.code,
        message: 'Location unavailable. Check your GPS settings.',
      };
    case error.TIMEOUT:
      return {
        code: error.code,
        message: 'Location request timed out. Retrying...',
      };
    default:
      return {
        code: error.code,
        message: 'An unknown error occurred while getting location.',
      };
  }
}
