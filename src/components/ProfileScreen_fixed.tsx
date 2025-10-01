import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Settings, UserPlus, Share, Bell, ChevronDown, ChevronUp, Globe, Search, Menu } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { CompactMetricCard } from './CompactMetricCard';
import { CompactSuperpowerCard } from './CompactSuperpowerCard';
import { BlikCard, BlikData } from './BlikCard';
import { BusinessProfileCard } from './BusinessProfileCard';
import { BusinessSuperpowerCard } from './BusinessSuperpowerCard';


interface User {
  name: string;
  status: string;
  location: string;
  backgroundImage: string;
  avatarImage: string;
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
    verificationDate?: string;
    verificationDocuments?: any[];
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

interface ProfileScreenProps {
  user: User;
  receivedBliks?: BlikData[];
  sentBliks?: BlikData[];
  onSettings: () => void;
  onViewMap: () => void;
  onViewPersonalSite?: () => void;
  onViewBliks: () => void;
  onViewFriends?: () => void;
  onChat: () => void;
  onBack: () => void;
  onAddFriend?: () => void;
  onSubscribe?: () => void;
  onShare: () => void;
  onSuperpowerClick?: (superpowerName: string) => void;
  onUserProfile?: (userId: string) => void;
  onLike?: (blikId: string) => void;
  onComment?: (blikId: string) => void;
  onShareBlik?: (blikId: string) => void;
  onBlikDetail?: (blikId: string) => void;
  onSidebar?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
}

interface CircularActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const CircularActionButton: React.FC<CircularActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'secondary',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'glass-card hover:energy-glow'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2"
    >
      <button
        onClick={onClick}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full flex items-center justify-center
          transition-all duration-300
          border border-border/50
          shadow-lg
        `}
      >
        {icon}
      </button>
      <span className="text-xs text-muted-foreground text-center leading-tight max-w-[80px]">
        {label}
      </span>
    </motion.div>
  );
};

export function ProfileScreen({
  user,
  receivedBliks = [],
  sentBliks = [],
  onSettings,
  onViewMap,
  onViewPersonalSite,
  onViewBliks,
  onViewFriends,
  onChat,
  onBack,
  onAddFriend,
  onSubscribe,
  onShare,
  onSuperpowerClick,
  onUserProfile,
  onLike,
  onComment,
  onShareBlik,
  onBlikDetail,
  onSidebar,
  onSearch,
  onNotifications
}: ProfileScreenProps) {
  const [isTopSuperpowersExpanded, setIsTopSuperpowersExpanded] = useState(false);
  const [showAllBliks, setShowAllBliks] = useState(false);
  const bliksRef = useRef<HTMLDivElement>(null);

  // Количество суперсил для отображения в свернутом виде (адаптивно)
  const initialCount = 6; // Для мобильных устройств 6 суперсил (2 ряда по 3)
  
  // Определяем количество суперсил для отображения
  const displayedSuperpowers = isTopSuperpowersExpanded 
    ? user.topSuperpowers 
    : user.topSuperpowers.slice(0, initialCount);

  // Количество бликов для превью (показываем 3-4 последних блика)
  const previewBliksCount = 4;

  // Последние полученные блики
  const recentReceivedBliks = receivedBliks.sort((a, b) => {
    const timeA = a.timestamp.includes('час') ? 1 : a.timestamp.includes('день') ? 24 : 1;
    const timeB = b.timestamp.includes('час') ? 1 : b.timestamp.includes('день') ? 24 : 1;
    return timeA - timeB;
  });

  // Все блики для превью (всегда показываем все)
  const allBliks = [...receivedBliks, ...sentBliks].sort((a, b) => {
    const timeA = a.timestamp.includes('час') ? 1 : a.timestamp.includes('день') ? 24 : 1;
    const timeB = b.timestamp.includes('час') ? 1 : b.timestamp.includes('день') ? 24 : 1;
    return timeA - timeB;
  });

  // Функция прокрутки к секции бликов (оставляем для клика по метрике)
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

        {/* Заголовок с кнопками */}
        <div className="flex items-center justify-between px-6 py-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 -ml-2 text-foreground"
          >
            <ArrowLeft size={24} />
          </motion.button>

          <div className="flex items-center gap-2">
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

            {/* Уведомления */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onNotifications}
              className="
                text-white/80 hover:text-white 
                p-2 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
                relative
              "
            >
              <Bell size={20} />
              {/* Индикатор новых уведомлений */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full animate-pulse" />
            </motion.button>

            {/* Меню (сайдбар) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSidebar}
              className="
                text-white/80 hover:text-white 
                p-2 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
              "
            >
              <Menu size={20} />
            </motion.button>

            {/* Настройки - только для своего профиля */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSettings}
              className="
                text-white/80 hover:text-white 
                p-2 rounded-xl
                hover:bg-white/10
                backdrop-blur-xl
                transition-all duration-300
              "
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>

        {/* Основная информация профиля */}
        <div className="px-6 pb-8">
          {/* Профиль пользователя */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4 mb-6"
          >
            <ProfileAvatar 
              image={user.avatarImage} 
              isOnline={user.isOnline}
              size="large"
            />
            
            <div className="flex-1">
              <h1 className="font-bold text-2xl text-foreground mb-1">
                {user.name}
              </h1>
              <p className="text-base text-foreground/80 mb-2">{user.status}</p>
              {/* Регион под статусом */}
              <div className="flex items-center gap-1 text-sm text-white/70">
                <MapPin size={14} className="text-blue-400" />
                <span>{user.location}</span>
              </div>
            </div>
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
              onClick={onViewMap}
            />
          </motion.div>

          {/* Бизнес-информация (если это бизнес-профиль) */}
          {user.profileType === 'business' && user.businessInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 px-6"
            >
              <BusinessProfileCard
                businessInfo={user.businessInfo}
                metrics={user.metrics}
                isOwner={true}
                onRequestVerification={() => {
                  // TODO: implement verification
                }}
                onUpgradeToPremium={() => {
                  // TODO: implement premium upgrade
                }}
              />
            </motion.div>
          )}

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
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center gap-4 mb-8 flex-wrap"
          >
            {/* Кнопки для социальных действий убраны из собственного профиля */}
            {onViewPersonalSite && (
              <CircularActionButton
                icon={<Globe size={20} />}
                label="Персональный сайт"
                onClick={onViewPersonalSite}
                variant="secondary"
              />
            )}
            
            <CircularActionButton
              icon={<Share size={20} />}
              label="Поделиться"
              onClick={onShare}
              variant="secondary"
            />
          </motion.div>

          {/* Блики - показываем как превью с кнопкой "Посмотреть все" */}
          <motion.div 
            ref={bliksRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-foreground">⚡ Последние блики</h2>
              
              {allBliks.length > previewBliksCount && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onViewBliks}
                  className="
                    text-sm 
                    backdrop-blur-xl glass-card
                    rounded-full px-4 py-2
                    text-muted-foreground hover:text-foreground
                    hover:bg-accent transition-all duration-300
                  "
                >
                  Посмотреть все {allBliks.length}
                </motion.button>
              )}
            </div>

            {/* Превью бликов - всегда показываем в одну колонку как Instagram */}
            <div className="profile-bliks-mobile">
              {(showAllBliks ? allBliks : allBliks.slice(0, previewBliksCount)).map((blik, index) => (
                <motion.div
                  key={blik.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="instagram-feed-card"
                >
                  <BlikCard
                    blik={blik}
                    onLike={onLike}
                    onComment={onComment}
                    onShare={onShareBlik}
                    onUserProfile={onUserProfile}
                    onBlikDetail={onBlikDetail}
                    showFullContent={true}
                  />
                </motion.div>
              ))}
            </div>

            {allBliks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Пока нет бликов</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Блики появятся здесь когда кто-то отметит твои суперсилы
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Фоновое изображение профиля с градиентом */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.60) 60%, rgba(0,0,0,0.85) 100%), url(${user.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}