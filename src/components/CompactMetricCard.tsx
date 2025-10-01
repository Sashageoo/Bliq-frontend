import { motion } from 'motion/react';
import { Camera, Users, Zap } from 'lucide-react';

interface CompactMetricCardProps {
  value: number;
  label: string;
  index: number;
  onClick: () => void;
}

const getIconForLabel = (label: string) => {
  switch (label) {
    case 'Блики':
      return <Camera size={16} className="text-blue-400" />;
    case 'Друзья':
      return <Users size={16} className="text-green-400" />;
    case 'Суперсилы':
      return <Zap size={16} className="text-purple-400" />;
    default:
      return null;
  }
};

export function CompactMetricCard({ value, label, index, onClick }: CompactMetricCardProps) {
  const icon = getIconForLabel(label);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center justify-center"
    >
      {/* Компактная кнопка с иконкой и числом */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className={`
          backdrop-blur-xl bg-white/10 
          rounded-xl border border-white/20
          p-4 
          hover:bg-white/15 
          transition-all duration-300
          cursor-pointer
          group
          relative overflow-hidden
          w-20 h-20
          flex flex-col items-center justify-center
          ${label === 'Блики' ? 'hover:border-blue-400/30' :
            label === 'Друзья' ? 'hover:border-green-400/30' :
            label === 'Суперсилы' ? 'hover:border-purple-400/30' : ''
          }
        `}
      >
        {/* Градиентный оверлей на hover */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
          label === 'Блики' ? 'bg-gradient-to-br from-blue-400/30 to-cyan-400/20' :
          label === 'Друзья' ? 'bg-gradient-to-br from-green-400/30 to-emerald-400/20' :
          label === 'Суперсилы' ? 'bg-gradient-to-br from-purple-400/30 to-pink-400/20' : ''
        }`} />
        
        {/* Иконка в верхней части */}
        <div className="relative z-10 mb-1.5">
          <div className="relative transition-transform duration-300 group-hover:scale-110">
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${
              label === 'Блики' ? 'bg-blue-400/40' :
              label === 'Друзья' ? 'bg-green-400/40' :
              label === 'Суперсилы' ? 'bg-purple-400/40' : ''
            }`} />
            {icon}
          </div>
        </div>
        
        {/* Число в нижней части кнопки */}
        <div className="relative z-10 text-white font-bold text-sm leading-none">
          {value}
        </div>
      </motion.button>
      
      {/* Подпись под кнопкой */}
      <motion.div 
        className="text-white/70 text-sm mt-2.5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: (index * 0.1) + 0.2 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}