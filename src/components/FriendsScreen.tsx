import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, UserPlus, MessageCircle, Users, UserCheck, Crown, List, Grid3X3, Zap, Battery, Scale } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  mutualFriends: number;
  metrics: {
    bliks: number;
    friends: number;
    superpowers: number;
  };
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
  isClose?: boolean; // Близкий друг
  lastActivity: string;
  activityScore: number; // Общий показатель активности
}

interface FriendsScreenProps {
  friends: Friend[];
  onBack: () => void;
  onUserProfile: (userId: string) => void;
  onAddFriend?: () => void;
  onSearch?: () => void;
}

export function FriendsScreen({
  friends,
  onBack,
  onUserProfile,
  onAddFriend,
  onSearch
}: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'close' | 'active' | 'bliks' | 'superpowers'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем и сортируем друзей по вкладкам
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'online':
        return matchesSearch && friend.isOnline;
      case 'close':
        return matchesSearch && friend.isClose;
      case 'active':
        return matchesSearch && friend.activityScore > 50;
      case 'bliks':
        return matchesSearch && friend.metrics.bliks > 100;
      case 'superpowers':
        return matchesSearch && friend.metrics.superpowers > 5;
      default:
        return matchesSearch;
    }
  });

  // Сортируем в зависимости от активной вкладки
  const sortedFriends = filteredFriends.sort((a, b) => {
    switch (activeTab) {
      case 'bliks':
        return b.metrics.bliks - a.metrics.bliks; // По убыванию бликов
      case 'superpowers':
        return b.metrics.superpowers - a.metrics.superpowers; // По убыванию суперсил
      case 'active':
        return b.activityScore - a.activityScore; // По убыванию активности
      default:
        // Стандартная сортировка: онлайн сначала, затем близкие друзья, потом по алфавиту
        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }
        if (a.isClose !== b.isClose) {
          return a.isClose ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    }
  });

  const onlineFriendsCount = friends.filter(f => f.isOnline).length;
  const closeFriendsCount = friends.filter(f => f.isClose).length;
  const activeFriendsCount = friends.filter(f => f.activityScore > 50).length;
  const topBlikersCount = friends.filter(f => f.metrics.bliks > 100).length;
  const talentedFriendsCount = friends.filter(f => f.metrics.superpowers > 5).length;

  return (
    <div className="min-h-screen relative">
      {/* Контент */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Статус-бар */}
        <StatusBar />

        {/* Заголовок */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="text-white p-2 -ml-2"
            >
              <ArrowLeft size={24} />
            </motion.button>
            
            <div>
              <h1 className="text-white text-xl">
                Друзья
              </h1>
              <p className="text-white/60 text-sm">
                {friends.length} {friends.length === 1 ? 'друг' : friends.length < 5 ? 'друга' : 'друзей'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Переключатель вида */}
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${viewMode === 'list' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/60 hover:text-white/80'
                  }
                `}
              >
                <List size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('gallery')}
                className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${viewMode === 'gallery' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/60 hover:text-white/80'
                  }
                `}
              >
                <Grid3X3 size={16} />
              </motion.button>
            </div>

            {/* Поиск */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSearch}
              className="
                text-white/80 hover:text-white 
                p-2 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
              "
            >
              <Search size={20} />
            </motion.button>

            {/* Найти новых друзей */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Открываем глобальный поиск для поиска новых людей
                onSearch();
              }}
              className="
                text-white/80 hover:text-white 
                p-2 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
              "
              title="Найти новых друзей"
            >
              <UserPlus size={20} />
            </motion.button>
          </div>
        </div>

        {/* Поисковая строка */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск друзей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-xl
                border border-white/20
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500/50
                focus:border-white/30
                transition-all duration-300
              "
            />
          </div>
        </div>

        {/* Вкладки - прокручиваемые */}
        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton
              isActive={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              icon={<Users size={16} />}
              label="Все"
              count={friends.length}
            />
            <TabButton
              isActive={activeTab === 'online'}
              onClick={() => setActiveTab('online')}
              icon={<div className="w-2 h-2 bg-green-500 rounded-full" />}
              label="Онлайн"
              count={onlineFriendsCount}
            />
            <TabButton
              isActive={activeTab === 'close'}
              onClick={() => setActiveTab('close')}
              icon={<Crown size={16} />}
              label="Близкие"
              count={closeFriendsCount}
            />
            <TabButton
              isActive={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
              icon={<span className="text-orange-400">⚡</span>}
              label="Активные"
              count={activeFriendsCount}
            />
            <TabButton
              isActive={activeTab === 'bliks'}
              onClick={() => setActiveTab('bliks')}
              icon={<span className="text-purple-400">✨</span>}
              label="Топ блики"
              count={topBlikersCount}
            />
            <TabButton
              isActive={activeTab === 'superpowers'}
              onClick={() => setActiveTab('superpowers')}
              icon={<span className="text-cyan-400">🌟</span>}
              label="Таланты"
              count={talentedFriendsCount}
            />
          </div>
        </div>

        {/* Список друзей */}
        <div className="flex-1 px-4">
          {sortedFriends.length > 0 ? (
            viewMode === 'list' ? (
              /* Список - детальный вид */
              <div className="
                grid gap-3 pb-20 
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-3
                max-w-7xl mx-auto
              ">
                {sortedFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <FriendCard
                      friend={friend}
                      onUserProfile={onUserProfile}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Галерея - компактный вид */
              <div className="
                grid gap-3 pb-20 
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                2xl:grid-cols-7
                max-w-7xl mx-auto
              ">
                {sortedFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <FriendGalleryCard
                      friend={friend}
                      onUserProfile={onUserProfile}
                    />
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            /* Пустое состояние */
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-white text-xl mb-2">
                  {searchQuery ? 'Друзья не найдены' : getEmptyStateTitle(activeTab)}
                </h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto">
                  {searchQuery 
                    ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                    : getEmptyStateDescription(activeTab)
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Компонент кнопки вкладки
function TabButton({ 
  isActive, 
  onClick, 
  icon, 
  label, 
  count 
}: { 
  isActive: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl
        backdrop-blur-xl border transition-all duration-300
        ${isActive 
          ? 'bg-white/20 border-white/30 text-white' 
          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <span className={`
        text-xs px-1.5 py-0.5 rounded-full
        ${isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-white/10 text-white/60'
        }
      `}>
        {count}
      </span>
    </motion.button>
  );
}

// Компонент карточки друга
function FriendCard({ 
  friend, 
  onUserProfile
}: { 
  friend: Friend; 
  onUserProfile: (userId: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="
        relative p-4 rounded-xl h-full
        backdrop-blur-xl bg-white/10
        border border-white/20
        hover:bg-white/15 hover:border-white/30
        transition-all duration-300
        cursor-pointer flex flex-col
      "
      onClick={() => onUserProfile(friend.id)}
    >
      {/* Индикатор близкого друга */}
      {friend.isClose && (
        <div className="absolute top-3 right-3">
          <Crown size={14} className="text-yellow-400" />
        </div>
      )}

      <div className="flex items-start gap-3 flex-1">
        {/* Аватар */}
        <div className="flex-shrink-0">
          <ProfileAvatar 
            image={friend.avatar}
            isOnline={friend.isOnline}
            size="medium"
          />
        </div>

        {/* Информация */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-medium truncate">
              {friend.name}
            </h3>
            <span className="text-white/50 text-xs ml-2 flex-shrink-0">
              {friend.lastActivity}
            </span>
          </div>

          <p className="text-white/70 text-sm mb-2 truncate">
            {friend.status}
          </p>

          {/* Взаимные друзья */}
          {friend.mutualFriends > 0 && (
            <p className="text-white/50 text-xs mb-3">
              {friend.mutualFriends} {friend.mutualFriends === 1 ? 'общий друг' : 'общих друзей'}
            </p>
          )}

          {/* Топ суперсилы - компактные на больших экранах */}
          {friend.topSuperpowers.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {friend.topSuperpowers.slice(0, 2).map((superpower, index) => (
                <div
                  key={superpower.name}
                  className="
                    flex items-center gap-1 px-2 py-1 rounded-full
                    bg-white/10 border border-white/20
                    text-xs text-white/80
                  "
                >
                  <span>{superpower.emoji}</span>
                  <span className="truncate max-w-[50px] md:max-w-[70px]">{superpower.name}</span>
                </div>
              ))}
              {friend.topSuperpowers.length > 2 && (
                <div className="
                  flex items-center justify-center px-2 py-1 rounded-full
                  bg-white/5 border border-white/10
                  text-xs text-white/60
                ">
                  +{friend.topSuperpowers.length - 2}
                </div>
              )}
            </div>
          )}

          {/* Ключевые метрики - Энергия, Сила, Баланс */}
          <div className="mt-auto pt-3 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex flex-col items-center p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <Battery size={16} className="text-emerald-400" />
                </div>
                <span className="text-white font-bold text-sm">{friend.activityScore}</span>
                <span className="text-white/60 text-xs">Энергия</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <Zap size={16} className="text-purple-400" />
                </div>
                <span className="text-white font-bold text-sm">{Math.round(friend.topSuperpowers.reduce((sum, sp) => sum + sp.value, 0) / Math.max(friend.topSuperpowers.length, 1))}</span>
                <span className="text-white/60 text-xs">Сила</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-amber-500/20 border border-amber-400/30">
                <div className="flex items-center gap-1 mb-1">
                  <Scale size={16} className="text-amber-400" />
                </div>
                <span className="text-white font-bold text-sm">{Math.round((friend.activityScore + friend.topSuperpowers.reduce((sum, sp) => sum + sp.value, 0) / Math.max(friend.topSuperpowers.length, 1)) / 2)}</span>
                <span className="text-white/60 text-xs">Баланс</span>
              </div>
            </div>
            
            {/* Индикатор активности - более заметный */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70 font-medium">Активность</span>
                <span className="text-sm text-white font-bold">{friend.activityScore}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    friend.activityScore >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/30' :
                    friend.activityScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/30' :
                    friend.activityScore >= 40 ? 'bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-400/30' :
                    'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                  }`}
                  style={{ width: `${friend.activityScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Утилиты для пустых состояний
function getEmptyStateTitle(tab: 'all' | 'online' | 'close' | 'active' | 'bliks' | 'superpowers'): string {
  switch (tab) {
    case 'online':
      return 'Нет друзей онлайн';
    case 'close':
      return 'Нет близких друзей';
    case 'active':
      return 'Нет активных друзей';
    case 'bliks':
      return 'Нет топ-бликеров';
    case 'superpowers':
      return 'Нет талантливых друзей';
    default:
      return 'Пока нет друзей';
  }
}

function getEmptyStateDescription(tab: 'all' | 'online' | 'close' | 'active' | 'bliks' | 'superpowers'): string {
  switch (tab) {
    case 'online':
      return 'Ваши друзья сейчас не в сети. Попробуйте зайти позже.';
    case 'close':
      return 'Отметьте особенных друзей как близких для быстрого доступа.';
    case 'active':
      return 'Нет друзей с высокой активностью (>50%). Активность зависит от частоты получения и отправки бликов.';
    case 'bliks':  
      return 'Нет друзей с большим количеством бликов (>100). Это самые популярные пользователи среди ваших друзей.';
    case 'superpowers':
      return 'Нет друзей с множеством суперсил (>5). Это талантливые люди, развившие много разных навыков.';
    default:
      return 'Найдите интересных людей и добавьте их в друзья через поиск или рекомендации.';
  }
}

// Компонент галерейной карточки друга - компактный вид
function FriendGalleryCard({ 
  friend, 
  onUserProfile
}: { 
  friend: Friend; 
  onUserProfile: (userId: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        relative p-3 rounded-xl
        backdrop-blur-xl bg-white/10
        border border-white/20
        hover:bg-white/15 hover:border-white/30
        transition-all duration-300
        cursor-pointer
        flex flex-col items-center
        aspect-square
      "
      onClick={() => onUserProfile(friend.id)}
    >
      {/* Индикатор близкого друга */}
      {friend.isClose && (
        <div className="absolute top-2 right-2 z-10">
          <Crown size={12} className="text-yellow-400" />
        </div>
      )}

      {/* Аватар */}
      <div className="mb-2">
        <ProfileAvatar 
          image={friend.avatar}
          isOnline={friend.isOnline}
          size="medium"
        />
      </div>

      {/* Имя */}
      <h3 className="text-white font-medium text-sm text-center mb-1 truncate w-full px-1">
        {friend.name}
      </h3>

      {/* Топ суперсила */}
      {friend.topSuperpowers.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-base">{friend.topSuperpowers[0].emoji}</span>
          <span className="text-xs text-white/70 truncate max-w-[60px]">
            {friend.topSuperpowers[0].name}
          </span>
        </div>
      )}

      {/* Метрики - компактные */}
      <div className="mt-auto w-full">
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="flex flex-col items-center p-1 rounded bg-purple-500/20">
            <span className="text-purple-400 text-xs">✨</span>
            <span className="text-white font-bold text-xs">{friend.metrics.bliks}</span>
          </div>
          <div className="flex flex-col items-center p-1 rounded bg-cyan-500/20">
            <span className="text-cyan-400 text-xs">👥</span>
            <span className="text-white font-bold text-xs">{friend.metrics.friends}</span>
          </div>
          <div className="flex flex-col items-center p-1 rounded bg-orange-500/20">
            <span className="text-orange-400 text-xs">🔥</span>
            <span className="text-white font-bold text-xs">{friend.metrics.superpowers}</span>
          </div>
        </div>
        
        {/* Индикатор активности - минималистичный */}
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              friend.activityScore >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              friend.activityScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              friend.activityScore >= 40 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${friend.activityScore}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}