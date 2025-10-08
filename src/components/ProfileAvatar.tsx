import { motion } from 'motion/react';

interface ProfileAvatarProps {
  image: string;
  isOnline?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  isBrandLogo?: boolean; // Флаг для логотипов брендов
  onClick?: () => void;
}

export function ProfileAvatar({ image, isOnline = true, size = 'medium', isBrandLogo = false, onClick }: ProfileAvatarProps) {
  const sizeClasses = {
    tiny: 'w-6 h-6',
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  // Определяем, является ли это логотипом Цех85
  const isTsekh85Logo = image?.includes('f264197d0dfa11757e4a661e9aace4fad7102f83') || isBrandLogo;

  return (
    <div 
      className="relative" 
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation(); // Останавливаем всплытие события
          onClick();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/20 ${
          isTsekh85Logo ? 'bg-white flex items-center justify-center' : ''
        }`}
        data-tsekh85-avatar={isTsekh85Logo ? 'true' : undefined}
      >
        <img 
          src={image} 
          alt="Profile"
          className={isTsekh85Logo ? "w-full h-full object-contain" : "w-full h-full object-cover"}
          data-brand-logo={isTsekh85Logo ? 'tsekh85' : undefined}
        />
      </motion.div>
      
      {isOnline && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          className={`absolute -bottom-1 -right-1 ${
            size === 'large' ? 'w-5 h-5' : 
            size === 'tiny' ? 'w-2 h-2' : 'w-4 h-4'
          } bg-green-500 rounded-full border-2 border-black/50`}
        />
      )}
    </div>
  );
}