import { useState, useEffect } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import type { Stage } from '@/lib/stages';

interface HintSystemProps {
  stage: Stage;
  onHintRevealed?: (hintLevel: number) => void;
}

/**
 * 3-level progressive hint system
 * Hints must be revealed sequentially (cannot skip ahead)
 * State persists in localStorage per stage
 */
export function HintSystem({ stage, onHintRevealed }: HintSystemProps) {
  const [revealedLevel, setRevealedLevel] = useState(0); // 0 = none, 1-3 = hint levels
  const storageKey = `frankNoir:hints:stage${stage.id}`;

  // Load revealed hints from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const level = parseInt(saved);
        if (level >= 0 && level <= 3) {
          setRevealedLevel(level);
        }
      }
    } catch (error) {
      console.error('Failed to load hint state:', error);
    }
  }, [storageKey]);

  const handleRevealHint = (level: number) => {
    // Can only reveal next hint in sequence
    if (level === revealedLevel + 1 && level <= 3) {
      setRevealedLevel(level);
      try {
        localStorage.setItem(storageKey, level.toString());
      } catch (error) {
        console.error('Failed to save hint state:', error);
      }

      if (onHintRevealed) {
        onHintRevealed(level);
      }
    }
  };

  const hints = stage.hints;
  const allHintsRevealed = revealedLevel === 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-400">PROGRESSIVE HINTS</h3>
        <span className="text-xs text-gray-500 font-mono">
          {revealedLevel}/3 revealed
        </span>
      </div>

      {/* Hint 1: Subtle */}
      <Card
        className={`glass-card ${
          revealedLevel >= 1 ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <CardBody className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-acid-yellow">
                  HINT 1 - SUBTLE
                </span>
              </div>
              {revealedLevel >= 1 ? (
                <p className="text-sm text-gray-300">{hints[0]}</p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Click to reveal first hint...
                </p>
              )}
            </div>
            {revealedLevel < 1 && (
              <Button
                size="sm"
                variant="flat"
                className="min-w-[80px]"
                onPress={() => handleRevealHint(1)}
              >
                Reveal
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Hint 2: Clear */}
      <Card
        className={`glass-card ${
          revealedLevel >= 2
            ? 'opacity-100'
            : revealedLevel >= 1
            ? 'opacity-50'
            : 'opacity-30'
        }`}
      >
        <CardBody className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-solar-flare-gold">
                  HINT 2 - CLEAR
                </span>
              </div>
              {revealedLevel >= 2 ? (
                <p className="text-sm text-gray-300">{hints[1]}</p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {revealedLevel >= 1
                    ? 'Click to reveal clearer hint...'
                    : 'Reveal hint 1 first'}
                </p>
              )}
            </div>
            {revealedLevel === 1 && (
              <Button
                size="sm"
                variant="flat"
                className="min-w-[80px]"
                onPress={() => handleRevealHint(2)}
              >
                Reveal
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Hint 3: Obvious */}
      <Card
        className={`glass-card ${
          revealedLevel >= 3
            ? 'opacity-100'
            : revealedLevel >= 2
            ? 'opacity-50'
            : 'opacity-30'
        }`}
      >
        <CardBody className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-neon-magenta">
                  HINT 3 - OBVIOUS
                </span>
              </div>
              {revealedLevel >= 3 ? (
                <p className="text-sm text-gray-300 font-semibold">{hints[2]}</p>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  {revealedLevel >= 2
                    ? 'Click to reveal final hint...'
                    : 'Reveal hints 1 & 2 first'}
                </p>
              )}
            </div>
            {revealedLevel === 2 && (
              <Button
                size="sm"
                variant="flat"
                className="min-w-[80px]"
                onPress={() => handleRevealHint(3)}
              >
                Reveal
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {allHintsRevealed && (
        <div className="text-center text-xs text-gray-500 font-mono pt-2">
          ✓ All hints revealed
        </div>
      )}
    </div>
  );
}
