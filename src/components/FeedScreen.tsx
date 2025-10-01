import React, { memo } from 'react';
import { Bell, Search } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { BlikCard, BlikData } from './BlikCard';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

interface PopularUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  recentBliks: number;
  hasNewContent?: boolean;
  profileType?: 'business' | 'personal';
}

interface BlikData {
  id: string;
  type: 'photo' | 'video' | 'text';
  content: string;
  mediaUrl?: string;
  author: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  recipient: {
    name: string;
    avatar: string;
  };
  superpower: {
    name: string;
    emoji: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface FeedScreenProps {
  popularUsers: PopularUser[];
  feedBliks: BlikData[];
  backgroundImage?: string; // Пока оставим для совместимости
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShare: (blikId: string) => void;
  onUserProfile: (userId: string) => void;
  onSidebar?: () => void;
  onNotifications?: () => void;
  onSearch?: () => void;
  onBlikDetail?: (blikId: string) => void;
  onSuperpowerClick?: (superpowerName: string) => void; // Добавлен новый пропс
}

export function FeedScreen({
  popularUsers,
  feedBliks,
  backgroundImage, // Игнорируем, используется AppBackground
  onLike,
  onComment,
  onShare,
  onUserProfile,
  onSidebar,
  onNotifications,
  onSearch,
  onBlikDetail,
  onSuperpowerClick
}: FeedScreenProps) {
  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        width: '100vw',
        maxWidth: '100vw', 
        overflowX: 'hidden',
        margin: 0,
        padding: 0
      }}
    >
      {/* БЛОК 1: Статус-бар */}
      <div className="relative z-10">
        <StatusBar />
      </div>

      {/* БЛОК 2: Навигационная панель с логотипом */}
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
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-slate-900" />
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
                ml-2
              "
            >
              {/* Аватар с градиентной рамкой */}
              <div className="relative z-10 p-0.5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                <div className="p-0.5 rounded-full bg-slate-900">
                  <ProfileAvatar 
                    image={avatarImage}
                    isOnline={true}
                    size="small"
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* БЛОК 3: Горизонтальный фид популярных пользователей (бликеров) */}
      <div className="relative z-10">
        <div className="px-4 pb-4">
          {/* Мобильная версия: горизонтальный скролл */}
          <div className="block md:hidden">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {popularUsers.map((user, index) => (
                <PopularUserCard
                  key={user.id}
                  user={user}
                  onUserProfile={onUserProfile}
                />
              ))}
            </div>
          </div>
          
          {/* Планшетная/компьютерная версия: горизонтальный ряд популярных пользователей */}
          <div className="hidden md:block max-w-7xl mx-auto">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {popularUsers.map((user, index) => (
                <PopularUserCard
                  key={user.id}
                  user={user}
                  onUserProfile={onUserProfile}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Разделитель между популярными пользователями и лентой */}
        <div className="border-b mx-4 border-white/5"></div>
      </div>

      {/* БЛОК 4: Лента бликов - адаптивная сетка */}
      <div className="relative z-10 flex-1 pb-24">
        {feedBliks.length > 0 ? (
          <div className="px-3 pt-6 pb-4">
            {/* Мобильная версия: одна колонка как Instagram */}
            <div className="block md:hidden w-full max-w-lg mx-auto overflow-hidden">
              {feedBliks.map((blik, index) => (
                <div
                  key={blik.id}
                  className="w-full max-w-full cursor-pointer overflow-hidden"
                  onClick={() => onBlikDetail?.(blik.id)}
                >
                  <BlikCard
                    blik={blik}
                    layout="feed"
                    index={index}
                    onLike={onLike}
                    onComment={onComment}
                    onShare={onShare}
                    onUserProfile={onUserProfile}
                  />
                </div>
              ))}
            </div>
            
            {/* Планшетная/компьютерная версия: адаптивная сетка */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {feedBliks.map((blik, index) => (
                <div
                  key={blik.id}
                  className="w-full cursor-pointer"
                  onClick={() => onBlikDetail?.(blik.id)}
                >
                  <BlikCard
                    blik={blik}
                    layout="grid"
                    index={index}
                    onLike={onLike}
                    onComment={onComment}
                    onShare={onShare}
                    onUserProfile={onUserProfile}
                    onBlikDetail={onBlikDetail}
                    onSuperpowerClick={onSuperpowerClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Пустое состояние */
          <div className="flex-1 flex items-center justify-center py-16 px-4">
            <div className="text-center text-white/40">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl mb-2 text-white">
                Пока нет бликов
              </h3>
              <p className="text-sm max-w-sm mx-auto text-white/60">
                Здесь будут отображаться блики от ваших друзей и те, которые вы отправили другим
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Компонент карточки популярного пользователя
const PopularUserCard = memo(function PopularUserCard({ 
  user, 
  onUserProfile 
}: { 
  user: PopularUser; 
  onUserProfile: (userId: string) => void 
}) {
  const isBusiness = user.profileType === 'business';
  
  return (
    <div
      onClick={() => onUserProfile(user.id)}
      className="
        flex flex-col items-center gap-2 
        cursor-pointer
        p-2 rounded-xl
        hover:bg-white/5
        transition-all duration-300
        group
        relative
        min-w-[80px] flex-shrink-0
        md:min-w-[90px] lg:min-w-[100px]
      "
    >
      {/* Glow effect на hover - разные цвета для бизнеса */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isBusiness 
          ? 'bg-gradient-to-br from-orange-500/5 to-yellow-500/5'
          : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
      }`} />
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* Аватар с градиентной рамкой - оранжевый для бизнеса */}
        <div className={`p-0.5 ${isBusiness ? 'rounded-lg' : 'rounded-full'} ${
          user.hasNewContent 
            ? isBusiness
              ? 'bg-gradient-to-br from-orange-400 via-yellow-500 to-orange-600'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
            : 'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          <div className={`p-0.5 ${isBusiness ? 'rounded-lg' : 'rounded-full'} bg-slate-900`}>
            <ProfileAvatar 
              image={user.avatar} 
              isOnline={user.isOnline}
              size="medium"
              className={isBusiness ? 'rounded-lg' : 'rounded-full'}
            />
          </div>
        </div>
        
        {/* Имя */}
        <div className="text-xs text-center min-w-[60px] max-w-[80px] text-white">
          <div className="truncate">
            {user.name.split(' ')[0]}
          </div>
          {/* Бизнес-бейдж */}
          {isBusiness && (
            <div className="w-3 h-3 bg-orange-500 rounded-sm mx-auto mt-1 flex items-center justify-center">
              <div className="text-white text-[8px]">🏢</div>
            </div>
          )}
        </div>

        {/* Количество новых бликов */}
        {user.hasNewContent && (
          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
            isBusiness
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            <span className="text-white text-xs font-medium">
              {user.recentBliks > 9 ? '9+' : user.recentBliks}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});