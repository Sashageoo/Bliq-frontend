import { motion } from 'motion/react';
import { Wifi, Battery, Signal } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 text-white text-sm">
      <span className="font-medium">9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={16} className="fill-white" />
        <Wifi size={16} className="fill-white" />
        <Battery size={16} className="fill-white" />
      </div>
    </div>
  );
}