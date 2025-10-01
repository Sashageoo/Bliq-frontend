import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { getProgressColor, getBackgroundGradient } from './SuperpowerColorUtils';

interface SuperpowerCardProps {
  name: string;
  emoji: string;
  bliks: number;
  energy: number;
  trend?: 'up' | 'down' | 'stable';
  size?: 'small' | 'medium' | 'large';
  index?: number;
  layout?: 'vertical' | 'horizontal';
  ownerName?: string;
  ownerAvatar?: string;
  isOwn?: boolean;
  onClick?: () => void;
  screenWidth?: number;
}

export function SuperpowerCard({ 
  name, 
  emoji, 
  bliks, 
  energy, 
  trend = 'stable',
  size = 'medium',
  index = 0,
  layout = 'vertical',
  ownerName,
  ownerAvatar,
  isOwn = false,
  onClick,
  screenWidth = 768
}: SuperpowerCardProps) {
  // Адаптивные размеры карточки в зависимости от размера экрана
  const getCardSettings = () => {
    if (screenWidth >= 1920) return {
      padding: size === 'large' ? 'p-6' : size === 'medium' ? 'p-4' : 'p-3',
      emojiSize: size === 'large' ? 'text-4xl w-16 h-16' : 'text-3xl w-12 h-12',
      titleSize: size === 'large' ? 'text-xl' : 'text-base', // Увеличили с text-sm до text-base
      bliksSize: size === 'large' ? 'text-xl' : 'text-lg',
      aspectRatio: 'aspect-[3/4]', // Более квадратные пропорции на больших экранах
      maxHeight: 'max-h-72'
    };
    if (screenWidth >= 1536) return {
      padding: size === 'large' ? 'p-6' : size === 'medium' ? 'p-4' : 'p-3',
      emojiSize: size === 'large' ? 'text-4xl w-14 h-14' : 'text-3xl w-12 h-12',
      titleSize: size === 'large' ? 'text-xl' : 'text-base', // Увеличили с text-sm до text-base
      bliksSize: size === 'large' ? 'text-xl' : 'text-lg',
      aspectRatio: 'aspect-[3/4]',
      maxHeight: 'max-h-64'
    };
    if (screenWidth >= 1280) return {
      padding: size === 'large' ? 'p-5' : size === 'medium' ? 'p-4' : 'p-3',
      emojiSize: size === 'large' ? 'text-4xl w-14 h-14' : 'text-3xl w-12 h-12',
      titleSize: size === 'large' ? 'text-lg' : 'text-sm', // Увеличили с text-base/text-sm до text-lg/text-sm
      bliksSize: size === 'large' ? 'text-xl' : 'text-lg',
      aspectRatio: 'aspect-[4/5]',
      maxHeight: 'max-h-56'
    };
    if (screenWidth >= 768) return {
      padding: size === 'large' ? 'p-4' : size === 'medium' ? 'p-3' : 'p-2',
      emojiSize: size === 'large' ? 'text-3xl w-12 h-12' : 'text-2xl w-10 h-10',
      titleSize: size === 'large' ? 'text-base' : 'text-xs',
      bliksSize: size === 'large' ? 'text-lg' : 'text-base',
      aspectRatio: 'aspect-[4/5]',
      maxHeight: 'max-h-48'
    };
    if (screenWidth >= 480) return {
      padding: size === 'large' ? 'p-3' : size === 'medium' ? 'p-2.5' : 'p-2',
      emojiSize: size === 'large' ? 'text-2xl w-10 h-10' : 'text-xl w-8 h-8',
      titleSize: size === 'large' ? 'text-sm' : 'text-xs',
      bliksSize: size === 'large' ? 'text-base' : 'text-sm',
      aspectRatio: 'aspect-[4/5]',
      maxHeight: 'max-h-44'
    };
    // Очень маленькие экраны  
    return {
      padding: size === 'large' ? 'p-6' : size === 'medium' ? 'p-2' : 'p-1.5',
      emojiSize: size === 'large' ? 'text-4xl w-14 h-14' : 'text-lg w-7 h-7',
      titleSize: size === 'large' ? 'text-lg' : 'text-xs',
      bliksSize: size === 'large' ? 'text-xl' : 'text-sm',
      aspectRatio: 'aspect-[4/5]',
      maxHeight: 'max-h-40'
    };
  };

  const cardSettings = getCardSettings();



  // Горизонтальный layout для режима списка
  if (layout === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          backdrop-blur-xl glass-card
          rounded-2xl ${cardSettings.padding}
          hover:bg-accent
          transition-all duration-300
          cursor-pointer
          flex items-center gap-4
          group
          relative overflow-hidden
          shadow-lg hover:shadow-xl
          ${cardSettings.maxHeight}
        `}
      >
        <div className="relative z-10 flex items-center gap-4 w-full">
          {/* Эмодзи суперсилы с энергетическим фоном */}
          <div className={`${cardSettings.emojiSize} flex-shrink-0 filter drop-shadow-lg rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 relative`}>
            {emoji}
            {/* Владелец суперсилы (если не своя) */}
            {!isOwn && ownerName && ownerAvatar && (
              <div className="absolute -top-1 -right-1 z-20">
                <div className="w-5 h-5 rounded-full border border-white/30 overflow-hidden bg-slate-800/80 backdrop-blur-sm">
                  <img 
                    src={ownerAvatar} 
                    alt={ownerName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Основное содержимое */}
          <div className="flex-1 min-w-0">
            {/* Название */}
            <div className="mb-1">
              <h3 className={`font-semibold ${cardSettings.titleSize} line-clamp-1 text-white`}>
                {name.replace(' - Ваша', '').replace('Ваша ', '')}
              </h3>
              {/* Имя владельца под названием (если не своя) */}
              {!isOwn && ownerName && (
                <div className="text-xs text-white/60 truncate mt-1">
                  {ownerName}
                </div>
              )}
            </div>
            
            {/* Блики */}
            <div className="flex items-center gap-1 mb-3">
              <span className={`font-bold ${cardSettings.bliksSize} text-white`}>{bliks}</span>
              <Camera size={16} className="text-blue-500" />
            </div>
            
            {/* Прогресс-бар */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${energy}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                  className={`h-full ${getProgressColor(energy)} rounded-full relative`}
                >
                  {/* Энергетическое свечение */}
                  <div className={`absolute inset-0 ${getProgressColor(energy)} blur-sm opacity-60`} />
                </motion.div>
              </div>
              <span className={`font-bold text-sm min-w-[42px] ${getProgressColor(energy).replace('bg-', 'text-')}`}>
                {energy}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Вертикальный layout (по умолчанию)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        backdrop-blur-xl glass-card
        rounded-2xl ${cardSettings.padding}
        hover:bg-accent
        transition-all duration-300
        cursor-pointer
        ${cardSettings.aspectRatio}
        ${cardSettings.maxHeight}
        flex flex-col
        group
        relative overflow-hidden
        shadow-lg hover:shadow-xl
        w-full
      `}
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Владелец суперсилы (если не своя) */}
        {!isOwn && ownerName && ownerAvatar && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="w-7 h-7 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800/80 backdrop-blur-sm">
              <img 
                src={ownerAvatar} 
                alt={ownerName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Эмодзи - больше и с энергетическим фоном */}
        <div className="text-center mb-3">
          <div className={`${cardSettings.emojiSize} filter drop-shadow-lg inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40`}>
            {emoji}
          </div>
        </div>
        
        {/* Название суперсилы */}
        <div className="flex-1 flex flex-col justify-center mb-3">
          <h3 className={`font-semibold ${cardSettings.titleSize} text-center leading-tight text-white`}>
            <div 
              className="line-clamp-2"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: screenWidth >= 1280 ? '1.2rem' : screenWidth >= 480 ? '1.1rem' : '1rem',
                height: screenWidth >= 1280 ? '2.4rem' : screenWidth >= 480 ? '2.2rem' : '2rem',
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {name.replace(' - Ваша', '').replace('Ваша ', '')}
            </div>
          </h3>
          {/* Имя владельца под названием (если не своя) */}
          {!isOwn && ownerName && (
            <div className="text-xs text-white/60 text-center mt-1 truncate">
              {ownerName}
            </div>
          )}
        </div>
        
        {/* Блики */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <span className={`font-bold ${cardSettings.bliksSize} text-white`}>{bliks}</span>
          <Camera size={screenWidth >= 1280 ? 16 : 14} className="text-blue-500" />
        </div>
        
        {/* Прогресс-бар с процентом */}
        <div className="flex items-center gap-2">
          <div className={`relative flex-1 ${screenWidth >= 1280 ? 'h-2.5' : 'h-2'} rounded-full overflow-hidden bg-slate-700/50`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className={`h-full ${getProgressColor(energy)} rounded-full relative`}
            >
              {/* Энергетическое свечение */}
              <div className={`absolute inset-0 ${getProgressColor(energy)} blur-sm opacity-50`} />
            </motion.div>
          </div>
          <span className={`font-bold ${screenWidth >= 1280 ? 'text-sm' : 'text-xs'} ${getProgressColor(energy).replace('bg-', 'text-')} min-w-[32px] text-right`}>
            {energy}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}