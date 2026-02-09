import { describe, it, expect } from 'vitest';
import { INITIAL_STAGES } from '@/lib/stages';
import { initializeStageStatuses } from '@/lib/unlock';

/**
 * Baseline tests for core navigation and stage logic
 * These tests verify fundamental functionality without UI rendering
 */
describe('Navigation & Stage Logic (Baseline)', () => {
  it('should initialize stages with correct statuses', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    expect(stages).toHaveLength(15);
    expect(stages[0].status).toBe('active'); // First stage should be active

    // All other stages should be locked initially
    for (let i = 1; i < stages.length; i++) {
      expect(stages[i].status).toBe('locked');
    }
  });

  it('should have all 15 stages with required properties', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    stages.forEach((stage, index) => {
      // Verify required properties exist
      expect(stage).toHaveProperty('id');
      expect(stage).toHaveProperty('title');
      expect(stage).toHaveProperty('subtitle');
      expect(stage).toHaveProperty('location');
      expect(stage).toHaveProperty('time');
      expect(stage).toHaveProperty('description');
      expect(stage).toHaveProperty('clue');
      expect(stage).toHaveProperty('unlockType');
      expect(stage).toHaveProperty('hints');
      expect(stage).toHaveProperty('status');
      expect(stage).toHaveProperty('coordinates');

      // Verify types
      expect(typeof stage.id).toBe('number');
      expect(typeof stage.title).toBe('string');
      expect(typeof stage.description).toBe('string');
      expect(['gps', 'puzzle', 'scan', 'time']).toContain(stage.unlockType);
      expect(['locked', 'active', 'completed']).toContain(stage.status);
      expect(Array.isArray(stage.hints)).toBe(true);
      expect(stage.hints).toHaveLength(3);

      // Verify coordinates structure
      expect(stage.coordinates).toBeDefined();
      if (stage.coordinates) {
        expect(stage.coordinates).toHaveProperty('lat');
        expect(stage.coordinates).toHaveProperty('lng');
        expect(typeof stage.coordinates.lat).toBe('number');
        expect(typeof stage.coordinates.lng).toBe('number');
      }
    });
  });

  it('should have valid GPS coordinates for all stages', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    stages.forEach((stage) => {
      expect(stage.coordinates).toBeDefined();
      if (!stage.coordinates) return;

      const { lat, lng } = stage.coordinates;

      // Cincinnati is approximately 39°N, 84°W
      // Verify coordinates are in reasonable range
      expect(lat).toBeGreaterThan(39.0);
      expect(lat).toBeLessThan(39.2);
      expect(lng).toBeGreaterThan(-84.6);
      expect(lng).toBeLessThan(-84.4);
    });
  });

  it('should have progressive hints for each stage', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    stages.forEach((stage) => {
      expect(stage.hints).toHaveLength(3);

      // Verify hints are strings and not empty
      stage.hints.forEach((hint) => {
        expect(typeof hint).toBe('string');
        expect(hint.length).toBeGreaterThan(0);
      });

      // Third hint should be most explicit (usually contains location name)
      const thirdHint = stage.hints[2];
      expect(thirdHint.length).toBeGreaterThan(stage.hints[0].length * 0.5);
    });
  });

  it('should assign unlock types correctly', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    // Stage 1: GPS unlock (Home)
    expect(stages[0].unlockType).toBe('gps');

    // Stage 2: Scan (Sleepy Bee chandelier)
    expect(stages[1].unlockType).toBe('scan');

    // Stage 3: Puzzle (Radio frequency)
    expect(stages[2].unlockType).toBe('puzzle');

    // Stage 11: Time lock (Safe House)
    expect(stages[10].unlockType).toBe('time');
  });

  it('should have unique stage IDs', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);
    const ids = stages.map((s) => s.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(15);

    // IDs should be sequential 1-15
    for (let i = 1; i <= 15; i++) {
      expect(ids).toContain(i);
    }
  });

  it('should have chronological times', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    // Parse times and verify they're increasing
    const times = stages.map((s) => {
      const [time, period] = s.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return hour24 * 60 + minutes;
    });

    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });

  it('should have GPS unlock radiuses for GPS stages', () => {
    const stages = initializeStageStatuses(INITIAL_STAGES);

    stages.forEach((stage) => {
      if (stage.unlockType === 'gps') {
        expect(stage).toHaveProperty('unlockRadius');
        expect(typeof stage.unlockRadius).toBe('number');
        expect(stage.unlockRadius).toBeGreaterThan(0);
        expect(stage.unlockRadius).toBeLessThan(200); // Reasonable max radius
      }
    });
  });
});
