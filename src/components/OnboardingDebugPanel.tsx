import React from 'react';
import { motion } from 'motion/react';
import { SkipForward, RotateCcw } from 'lucide-react';

interface OnboardingDebugPanelProps {
  currentScreen: string;
  onSkipToApp: () => void;
  onResetOnboarding: () => void;
}

export function OnboardingDebugPanel({ currentScreen, onSkipToApp, onResetOnboarding }: OnboardingDebugPanelProps) {
  // ПОЛНОСТЬЮ СКРЫВАЕМ DEBUG ПАНЕЛЬ
  return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 flex gap-2"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSkipToApp}
        className="px-3 py-2 bg-green-500/20 backdrop-blur-xl text-green-300 rounded-lg border border-green-400/30 flex items-center gap-2 text-sm hover:bg-green-500/30 transition-colors"
        title="Пропустить к приложению"
      >
        <SkipForward size={16} />
        Пропустить
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onResetOnboarding}
        className="px-3 py-2 bg-blue-500/20 backdrop-blur-xl text-blue-300 rounded-lg border border-blue-400/30 flex items-center gap-2 text-sm hover:bg-blue-500/30 transition-colors"
        title="Начать онбординг заново"
      >
        <RotateCcw size={16} />
        Рестарт
      </motion.button>
    </motion.div>
  );
}