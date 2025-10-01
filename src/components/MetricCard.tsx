import { motion } from 'motion/react';

interface MetricCardProps {
  icon: string;
  label: string;
  value: number;
  index: number;
}

export function MetricCard({ icon, label, value, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="
        backdrop-blur-xl glass-card
        rounded-2xl p-4 text-center
        hover:bg-accent
        transition-all duration-300
        shadow-lg hover:shadow-xl
        group cursor-pointer
        relative overflow-hidden
      "
    >
      <div className="relative z-10">
        {/* Иконка с энергетическим фоном */}
        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
          {icon}
        </div>
        
        <div className="text-2xl font-bold mb-1 text-white">
          {value.toLocaleString()}
        </div>
        
        <div className="text-sm text-white/70">
          {label}
        </div>
      </div>
    </motion.div>
  );
}