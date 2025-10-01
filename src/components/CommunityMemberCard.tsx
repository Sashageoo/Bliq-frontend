import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Zap, Crown, Star, Heart } from 'lucide-react';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  bliks: number;
  level: 'Новичок' | 'Любитель' | 'Про' | 'Мастер' | 'Эксперт' | 'Гуру' | 'Активист';
  isOnline: boolean;
  joinedDaysAgo?: number;
  totalLikes?: number;
  badgeEmoji?: string;
}

interface CommunityMemberCardProps {
  member: CommunityMember;
  layout?: 'list' | 'grid';
  onUserProfile: (userId: string) => void;
  onMessage?: (userId: string) => void;
  index: number;
  superpowerName?: string;
}

export function CommunityMemberCard({
  member,
  layout = 'list',
  onUserProfile,
  onMessage,
  index,
  superpowerName
}: CommunityMemberCardProps) {
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Новичок': return 'from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30';
      case 'Любитель': return 'from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30';
      case 'Про': return 'from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/30';
      case 'Мастер': return 'from-orange-500/20 to-orange-600/20 text-orange-300 border-orange-500/30';
      case 'Эксперт': return 'from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/30';
      case 'Гуру': return 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30';
      case 'Активист': return 'from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  const getBadgeIcon = (level: string) => {
    switch (level) {
      case 'Эксперт': return <Crown size={10} className="text-amber-400" />;
      case 'Мастер': return <Star size={10} className="text-orange-400" />;
      case 'Гуру': return <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" />;
      case 'Активист': return <Zap size={10} className="text-violet-400" />;
      default: return null;
    }
  };

  // Грид режим - компактные карточки в сетке
  if (layout === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={() => onUserProfile(member.id)}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer group hover:bg-white/10 transition-all duration-300"
      >
        {/* Аватар с онлайн статусом */}
        <div className="relative mb-3 mx-auto w-fit">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          {member.isOnline && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-black rounded-full" />
          )}
          {member.badgeEmoji && (
            <div className="absolute -bottom-1 -right-1 text-lg">
              {member.badgeEmoji}
            </div>
          )}
        </div>

        {/* Имя */}
        <h4 className="text-white font-medium text-center mb-2 text-sm line-clamp-1">
          {member.name}
        </h4>

        {/* Уровень */}
        <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getLevelColor(member.level)} border flex items-center justify-center gap-1 mb-2`}>
          {getBadgeIcon(member.level)}
          <span>{member.level}</span>
        </div>

        {/* Статистика */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Zap size={10} className="text-amber-400" />
            <span className="text-white/70 text-xs">{member.bliks}</span>
          </div>
          
          {member.totalLikes && (
            <div className="flex items-center justify-center gap-1">
              <Heart size={10} className="text-red-400" />
              <span className="text-white/70 text-xs">{member.totalLikes}</span>
            </div>
          )}
        </div>

        {/* Hover эффект */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    );
  }

  // Список режим - горизонтальные карточки
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        {/* Аватар с онлайн статусом */}
        <div className="relative flex-shrink-0">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-xl object-cover cursor-pointer"
            onClick={() => onUserProfile(member.id)}
          />
          {member.isOnline && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-black rounded-full" />
          )}
          {member.badgeEmoji && (
            <div className="absolute -bottom-1 -right-1 text-sm">
              {member.badgeEmoji}
            </div>
          )}
        </div>
        
        {/* Информация */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-white font-medium cursor-pointer hover:text-purple-300 transition-colors"
              onClick={() => onUserProfile(member.id)}
            >
              {member.name}
            </span>
            <div className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getLevelColor(member.level)} border flex items-center gap-1`}>
              {getBadgeIcon(member.level)}
              <span>{member.level}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span className="text-white/60">{member.bliks} бликов</span>
            </div>
            
            {member.totalLikes && (
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-red-400" />
                <span className="text-white/60">{member.totalLikes}</span>
              </div>
            )}
            
            {member.joinedDaysAgo !== undefined && (
              <span className="text-white/50 text-xs">
                {member.joinedDaysAgo === 0 ? 'Сегодня' : `${member.joinedDaysAgo}д назад`}
              </span>
            )}
          </div>
        </div>
        
        {/* Действия */}
        <div className="flex items-center gap-2">
          {onMessage && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMessage(member.id)}
              className="p-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
            >
              <MessageCircle size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}