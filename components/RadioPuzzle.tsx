'use client';

import { useState, useEffect, useRef } from 'react';
import { Slider, Button, Card, CardBody } from '@heroui/react';

interface RadioPuzzleProps {
  targetFrequency: number; // In MHz, e.g., 20.50
  onSolved: () => void;
  tolerance?: number; // How close to target (MHz), default 0.01
}

/**
 * Radio frequency slider puzzle
 * User must tune to the exact frequency to unlock the stage
 * Uses Web Audio API to simulate radio static/signal
 */
export function RadioPuzzle({
  targetFrequency,
  onSolved,
  tolerance = 0.01,
}: RadioPuzzleProps) {
  const [frequency, setFrequency] = useState(10.0); // Start at low frequency
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Check if frequency is close enough to target
  const distanceFromTarget = Math.abs(frequency - targetFrequency);
  const isClose = distanceFromTarget <= tolerance;
  const proximityPercentage = Math.max(
    0,
    100 - (distanceFromTarget / 5) * 100
  ); // Within 5 MHz = 100%

  useEffect(() => {
    // Check if solved
    if (isClose && !isSolved) {
      setIsSolved(true);
      setTimeout(() => {
        onSolved();
      }, 1500); // Delay to show success state
    }
  }, [isClose, isSolved, onSolved]);

  const startAudio = () => {
    if (audioContextRef.current) return;

    // Create Web Audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContext();
    audioContextRef.current = context;

    // Create oscillator for static noise
    const oscillator = context.createOscillator();
    oscillator.type = 'sawtooth'; // Raspy static sound
    oscillatorRef.current = oscillator;

    // Create gain node for volume control
    const gainNode = context.createGain();
    gainNode.gain.value = 0.1; // Start quiet
    gainNodeRef.current = gainNode;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Start oscillator
    oscillator.start();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || !oscillatorRef.current || !gainNodeRef.current) return;

    // Adjust frequency and volume based on proximity to target
    const staticFrequency = 100 + (100 - proximityPercentage) * 20; // More static when far
    oscillatorRef.current.frequency.value = staticFrequency;

    // Volume decreases as you get closer (less static)
    const volume = 0.1 * (1 - proximityPercentage / 100);
    gainNodeRef.current.gain.value = Math.max(0.001, volume);
  }, [frequency, proximityPercentage, isPlaying]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Frequency Display */}
      <Card className="glass-card">
        <CardBody className="p-6 text-center">
          <div className="text-6xl font-bold font-mono" style={{
            color: isClose ? '#ac3cfe' : '#f53fe8',
            textShadow: isClose ? '0 0 20px #ac3cfe' : 'none',
          }}>
            {frequency.toFixed(2)}
            <span className="text-2xl ml-2">MHz</span>
          </div>
          {isClose && !isSolved && (
            <div className="mt-4 text-sm text-lisa-frank-purple animate-pulse">
              ✓ Signal locked! Decoding...
            </div>
          )}
          {isSolved && (
            <div className="mt-4 text-sm text-lisa-frank-purple font-bold">
              🎉 Memory unlocked!
            </div>
          )}
        </CardBody>
      </Card>

      {/* Signal Strength Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>SIGNAL STRENGTH</span>
          <span>{Math.round(proximityPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${proximityPercentage}%`,
              backgroundColor: isClose ? '#ac3cfe' : '#ffb622',
              boxShadow: isClose ? '0 0 10px #ac3cfe' : 'none',
            }}
          />
        </div>
      </div>

      {/* Frequency Slider */}
      <div className="space-y-4">
        <label className="block text-sm text-gray-400 font-mono mb-2">
          Tune Frequency
        </label>
        <input
          type="range"
          min={10.0}
          max={30.0}
          step={0.01}
          value={frequency}
          onChange={(e) => setFrequency(parseFloat(e.target.value))}
          disabled={isSolved}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
          style={{
            background: `linear-gradient(to right, #ac3cfe 0%, #f53fe8 ${((frequency - 10) / 20) * 100}%, #333 ${((frequency - 10) / 20) * 100}%, #333 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>10.0 MHz</span>
          <span>30.0 MHz</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex gap-2">
        {!isPlaying ? (
          <Button
            className="gradient-button flex-1"
            onPress={startAudio}
            isDisabled={isSolved}
          >
            🔊 Start Tuning
          </Button>
        ) : (
          <Button
            variant="flat"
            color="danger"
            className="flex-1"
            onPress={stopAudio}
          >
            🔇 Stop Audio
          </Button>
        )}
      </div>

      {/* Hint */}
      <div className="text-xs text-gray-500 text-center italic">
        Listen for the signal to strengthen as you approach the correct frequency...
      </div>
    </div>
  );
}
