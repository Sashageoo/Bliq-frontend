import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, Star, Sparkles, Heart, SortAsc, Filter } from 'lucide-react';
import { CommunityMemberCard } from './CommunityMemberCard';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  bliks: number;
  level: 'Новичок' | 'Любитель' | 'Про' | 'Мастер' | 'Эксперт' | 'Гуру';
  isOnline: boolean;
  joinedDaysAgo: number;
  totalLikes?: number;
  badgeEmoji?: string;
}

interface CommunityWidgetProps {
  communityStats: {
    members: number;
    activeToday: number;
    totalBliks: number;
    weeklyGrowth: number;
  };
  members: CommunityMember[];
  communityViewMode: 'list' | 'grid';
  communitySortBy: 'rating' | 'recent' | 'activity';
  communityFilter: 'all' | 'online' | 'experts';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onSortByChange: (sortBy: 'rating' | 'recent' | 'activity') => void;
  onFilterChange: (filter: 'all' | 'online' | 'experts') => void;
  onUserProfile: (userId: string) => void;
}

export function CommunityWidget({
  communityStats,
  members,
  communityViewMode,
  communitySortBy,
  communityFilter,
  onViewModeChange,
  onSortByChange,
  onFilterChange,
  onUserProfile
}: CommunityWidgetProps) {
  const topContributors = members.slice(0, 3).sort((a, b) => b.bliks - a.bliks);
  const recentMembers = members.filter(member => member.joinedDaysAgo <= 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Статистика сообщества */}
      <div className="relative group">
        {/* Неоновый контур */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-2xl blur-sm opacity-60" />
        
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-2xl p-4">
          {/* Заголовок */}
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-purple-400" />
            <h3 className="text-white font-bold">Сообщество</h3>
          </div>

          {/* Статистика в сетке */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-3 text-center">
              <div className="text-white font-bold text-lg">{communityStats.members.toLocaleString()}</div>
              <div className="text-purple-200/80 text-xs">Участники</div>
            </div>
            
            <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl p-3 text-center">
              <div className="text-white font-bold text-lg">{communityStats.activeToday}</div>
              <div className="text-emerald-200/80 text-xs">Онлайн</div>
            </div>
            
            <div className="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30 rounded-xl p-3 text-center">
              <div className="text-white font-bold text-lg">{communityStats.totalBliks.toLocaleString()}</div>
              <div className="text-amber-200/80 text-xs">Блики</div>
            </div>
            
            <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-3 text-center">
              <div className="text-white font-bold text-lg">+{communityStats.weeklyGrowth}%</div>
              <div className="text-cyan-200/80 text-xs">Рост</div>
            </div>
          </div>
        </div>
      </div>

      {/* Топ участники */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-2xl blur-sm opacity-60" />
        
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={18} className="text-amber-400" />
            <h3 className="text-white font-bold">Топ участники</h3>
          </div>

          <div className="space-y-2">
            {topContributors.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                onClick={() => onUserProfile(member.id)}
              >
                {/* Позиция */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                  'bg-gradient-to-r from-orange-600 to-orange-500 text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Аватар */}
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full" />
                  )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-sm font-medium truncate">{member.name}</span>
                    {member.badgeEmoji && (
                      <span className="text-xs">{member.badgeEmoji}</span>
                    )}
                  </div>
                  <div className="text-white/60 text-xs">{member.bliks} бликов</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Новые участники */}
      {recentMembers.length > 0 && (
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-2xl blur-sm opacity-60" />
          
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-emerald-400" />
              <h3 className="text-white font-bold">Новые участники</h3>
            </div>

            <div className="space-y-2">
              {recentMembers.slice(0, 3).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={() => onUserProfile(member.id)}
                >
                  {/* Аватар */}
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full" />
                    )}
                  </div>

                  {/* Информация */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm font-medium truncate">{member.name}</span>
                      {member.badgeEmoji && (
                        <span className="text-xs">{member.badgeEmoji}</span>
                      )}
                    </div>
                    <div className="text-emerald-400 text-xs">
                      {member.joinedDaysAgo === 0 ? 'Сегодня' : '1 день назад'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}