import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Briefcase, Sparkles, Zap, TrendingUp, Flame, Award, Bell, Search } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { CompactSuperpowerCard } from './CompactSuperpowerCard';
import { BlikCard, BlikData } from './BlikCard';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

interface TopScreenProps {
  // Топ люди
  topPeople: Array<{
    id: string;
    name: string;
    avatar: string;
    status: string;
    isOnline: boolean;
    metrics: {
      bliks: number;
      friends: number;
      superpowers: number;
    };
    trendScore: number;
  }>;
  
  // Топ бизнесы
  topBusinesses: Array<{
    id: string;
    name: string;
    avatar: string;
    industry: string;
    verified: boolean;
    metrics: {
      bliks: number;
      followers: number;
    };
    trendScore: number;
  }>;
  
  // Топ блики
  topBliks: BlikData[];
  
  // Топ суперсилы
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    bliks: number;
    energy: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
    growthRate: number;
  }>;
  
  // Обработчики
  onUserProfile: (userId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onSuperpowerDetail: (superpowerName: string) => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShare: (blikId: string) => void;
  onSidebar: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  unreadNotificationsCount?: number;
}

type TopCategory = 'people' | 'friends' | 'business' | 'bliks' | 'superpowers';
type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export function TopScreen({
  topPeople,
  topBusinesses,
  topBliks,
  topSuperpowers,
  onUserProfile,
  onBlikDetail,
  onSuperpowerDetail,
  onLike,
  onComment,
  onShare,
  onSidebar,
  onSearch,
  onNotifications,
  unreadNotificationsCount = 0
}: TopScreenProps) {
  const [activeCategory, setActiveCategory] = useState<TopCategory>('people');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('week');

  // Категории (вкладки навбара)
  const categories = [
    { value: 'people' as const, label: 'Люди', icon: Users },
    { value: 'friends' as const, label: 'Друзья', icon: UserPlus },
    { value: 'business' as const, label: 'Бизнес', icon: Briefcase },
    { value: 'bliks' as const, label: 'Блики', icon: Sparkles },
    { value: 'superpowers' as const, label: 'Суперсилы', icon: Zap }
  ];

  // Фильтры периода
  const periodFilters = [
    { value: 'today' as const, label: 'Сегодня', icon: Flame },
    { value: 'week' as const, label: 'Неделя', icon: TrendingUp },
    { value: 'month' as const, label: 'Месяц', icon: Award },
    { value: 'all' as const, label: 'Все время', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* БЛОК 1: Статус-бар (ТОЧНАЯ КОПИЯ ИЗ FEEDSCREEN) */}
      <div className="relative z-10">
        <StatusBar />
      </div>

      {/* БЛОК 2: Навигационная панель с логотипом (ТОЧНАЯ КОПИЯ ИЗ FEEDSCREEN) */}
      <div className="relative z-10">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Логотип Bliq слева */}
          <div className="flex-shrink-0 max-w-[140px]">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="
                relative group
                px-1 py-2 rounded-xl
                hover:bg-white/5
                transition-all duration-300
                cursor-pointer
                -ml-1
                max-w-[120px]
                h-12
                flex items-center
              "
              style={{ maxWidth: '120px', maxHeight: '48px' }}
            >
              <img 
                src={bliqLogo} 
                alt="Bliq"
                className="h-8 w-auto max-w-[120px] object-contain relative z-10"
                style={{ 
                  maxHeight: '32px',
                  maxWidth: '120px',
                  height: '32px',
                  width: 'auto'
                }}
              />
            </button>
          </div>

          {/* Правые кнопки */}  
          <div className="flex items-center gap-2">
            {/* Кнопка поиска */}
            <button
              onClick={onSearch}
              className="
                text-white/80 hover:text-white hover:bg-white/10
                p-2 rounded-xl
                backdrop-blur-xl
                transition-all duration-300
                group
                relative
              "
            >
              <Search size={22} className="relative z-10" />
            </button>

            {/* Кнопка уведомлений */}
            <button
              onClick={onNotifications}
              className="
                text-white/80 hover:text-white hover:bg-white/10
                p-2 rounded-xl
                backdrop-blur-xl
                transition-all duration-300
                group
                relative
              "
            >
              <Bell size={22} className="relative z-10" />
              
              {/* Уведомление badge */}
              {unreadNotificationsCount > 0 && (
                <div className="bliq-nav-badge absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-xs font-bold leading-none">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                </div>
              )}
            </button>

            {/* Аватар пользователя справа - доступ к профилю/сайдбару */}
            <button
              onClick={onSidebar}
              className="
                relative group
                p-1 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
              "
            >
              <ProfileAvatar
                image={avatarImage}
                isOnline={true}
                size="small"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Прокручиваемый контент */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-24 max-w-7xl mx-auto">
          {/* Навбар категорий - ПРОЗРАЧНЫЙ БЕЗ ФОНА */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-2"
          >
            <div className="pb-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(category.value)}
                      className={`
                        flex-shrink-0 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                        transition-all duration-300
                        group relative whitespace-nowrap
                        ${activeCategory === category.value
                          ? 'bliq-primary-button text-white'
                          : 'bliq-decline-button'
                        }
                      `}
                    >
                      {/* Glow effect на hover */}
                      {activeCategory !== category.value && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      
                      <Icon size={18} className="relative z-10" />
                      <span className="relative z-10 font-medium">{category.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Фильтры периода */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {periodFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPeriodFilter(filter.value)}
                    className={`
                      flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                      transition-all duration-300
                      ${periodFilter === filter.value
                        ? 'bliq-primary-button'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{filter.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Контент в зависимости от выбранной категории */}
          {activeCategory === 'people' && (
            <motion.div
              key="people"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {topPeople.slice(0, 10).map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onUserProfile(person.id)}
                    className="cursor-pointer"
                  >
                    <div className="glass-card rounded-xl p-3 hover:border-purple-500/50 transition-all relative">
                      {/* Ранг */}
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-bold text-xs shadow-lg border border-white/20">
                        {index + 1}
                      </div>
                      
                      {/* Аватар */}
                      <div className="relative mb-2">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-purple-500/30">
                          <img 
                            src={person.avatar} 
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {person.isOnline && (
                          <div className="absolute bottom-0 right-3 w-4 h-4 bg-green-500 rounded-full ring-2 ring-background" />
                        )}
                      </div>
                      
                      {/* Инфо */}
                      <h3 className="text-foreground font-medium text-center text-sm mb-1 line-clamp-1">
                        {person.name}
                      </h3>
                      <p className="text-muted-foreground text-xs text-center line-clamp-1 mb-2">
                        {person.status}
                      </p>
                      
                      {/* Метрики */}
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Sparkles size={12} className="text-yellow-400" />
                          <span className="text-foreground font-medium">{person.metrics.bliks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-blue-400" />
                          <span className="text-foreground font-medium">{person.metrics.friends}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeCategory === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-xl p-6 text-center">
                <UserPlus size={48} className="mx-auto mb-4 text-purple-400" />
                <h3 className="text-foreground font-semibold mb-2">Скоро здесь</h3>
                <p className="text-muted-foreground text-sm">
                  Топ друзей появится в следующих обновлениях
                </p>
              </div>
            </motion.div>
          )}

          {activeCategory === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {topBusinesses.slice(0, 8).map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onUserProfile(business.id)}
                    className="cursor-pointer"
                  >
                    <div className="glass-card rounded-xl p-4 hover:border-pink-500/50 transition-all relative">
                      {/* Ранг */}
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-bold text-xs shadow-lg border border-white/20">
                        {index + 1}
                      </div>
                      
                      {/* Логотип */}
                      <div className="relative mb-3">
                        <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden ring-2 ring-pink-500/30 bg-white">
                          <img 
                            src={business.avatar} 
                            alt={business.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Инфо */}
                      <h3 className="text-foreground font-medium text-center text-sm mb-1 line-clamp-1">
                        {business.name}
                      </h3>
                      <p className="text-muted-foreground text-xs text-center line-clamp-1 mb-3">
                        {business.industry}
                      </p>
                      
                      {/* Метрики */}
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Sparkles size={12} className="text-yellow-400" />
                          <span className="text-foreground font-medium">{business.metrics.bliks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-blue-400" />
                          <span className="text-foreground font-medium">{business.metrics.followers}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeCategory === 'bliks' && (
            <motion.div
              key="bliks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bliks-grid">
                {topBliks.slice(0, 9).map((blik, index) => (
                  <motion.div
                    key={blik.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BlikCard
                      blik={blik}
                      onLike={onLike}
                      onComment={onComment}
                      onShare={onShare}
                      onDetail={onBlikDetail}
                      onUserProfile={onUserProfile}
                      showRank={true}
                      rank={index + 1}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeCategory === 'superpowers' && (
            <motion.div
              key="superpowers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="superpowers-grid">
                {topSuperpowers.slice(0, 12).map((superpower, index) => (
                  <motion.div
                    key={`${superpower.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CompactSuperpowerCard
                      name={superpower.name}
                      emoji={superpower.emoji}
                      value={superpower.bliks}
                      index={index}
                      trend={superpower.trend}
                      onClick={() => onSuperpowerDetail(superpower.name)}
                      mode="library"
                      showRank={true}
                      rank={index + 1}
                      growthRate={superpower.growthRate}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
