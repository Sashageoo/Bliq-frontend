import { motion } from 'motion/react';
import { Camera, Users } from 'lucide-react';
import { getProgressColor, getProgressTextColor } from './SuperpowerColorUtils';

interface CompactSuperpowerCardProps {
  name: string;
  emoji: string;
  value: number;
  energy?: number; // Опционально для профилей
  index: number;
  trend?: 'up' | 'down' | 'stable';
  ownerName?: string;
  ownerAvatar?: string;
  isOwn?: boolean;
  onClick?: () => void;
  // Новые пропсы для библиотеки суперсил
  mode?: 'profile' | 'library'; // Режим отображения
  totalUsers?: number; // Количество пользователей
  totalBliks?: number; // Общее количество бликов
  // Пропсы для TopScreen
  showRank?: boolean; // Показывать ранг
  rank?: number; // Номер места в топе
  growthRate?: number; // Процент роста
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
  onClick,
  mode = 'profile',
  totalUsers,
  totalBliks,
  showRank = false,
  rank,
  growthRate
}: CompactSuperpowerCardProps) {

  // 🎯 РЕЖИМ БИБЛИОТЕКИ - показываем статистику
  if (mode === 'library') {
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
          rounded-xl
          hover:bg-accent
          transition-all duration-300
          cursor-pointer
          flex flex-col
          flex-shrink-0
          group
          relative overflow-hidden
          shadow-lg hover:shadow-xl
        "
      >
        {/* Ранк бейдж для топов */}
        {showRank && rank && (
          <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xs energy-glow shadow-lg">
            {rank}
          </div>
        )}
        
        {/* Процент роста */}
        {growthRate !== undefined && growthRate > 0 && (
          <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-green-500/90 backdrop-blur-sm flex items-center gap-1 text-white text-xs font-medium shadow-lg">
            <span>↑</span>
            <span>{growthRate}%</span>
          </div>
        )}
        
        {/* Контейнер с отступами сверху и сбоку */}
        <div className="relative z-10 flex flex-col h-full pt-3 px-3">
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
          </div>
          
          {/* Количество пользователей */}
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={14} className="text-green-400 flex-shrink-0" />
            <span className="font-bold text-base text-white">
              {totalUsers && totalUsers >= 1000 
                ? `${(totalUsers / 1000).toFixed(1)}k` 
                : totalUsers}
            </span>
          </div>
          
          {/* Общее количество бликов */}
          <div className="flex items-center gap-1.5">
            <Camera size={14} className="text-blue-400 flex-shrink-0" />
            <span className="font-bold text-base text-white">
              {totalBliks && totalBliks >= 1000 
                ? `${(totalBliks / 1000).toFixed(1)}k` 
                : totalBliks}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 🎯 РЕЖИМ ПРОФИЛЯ - показываем энергию и блики пользователя
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
        {energy !== undefined && (
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
        )}
      </div>
    </motion.div>
  );
}