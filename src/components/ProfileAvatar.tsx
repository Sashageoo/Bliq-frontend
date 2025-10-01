import { motion } from 'motion/react';

interface ProfileAvatarProps {
  image: string;
  isOnline?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large';
}

export function ProfileAvatar({ image, isOnline = true, size = 'medium' }: ProfileAvatarProps) {
  const sizeClasses = {
    tiny: 'w-6 h-6',
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/20`}
      >
        <img 
          src={image} 
          alt="Profile"
          className="w-full h-full object-cover"
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