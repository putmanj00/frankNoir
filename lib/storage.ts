import type { Stage } from './stages';

const STORAGE_KEY = 'frankNoir:progress';
const STORAGE_VERSION = '1.0'; // For future migration support

interface StoredProgress {
  version: string;
  stages: Stage[];
  lastUpdated: string;
}

/**
 * Save stage progress to localStorage
 */
export function saveProgress(stages: Stage[]): void {
  try {
    const data: StoredProgress = {
      version: STORAGE_VERSION,
      stages,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save progress:', error);
    // Handle quota exceeded or other storage errors gracefully
  }
}

/**
 * Load stage progress from localStorage
 * Returns null if no saved data exists or if data is corrupt
 */
export function loadProgress(): Stage[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StoredProgress = JSON.parse(stored);

    // Validate data structure
    if (!data.version || !Array.isArray(data.stages)) {
      console.warn('Invalid progress data structure, resetting...');
      clearProgress();
      return null;
    }

    // Future: Handle version migrations here
    if (data.version !== STORAGE_VERSION) {
      console.warn('Progress data version mismatch, may need migration');
      // For now, just return the data
    }

    return data.stages;
  } catch (error) {
    console.error('Failed to load progress:', error);
    // If JSON parsing fails or any other error, clear corrupt data
    clearProgress();
    return null;
  }
}

/**
 * Clear all saved progress
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

/**
 * Check if there is saved progress
 */
export function hasSavedProgress(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get last updated timestamp from saved progress
 */
export function getLastUpdated(): Date | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StoredProgress = JSON.parse(stored);
    return new Date(data.lastUpdated);
  } catch (error) {
    return null;
  }
}
