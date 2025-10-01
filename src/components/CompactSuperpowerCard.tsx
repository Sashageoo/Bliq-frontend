import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { getProgressColor, getProgressTextColor } from './SuperpowerColorUtils';

interface CompactSuperpowerCardProps {
  name: string;
  emoji: string;
  value: number;
  energy: number;
  index: number;
  trend?: 'up' | 'down' | 'stable';
  ownerName?: string;
  ownerAvatar?: string;
  isOwn?: boolean;
  onClick?: () => void;
}

export function CompactSuperpowerCard({ 
  name, 
  emoji, 
  value, 
  energy, 
  index,
  trend = 'stable',
  ownerName,
  ownerAvatar,
  isOwn = false,
  onClick
}: CompactSuperpowerCardProps) {


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        backdrop-blur-xl glass-card
        rounded-xl p-4
        hover:bg-accent
        transition-all duration-300
        cursor-pointer
        w-28 h-32
        flex flex-col
        flex-shrink-0
        group
        relative overflow-hidden
        shadow-lg hover:shadow-xl
      "
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Владелец суперсилы (если не своя) */}
        {!isOwn && ownerName && ownerAvatar && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="w-6 h-6 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800/80 backdrop-blur-sm">
              <img 
                src={ownerAvatar} 
                alt={ownerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Название суперсилы */}
        <div className="mb-3">
          <div className="font-medium text-sm leading-tight text-white">
            <div 
              className="line-clamp-2"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.1rem',
                height: '2.2rem',
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {name.replace(' - Ваша', '').replace('Ваша ', '')}
            </div>
          </div>
          {/* Имя владельца под названием (если не своя) */}
          {!isOwn && ownerName && (
            <div className="text-xs text-white/60 mt-1 truncate">
              {ownerName}
            </div>
          )}
        </div>
        
        {/* Значение с иконкой камеры */}
        <div className="flex items-center gap-1 mb-3">
          <span className="font-bold text-xl text-white">{value}</span>
          <Camera size={14} className="text-blue-400" />
        </div>
        
        {/* Прогресс-бар с процентом */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 relative h-2 rounded-full overflow-hidden bg-slate-700/50 mr-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${energy}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                className={`h-full ${getProgressColor(energy)} rounded-full relative`}
              >
                {/* Энергетическое свечение */}
                <div className={`absolute inset-0 ${getProgressColor(energy)} blur-sm opacity-40`} />
              </motion.div>
            </div>
            <span className={`font-bold text-xs ${getProgressTextColor(energy)} min-w-[2rem]`}>
              {energy}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}