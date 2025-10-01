import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

interface SuperpowerBliker {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  recentBliks: number;
  hasNewContent?: boolean;
  level?: 'Новичок' | 'Любитель' | 'Про' | 'Мастер' | 'Эксперт' | 'Гуру';
  badgeEmoji?: string;
}

interface SuperpowerBlikersWidgetProps {
  blikers: SuperpowerBliker[];
  superpowerName: string;
  superpowerEmoji: string;
  totalBlikers: number;
  activeToday: number;
  weeklyGrowth: number;
  onUserProfile: (userId: string) => void;
}

export function SuperpowerBlikersWidget({
  blikers,
  superpowerName,
  superpowerEmoji,
  totalBlikers,
  activeToday,
  weeklyGrowth,
  onUserProfile
}: SuperpowerBlikersWidgetProps) {
  return (
    <div className="relative z-10 w-full">
      <div className="px-4 pb-4">


        {/* Мобильная версия: горизонтальный скролл */}
        <div className="block lg:hidden">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {blikers.map((bliker, index) => (
              <SuperpowerBlikerCard
                key={bliker.id}
                bliker={bliker}
                index={index}
                onUserProfile={onUserProfile}
              />
            ))}
          </div>
        </div>
        
        {/* Десктопная версия: горизонтальный скролл */}
        <div className="hidden lg:block">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {blikers.map((bliker, index) => (
              <SuperpowerBlikerCard
                key={bliker.id}
                bliker={bliker}
                index={index}
                onUserProfile={onUserProfile}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Разделитель */}
      <div className="border-b border-white/5 mx-4"></div>
    </div>
  );
}

// Компонент карточки бликера
const SuperpowerBlikerCard = memo(function SuperpowerBlikerCard({ 
  bliker, 
  index,
  onUserProfile 
}: { 
  bliker: SuperpowerBliker; 
  index: number;
  onUserProfile: (userId: string) => void 
}) {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Гуру': return 'from-yellow-500 to-amber-400';
      case 'Эксперт': return 'from-red-500 to-orange-400';
      case 'Мастер': return 'from-purple-500 to-pink-400';
      case 'Про': return 'from-blue-500 to-cyan-400';
      case 'Любитель': return 'from-green-500 to-emerald-400';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onUserProfile(bliker.id)}
      className="
        flex flex-col items-center gap-2 
        cursor-pointer
        p-3 rounded-xl
        hover:bg-white/5
        transition-all duration-300
        group
        relative
        min-w-[85px] flex-shrink-0
        lg:min-w-[95px]
      "
    >
      {/* Glow effect на hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* Аватар с рамкой уровня */}
        <div className={`p-0.5 rounded-full ${
          bliker.hasNewContent || bliker.level
            ? `bg-gradient-to-br ${getLevelColor(bliker.level)}` 
            : 'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          <div className="p-0.5 bg-black rounded-full">
            <ProfileAvatar 
              image={bliker.avatar} 
              isOnline={bliker.isOnline}
              size="medium"
            />
          </div>
        </div>
        
        {/* Имя и уровень */}
        <div className="text-center min-w-[60px] max-w-[80px]">
          <div className="text-white text-xs truncate mb-1">
            {bliker.name.split(' ')[0]}
          </div>
          {bliker.level && (
            <div className="text-white/60 text-[10px] truncate">
              {bliker.level}
            </div>
          )}
        </div>

        {/* Бейдж с эмодзи уровня */}
        {bliker.badgeEmoji && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-black flex items-center justify-center">
            <span className="text-xs">
              {bliker.badgeEmoji}
            </span>
          </div>
        )}

        {/* Количество новых бликов */}
        {bliker.hasNewContent && bliker.recentBliks > 0 && (
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full border-2 border-black flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {bliker.recentBliks > 9 ? '9+' : bliker.recentBliks}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
});