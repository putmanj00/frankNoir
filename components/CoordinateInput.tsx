'use client';

import { useState } from 'react';
import { Input, Button, Card, CardBody } from '@heroui/react';

interface CoordinateInputProps {
  targetCoordinates: { lat: number; lng: number };
  onSolved: () => void;
  tolerance?: number; // Tolerance in degrees, default 0.001 (~111 meters)
}

/**
 * Coordinate input puzzle
 * User must enter GPS coordinates found in physical clue
 * Validates format and checks if coordinates match target
 */
export function CoordinateInput({
  targetCoordinates,
  onSolved,
  tolerance = 0.001,
}: CoordinateInputProps) {
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const validateCoordinate = (value: string, type: 'lat' | 'lng'): number | null => {
    // Remove whitespace
    const trimmed = value.trim();

    // Try to parse as number
    const num = parseFloat(trimmed);

    if (isNaN(num)) {
      return null;
    }

    // Validate range
    if (type === 'lat' && (num < -90 || num > 90)) {
      return null;
    }
    if (type === 'lng' && (num < -180 || num > 180)) {
      return null;
    }

    return num;
  };

  const handleSubmit = () => {
    setError('');
    setIsValidating(true);

    // Validate latitude
    const lat = validateCoordinate(latInput, 'lat');
    if (lat === null) {
      setError('Invalid latitude. Must be between -90 and 90.');
      setIsValidating(false);
      return;
    }

    // Validate longitude
    const lng = validateCoordinate(lngInput, 'lng');
    if (lng === null) {
      setError('Invalid longitude. Must be between -180 and 180.');
      setIsValidating(false);
      return;
    }

    // Check if coordinates match target (within tolerance)
    const latDiff = Math.abs(lat - targetCoordinates.lat);
    const lngDiff = Math.abs(lng - targetCoordinates.lng);

    if (latDiff <= tolerance && lngDiff <= tolerance) {
      // Correct!
      setIsSolved(true);
      setTimeout(() => {
        onSolved();
      }, 1500);
    } else {
      // Wrong coordinates
      const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111; // Rough km
      setError(
        `Coordinates don't match. You're about ${distance.toFixed(1)}km away. Check the clue again.`
      );
      setIsValidating(false);
    }
  };

  const formatHint = (coord: number, type: 'lat' | 'lng'): string => {
    const abs = Math.abs(coord);
    const direction = type === 'lat'
      ? coord >= 0 ? 'N' : 'S'
      : coord >= 0 ? 'E' : 'W';
    return `${abs.toFixed(6)}° ${direction}`;
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="glass-card">
        <CardBody className="p-4">
          <p className="text-sm text-gray-300">
            Enter the GPS coordinates found in the <span className="text-neon-magenta font-semibold">vintage pharmacist bottle</span>.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Format: Decimal degrees (e.g., 39.1031, -84.5120)
          </p>
        </CardBody>
      </Card>

      {/* Input Fields */}
      <div className="space-y-4">
        <Input
          label="Latitude"
          placeholder="39.1031"
          value={latInput}
          onValueChange={setLatInput}
          isDisabled={isSolved || isValidating}
          classNames={{
            input: 'font-mono',
            label: 'text-acid-yellow',
          }}
          endContent={
            <span className="text-xs text-gray-500">°</span>
          }
        />

        <Input
          label="Longitude"
          placeholder="-84.5120"
          value={lngInput}
          onValueChange={setLngInput}
          isDisabled={isSolved || isValidating}
          classNames={{
            input: 'font-mono',
            label: 'text-acid-yellow',
          }}
          endContent={
            <span className="text-xs text-gray-500">°</span>
          }
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Success Message */}
      {isSolved && (
        <div className="p-3 bg-lisa-frank-purple/20 border border-lisa-frank-purple rounded text-sm text-lisa-frank-purple font-bold text-center animate-pulse">
          ✓ Coordinates verified! Unlocking stage...
        </div>
      )}

      {/* Submit Button */}
      <Button
        className="gradient-button w-full"
        size="lg"
        onPress={handleSubmit}
        isDisabled={!latInput || !lngInput || isSolved}
        isLoading={isValidating}
      >
        {isValidating ? 'Verifying...' : '🔓 Verify Coordinates'}
      </Button>

      {/* Format Help */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-mono">Example format:</p>
        <p className="font-mono text-gray-400">
          Lat: {formatHint(39.1031, 'lat')}
        </p>
        <p className="font-mono text-gray-400">
          Lng: {formatHint(-84.5120, 'lng')}
        </p>
      </div>
    </div>
  );
}
