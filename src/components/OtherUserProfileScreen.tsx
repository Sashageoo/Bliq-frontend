import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Share, MoreHorizontal, Heart, MessageSquare, Share2, MapPin, ChevronDown, ChevronUp, Flag, Ban, Shield, Camera, UserPlus, Bell, Globe, Search, Menu } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { BlikCard } from './BlikCard';
import { CompactSuperpowerCard } from './CompactSuperpowerCard';
import { ProfileAvatar } from './ProfileAvatar';
import { CompactMetricCard } from './CompactMetricCard';

interface OtherUser {
  id: string;
  name: string;
  status: string;
  location: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  isOnline: boolean;
  profileType?: 'personal' | 'business';
  businessInfo?: {
    companyName: string;
    industry: string;
    founded: string;
    employees: string;
    revenue: string;
    description: string;
    website?: string;
    phone?: string;
    email?: string;
    verified: boolean;
    verificationDate: string | null;
    verificationDocuments: any[];
  };
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
  isLiked: boolean;
  likedBy?: Array<{
    name: string;
    avatar: string;
  }>;
  commentsList?: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }>;
}

interface OtherUserProfileScreenProps {
  user: OtherUser;
  userBliks: BlikData[];
  onBack: () => void;
  onChat: () => void;
  onAddFriend: () => void;
  onSubscribe: () => void;
  onShare: () => void;
  onSuperpowerClick: (superpowerName: string) => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShareBlik: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onUserProfile: (userId: string) => void;
  onViewFriends?: () => void;
  onViewSuperpowersMap?: () => void;
  onCreateBlik?: () => void;
  onViewPersonalSite?: () => void;
  onSidebar?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
}

