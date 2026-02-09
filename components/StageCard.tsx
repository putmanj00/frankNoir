'use client';

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import type { Stage } from "@/lib/stages";

interface StageCardProps {
  stage: Stage;
  onClick?: () => void;
}

export function StageCard({ stage, onClick }: StageCardProps) {
  // Determine chip color based on status
  const getStatusChip = () => {
    const chipContent = {
      locked: <Chip color="default" variant="flat">Locked</Chip>,
      active: (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Chip style={{ backgroundColor: '#ffb622', color: '#030303' }} variant="solid">
            Active
          </Chip>
        </motion.div>
      ),
      completed: (
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Chip style={{ backgroundColor: '#ac3cfe', color: '#ffffff' }} variant="solid">
            Completed
          </Chip>
        </motion.div>
      ),
    };
    return chipContent[stage.status];
  };

  // Determine if card should be clickable
  const isInteractive = stage.status === 'active' || stage.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: stage.id * 0.05 }}
      whileHover={isInteractive ? { scale: 1.02, y: -4 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      onClick={isInteractive ? onClick : undefined}
      style={{ cursor: isInteractive ? 'pointer' : 'not-allowed' }}
    >
      <Card
        isPressable={false}
        className="glass-card w-full transition-all duration-300 hover:shadow-lg hover:shadow-neon-magenta/20"
        style={{
          opacity: stage.status === 'locked' ? 0.6 : 1,
        }}
      >
      <CardHeader className="flex justify-between items-start pb-2">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-neon-magenta">
              {stage.title}
            </h3>
            {getStatusChip()}
          </div>
          <p className="text-sm text-lisa-frank-purple font-semibold">
            {stage.subtitle}
          </p>
        </div>
        <div className="text-right text-sm text-gray-400">
          <p className="text-solar-flare-gold font-mono">{stage.time}</p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📍</span>
            <span className="text-gray-300">{stage.location}</span>
          </div>
          {stage.status !== 'locked' && (
            <p className="text-sm text-gray-300 italic">
              "{stage.description}"
            </p>
          )}
          {stage.status === 'locked' && (
            <p className="text-sm text-gray-500">
              Complete the previous stage to unlock...
            </p>
          )}
        </div>
      </CardBody>
    </Card>
    </motion.div>
  );
}
