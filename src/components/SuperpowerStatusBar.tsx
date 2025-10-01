import { motion } from 'motion/react';
import { ArrowLeft, Wifi, Battery, Signal } from 'lucide-react';

interface SuperpowerStatusBarProps {
  onBack: () => void;
}

export function SuperpowerStatusBar({ onBack }: SuperpowerStatusBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2 text-white text-sm">
      {/* Левая часть: стрелка назад вместо времени */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors duration-200"
      >
        <ArrowLeft size={18} className="text-white" />
      </motion.button>

      {/* Правая часть: системные иконки */}
      <div className="flex items-center gap-1">
        <Signal size={16} className="fill-white" />
        <Wifi size={16} className="fill-white" />
        <Battery size={16} className="fill-white" />
      </div>
    </div>
  );
}