export function OtherUserProfileScreen({
  user,
  userBliks,
  onBack,
  onChat,
  onAddFriend,
  onSubscribe,
  onSidebar,
  onSearch,
  onNotifications,
  onShare,
  onSuperpowerClick,
  onLike,
  onComment,
  onShareBlik,
  onBlikDetail,
  onUserProfile,
  onViewFriends,
  onViewSuperpowersMap,
  onCreateBlik,
  onViewPersonalSite
}: OtherUserProfileScreenProps) {

  const [isTopSuperpowersExpanded, setIsTopSuperpowersExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  const [activeBliksTab, setActiveBliksTab] = useState<'receives' | 'gives'>('receives');
  const bliksRef = useRef<HTMLDivElement>(null);

  // Отслеживаем изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);



  // Разделяем блики на категории
  const receivedBliks = userBliks.filter(blik => blik.recipient.name === user.name);
  const sentBliks = userBliks.filter(blik => blik.author.name === user.name);
  
  // Все блики для счетчика и превью
  const allUserBliks = [...receivedBliks, ...sentBliks];
  
  // Активные блики в зависимости от выбранного таба
  const activeTabBliks = activeBliksTab === 'receives' ? receivedBliks : sentBliks;

  // Определяем количество отображаемых суперсил (адаптивно)
  const getInitialSuperpowersCount = () => {
    if (windowWidth >= 1280) {
      return Math.min(10, user.topSuperpowers.length);
    } else if (windowWidth >= 1024) {
      return Math.min(8, user.topSuperpowers.length);
    } else if (windowWidth >= 768) {
      return Math.min(6, user.topSuperpowers.length);
    }
    return 3;
  };

  const initialCount = getInitialSuperpowersCount();
  const displayedSuperpowers = isTopSuperpowersExpanded 
    ? user.topSuperpowers 
    : user.topSuperpowers.slice(0, initialCount);



  // Функция прокрутки к секции бликов
  const scrollToBliks = () => {
    if (bliksRef.current) {
      bliksRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Контент с прокруткой */}
      <div className="relative z-10 flex flex-col">
        {/* Статус бар */}
        <StatusBar />

        {/* Заголовок с кнопкой назад и правыми кнопками */}
        <div className="flex items-center justify-between px-6 py-2 mt-2">
          {/* Кнопка назад слева */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 -ml-2 text-foreground"
          >
            <ArrowLeft size={24} />
          </motion.button>

          {/* Правые кнопки */}
          <div className="flex items-center gap-2">
            {/* Кнопка поиска */}
            {onSearch && (
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
            )}

            {/* Кнопка уведомлений */}
            {onNotifications && (
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
            )}

            {/* Кнопка сайдбара */}
            {onSidebar && (
              <button
                onClick={onSidebar}
                className="
                  text-white/80 hover:text-white hover:bg-white/10
                  p-2 rounded-xl
                  backdrop-blur-xl
                  transition-all duration-300
                  group
                  relative
                "
              >
                <Menu size={22} className="relative z-10" />
              </button>
            )}
          </div>
        </div>

        {/* Прокручиваемый контент профиля */}
        <div className="pb-20">
          <div className="px-6 pt-2 centered-content">
            {/* Основная информация профиля */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4 mb-4"
            >
              <ProfileAvatar 
                image={user.avatar} 
                isOnline={user.isOnline}
                size="large"
              />
              
              <div className="flex-1">
                <h1 className="font-bold text-2xl text-foreground mb-1">
                  {user.name}
                </h1>
                <p className="text-base text-foreground/80 mb-2">{user.status}</p>
                {/* Регион под статусом */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-blue-400" />
                  <span>{user.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Краткая биография с ссылкой "Подробнее" */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio.length > 120 ? (
                  <>
                    {user.bio.substring(0, 120)}...{' '}
                    <button 
                      onClick={() => {
                        if (onViewPersonalSite) {
                          onViewPersonalSite();
                        } else {
                          console.log('Переход на персональный сайт:', user.name);
                        }
                      }}
                      className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                    >
                      Подробнее
                    </button>
                  </>
                ) : (
                  <>
                    {user.bio}{' '}
                    <button 
                      onClick={() => {
                        if (onViewPersonalSite) {
                          onViewPersonalSite();
                        } else {
                          console.log('Переход на персональный сайт:', user.name);
                        }
                      }}
                      className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                    >
                      Подробнее
                    </button>
                  </>
                )}
              </p>
            </motion.div>

            {/* Метрики */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <CompactMetricCard 
                value={user.metrics.bliks} 
                label="Блики" 
                index={0}
                onClick={scrollToBliks}
              />
              <CompactMetricCard 
                value={user.metrics.friends} 
                label="Друзья" 
                index={1}
                onClick={onViewFriends || (() => {})}
              />
              <CompactMetricCard 
                value={user.metrics.superpowers} 
                label="Суперсилы" 
                index={2}
                onClick={onViewSuperpowersMap || (() => {})}
              />
            </motion.div>

            {/* Топ суперсилы */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              {/* Контейнер для центрирования сетки и выравнивания заголовка */}
              <div className="max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl">
                {/* Заголовок с кнопкой раскрытия - выровнен по левому краю сетки */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-foreground">
                    🔥 Топ суперсилы
                  </h2>
                  
                  {/* Кнопка раскрытия (показывается только если есть больше суперсил, чем отображается изначально) */}
                  {user.topSuperpowers.length > initialCount && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsTopSuperpowersExpanded(!isTopSuperpowersExpanded)}
                      className="
                        flex items-center gap-1
                        text-sm transition-all duration-300
                        backdrop-blur-xl glass-card
                        rounded-full px-3 py-1.5
                        text-muted-foreground hover:text-foreground
                        hover:bg-accent
                      "
                    >
                      <span>
                        {isTopSuperpowersExpanded ? 'Свернуть' : `Показать все ${user.topSuperpowers.length}`}
                      </span>
                      {isTopSuperpowersExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </motion.button>
                  )}
                </div>
                
                {/* Сетка суперсил с анимацией - адаптивная сетка по колонкам */}
                <motion.div 
                  layout
                  className="grid gap-3 justify-items-center
                    grid-cols-3 
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                  "
                >
                  {displayedSuperpowers.map((superpower, index) => (
                    <motion.div
                      key={superpower.name}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        layout: { duration: 0.3 }
                      }}
                    >
                      <CompactSuperpowerCard
                        name={superpower.name}
                        emoji={superpower.emoji}
                        value={superpower.value}
                        energy={superpower.energy}
                        trend={superpower.energy > 80 ? 'up' : superpower.energy < 40 ? 'down' : 'stable'}
                        index={index}
                        ownerName={user.name}
                        ownerAvatar={user.avatar}
                        isOwn={true}
                        onClick={() => onSuperpowerClick?.(superpower.name)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Элегантные 3D кнопки действий */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center gap-4 mb-8 flex-wrap"
            >
              <CircularActionButton
                icon={<Camera size={20} />}
                label="Бликнуть"
                onClick={onCreateBlik || (() => {})}
                variant="create"
              />
              <CircularActionButton
                icon={<UserPlus size={20} />}
                label="Добавить в друзья"
                onClick={onAddFriend}
                variant="friend"
              />
              <CircularActionButton
                icon={<Bell size={20} />}
                label="Подписаться"
                onClick={onSubscribe}
                variant="subscribe"
              />
              {onViewPersonalSite && (
                <CircularActionButton
                  icon={<Globe size={20} />}
                  label="Персональный сайт"
                  onClick={onViewPersonalSite}
                  variant="success"
                />
              )}
              <CircularActionButton
                icon={<Share size={20} />}
                label="Поделиться"
                onClick={onShare}
                variant="share"
              />
            </motion.div>

            {/* Полная секция бликов с табами */}
            {allUserBliks.length > 0 && (
              <motion.div
                ref={bliksRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 mb-8"
              >
                <div className="max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl">
                  {/* Заголовок и фильтры */}
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    ✨ Блики
                  </h3>
                  
                  {/* Табы для переключения типов бликов в едином стиле */}
                  <div className="backdrop-blur-xl glass-card rounded-2xl p-1 mb-6">
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveBliksTab('receives')}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300
                          ${activeBliksTab === 'receives'
                            ? 'backdrop-blur-xl bg-accent text-foreground shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                      >
                        <span>📩 {user.profileType === 'business' ? 'От клиентов' : 'От друзей'}</span>
                        <span className="text-xs opacity-70">({receivedBliks.length})</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveBliksTab('gives')}
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300
                          ${activeBliksTab === 'gives'
                            ? 'backdrop-blur-xl bg-accent text-foreground shadow-lg'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                      >
                        <span>📤 {user.profileType === 'business' ? 'Клиентам' : 'Друзьям'}</span>
                        <span className="text-xs opacity-70">({sentBliks.length})</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Адаптивная сетка бликов */}
                  {activeTabBliks.length > 0 ? (
                    <div className={`
                      ${windowWidth < 768 
                        ? 'max-w-lg mx-auto space-y-4' // Мобильный: одна колонка как Instagram
                        : 'bliks-grid' // Планшет и больше: сетка
                      }
                    `}>
                      {activeTabBliks.map((blik, index) => (
                        <motion.div
                          key={`${activeBliksTab}-${blik.id}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.05 
                          }}
                        >
                          <BlikCard
                            blik={blik}
                            layout={windowWidth < 768 ? "feed" : "grid"}
                            index={index}
                            onLike={() => onLike?.(blik.id)}
                            onComment={() => onComment?.(blik.id)}
                            onShare={() => onShareBlik?.(blik.id)}
                            onBlikDetail={() => onBlikDetail?.(blik.id)}
                            onUserProfile={onUserProfile}
                            onSuperpowerClick={onSuperpowerClick}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">
                        {activeBliksTab === 'receives' ? '📩' : '📤'}
                      </div>
                      <h4 className="font-medium text-foreground mb-2">
                        {activeBliksTab === 'receives' 
                          ? 'Пока нет бликов от друзей' 
                          : 'Пока не отправлял блики друзьям'
                        }
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {activeBliksTab === 'receives' 
                          ? 'Блики от друзей появятся здесь, когда другие пользователи будут поддерживать суперсилы' 
                          : 'Блики, которые пользователь отправляет друзьям для поддержки их суперсил, появятся здесь'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CircularActionButton({ 
  icon, 
  label, 
  onClick,
  variant = "default"
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "create" | "friend" | "success" | "subscribe" | "share";
}) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case "create":
        return `
          text-purple-300 backdrop-blur-xl glass-card
          border border-purple-400/30
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),0_0_12px_rgba(147,51,234,0.15)]
          hover:text-purple-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),0_0_16px_rgba(147,51,234,0.2)]
          hover:border-purple-300/40
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
      case "friend":
        return `
          text-blue-300 backdrop-blur-xl glass-card
          border border-blue-400/30
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),0_0_12px_rgba(59,130,246,0.15)]
          hover:text-blue-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),0_0_16px_rgba(59,130,246,0.2)]
          hover:border-blue-300/40
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
      case "success":
        return `
          text-emerald-300 backdrop-blur-xl glass-card
          border border-emerald-400/40 bg-emerald-500/8
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15),0_0_15px_rgba(16,185,129,0.2)]
          hover:text-emerald-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(16,185,129,0.25)]
          hover:border-emerald-300/50 hover:bg-emerald-500/12
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
      case "subscribe":
        return `
          text-amber-300 backdrop-blur-xl glass-card
          border border-amber-400/30
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),0_0_12px_rgba(245,158,11,0.15)]
          hover:text-amber-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),0_0_16px_rgba(245,158,11,0.2)]
          hover:border-amber-300/40
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
      case "share":
        return `
          text-cyan-300 backdrop-blur-xl glass-card
          border border-cyan-400/30
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),0_0_12px_rgba(6,182,212,0.15)]
          hover:text-cyan-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),0_0_16px_rgba(6,182,212,0.2)]
          hover:border-cyan-300/40
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
      default:
        return `
          text-muted-foreground backdrop-blur-xl glass-card
          border border-slate-500/25
          shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]
          hover:text-foreground hover:shadow-[0_6px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]
          hover:border-slate-400/30
          active:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]
          active:translate-y-[1px]
        `;
    }
  };
  
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -1,
        rotate: variant === "success" ? 360 : 0,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        y: 1,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
      className={`
        w-12 h-12
        rounded-full 
        flex items-center justify-center
        transition-all duration-200 ease-out
        relative overflow-hidden
        transform-gpu
        ${getVariantStyles()}
      `}
    >
      {/* Внутренний световой блик для 3D эффекта */}
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-t from-transparent via-white/8 to-white/16 pointer-events-none" />
      
      {/* Анимированный пульс для активного состояния */}
      {variant === "success" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            opacity: [0, 0.4, 0.2]
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute inset-0 rounded-full border border-emerald-400/40"
        />
      )}
      
      {/* Иконка с 3D эффектом */}
      <span className="relative z-10 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] drop-shadow-[0_0_4px_rgba(255,255,255,0.1)]">
        {icon}
      </span>
    </motion.button>
  );
}