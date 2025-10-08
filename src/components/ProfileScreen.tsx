import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Settings, UserPlus, Share, Bell, ChevronDown, ChevronUp, Globe, Search, Menu, Building2, Users, TrendingUp, Calendar, Verified, Zap, FileText, CalendarDays } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { CompactMetricCard } from './CompactMetricCard';
import { CompactSuperpowerCard } from './CompactSuperpowerCard';
import { BlikCard, BlikData } from './BlikCard';
import { BusinessSuperpowerCard } from './BusinessSuperpowerCard';
import { ValueMapPreviewCard } from './ValueMapPreviewCard';


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
    brandHeader?: string; // Брендированная шапка для бизнес-профилей
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
  onViewBlog?: () => void; // Отдельная функция для блога
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
  onNotifications,
  onViewBlog
}: ProfileScreenProps) {
  const [isTopSuperpowersExpanded, setIsTopSuperpowersExpanded] = useState(false);
  const [showAllBliks, setShowAllBliks] = useState(false);
  const [bliksTab, setBliksTab] = useState<'my' | 'friends'>('my');
  const [businessTab, setBusinessTab] = useState<'bliks' | 'blog' | 'events'>('bliks');
  const bliksRef = useRef<HTMLDivElement>(null);

  // 🎯 АДАПТИВНОЕ КОЛИЧЕСТВО СУПЕРСИЛ: определяем на основе размера экрана
  const [initialCount, setInitialCount] = useState(3); // По умолчанию 3 для мобильных
  
  useEffect(() => {
    const updateInitialCount = () => {
      const width = window.innerWidth;
      
      if (width < 768) {
        // Мобильные: 3 суперсилы (1 ряд по 3)
        setInitialCount(3);
      } else if (width >= 768 && width < 1024) {
        // Планшеты (md): 6 суперсил (2 ряда по 3)
        setInitialCount(6);
      } else if (width >= 1024 && width < 1280) {
        // Десктоп (lg): 8 суперсил (2 ряда по 4)
        setInitialCount(8);
      } else if (width >= 1280) {
        // Большие экраны (xl+): 10 суперсил (2 ряда по 5)
        setInitialCount(10);
      }
    };
    
    // Устанавливаем при монтировании
    updateInitialCount();
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateInitialCount);
    return () => window.removeEventListener('resize', updateInitialCount);
  }, []);
  
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

  // Блики в зависимости от типа профиля и выбранной вкладки
  const displayedBliks = user.profileType === 'business'
    ? receivedBliks.sort((a, b) => { // Для бизнес-профилей показываем только блики от клиентов (полученные)
        const timeA = a.timestamp.includes('час') ? 1 : a.timestamp.includes('день') ? 24 : 1;
        const timeB = b.timestamp.includes('час') ? 1 : b.timestamp.includes('день') ? 24 : 1;
        return timeA - timeB;
      })
    : bliksTab === 'my' 
    ? sentBliks.sort((a, b) => {
        const timeA = a.timestamp.includes('час') ? 1 : a.timestamp.includes('день') ? 24 : 1;
        const timeB = b.timestamp.includes('час') ? 1 : b.timestamp.includes('день') ? 24 : 1;
        return timeA - timeB;
      })
    : receivedBliks.sort((a, b) => {
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
      {/* Фоновое изображение профиля - ФИРМЕННЫЙ ЭНЕРГИЧНЫЙ ФОН */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: user.profileType === 'business'
            ? `linear-gradient(135deg, rgba(26,27,35,0.30) 0%, rgba(26,27,35,0.15) 30%, rgba(26,27,35,0.10) 60%, rgba(26,27,35,0.40) 100%), url(${user.backgroundImage})`
            : `linear-gradient(135deg, rgba(26,27,35,0.50) 0%, rgba(99,102,241,0.12) 20%, rgba(236,72,153,0.08) 40%, rgba(168,85,247,0.10) 60%, rgba(26,27,35,0.15) 80%, rgba(26,27,35,0.60) 100%), url(${user.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Контент с прокруткой */}
      <div className="relative z-10 flex flex-col">
        {/* Статус бар */}
        <StatusBar />

        {/* Заголовок с кнопками - ТЕПЕРЬ СВЕРХУ ДЛЯ ВСЕХ */}
        <div className="flex items-center justify-between px-6 py-2">
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

        {/* 🏢 УПРОЩЕННАЯ БРЕНДИРОВАННАЯ ШАПКА (только для бизнес-профилей) */}
        {user.profileType === 'business' && user.businessInfo?.brandHeader && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden"
          >
            {/* Брендированное изображение */}
            <img
              src={user.businessInfo.brandHeader}
              alt={`${user.businessInfo.companyName} header`}
              className="w-full h-full object-cover"
            />
            
            {/* Градиентный оверлей */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80" />
            
            {/* ПРОСТАЯ ИНФОРМАЦИЯ НА ШАПКЕ */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
              <div className="flex items-center gap-3">
                <ProfileAvatar 
                  image={user.avatarImage} 
                  isOnline={user.isOnline}
                  size="large"
                  isBrandLogo={user.profileType === 'business'}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-xl text-white">
                      {user.name}
                    </h1>
                    {user.businessInfo.verified && (
                      <Verified size={18} className="text-emerald-400 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-white/80 line-clamp-1">{user.businessInfo.description}</p>
                  <div className="flex items-center gap-1 text-xs text-white/70 mt-0.5">
                    <MapPin size={12} className="text-blue-400" />
                    <span>{user.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* СТАТИСТИКА ПОД ШАПКОЙ - для бизнес-профилей */}
        {user.profileType === 'business' && user.businessInfo && (
          <div className="border-b border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="px-6 py-4"
            >
              <div className="flex items-center justify-center gap-6 max-w-md mx-auto">
                <CompactMetricCard 
                  value={user.metrics.superpowers} 
                  label="Суперсилы" 
                  index={0}
                  onClick={onViewMap}
                />
                <CompactMetricCard 
                  value={user.metrics.bliks} 
                  label="Блики" 
                  index={1}
                  onClick={scrollToBliks}
                />
                <CompactMetricCard 
                  value={user.metrics.friends} 
                  label="Клиенты" 
                  index={2}
                  onClick={onViewFriends || (() => {})}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Основная информация профиля */}
        <div className="px-6 pb-8">
          {/* 🏢 БИЗНЕС-ПРОФИЛЬ: Компактная структура */}
          {user.profileType === 'business' && user.businessInfo ? (
            <>

              {/* Карта ценности - превью с диаграммой и топ-3 суперсилами */}
              <ValueMapPreviewCard
                topSuperpowers={user.topSuperpowers}
                overallScore={94}
                metrics={user.metrics}
                onClick={onViewMap}
              />
            </>
          ) : (
            // ЛИЧНЫЙ ПРОФИЛЬ: Обычная структу��а
            <>
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
                  isBrandLogo={user.profileType === 'business'}
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
            </>
          )}

          {/* Топ суперсилы - ТОЛЬКО ДЛЯ ЛИЧНЫХ ПРОФИЛЕЙ */}
          {user.profileType !== 'business' && (
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
                      isOwn={true}
                      onClick={() => onSuperpowerClick?.(superpower.name)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            </motion.div>
          )}
          
          {/* Кнопки действий убраны - доступ к персональному сайту через Блог, делиться своим профилем не нужно */}

          {/* Галерея контента с табменю */}
          <motion.div 
            ref={bliksRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            {user.profileType === 'business' ? (
              // 🏢 БИЗНЕС-ПРОФИЛЬ: Сегментированный контрол (iOS/Material style)
              <div className="w-full mb-6 flex justify-center px-6">
                <div className="inline-flex items-center backdrop-blur-xl bg-white/10 rounded-2xl p-1 border border-white/20 shadow-lg">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBusinessTab('bliks')}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl
                      transition-all duration-300 font-medium text-sm
                      ${businessTab === 'bliks'
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                      }
                    `}
                  >
                    {businessTab === 'bliks' && (
                      <motion.div
                        layoutId="businessTabIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl shadow-md"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">⚡</span>
                    <span className="relative z-10">Блики</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBusinessTab('blog');
                      onViewBlog?.();
                    }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl
                      transition-all duration-300 font-medium text-sm
                      ${businessTab === 'blog'
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                      }
                    `}
                  >
                    {businessTab === 'blog' && (
                      <motion.div
                        layoutId="businessTabIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl shadow-md"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">✍️</span>
                    <span className="relative z-10">Блог</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBusinessTab('events')}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl
                      transition-all duration-300 font-medium text-sm
                      ${businessTab === 'events'
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                      }
                    `}
                  >
                    {businessTab === 'events' && (
                      <motion.div
                        layoutId="businessTabIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl shadow-md"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">🎉</span>
                    <span className="relative z-10">События</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              // 👤 ЛИЧНЫЙ ПРОФИЛЬ: Обычное меню с фильтрами
              <>
                {/* Главное табменю типов контента */}
                <div className="w-full max-w-md mx-auto mb-4">
                  <div className="flex items-center glass-card rounded-2xl p-1">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 px-4 rounded-xl transition-all duration-300 bg-white/20 text-white shadow-sm"
                    >
                      ⚡ Блики
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onViewBlog}
                      className="flex-1 py-2.5 px-4 rounded-xl transition-all duration-300 text-white/60 hover:text-white/80"
                    >
                      📝 Блог
                    </motion.button>
                  </div>
                </div>
                
                {/* Компактные фильтры "Мои" / "Друзей" */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={() => setBliksTab('my')}
                    className={`
                      text-sm transition-all duration-300
                      ${bliksTab === 'my'
                        ? 'text-white font-medium'
                        : 'text-white/50 hover:text-white/80'
                      }
                    `}
                  >
                    Мои
                  </button>
                  <span className="text-white/30">•</span>
                  <button
                    onClick={() => setBliksTab('friends')}
                    className={`
                      text-sm transition-all duration-300
                      ${bliksTab === 'friends'
                        ? 'text-white font-medium'
                        : 'text-white/50 hover:text-white/80'
                      }
                    `}
                  >
                    Друзей
                  </button>
                </div>
              </>
            )}

            {/* Контент в зависимости от типа профиля и выбранной вкладки */}
            {user.profileType === 'business' && businessTab === 'bliks' && (
              // 🏢 БИЗНЕС: Блики от клиентов
              <div className="profile-bliks-mobile">
                {(showAllBliks ? displayedBliks : displayedBliks.slice(0, previewBliksCount)).map((blik, index) => (
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
                
                {displayedBliks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">Пока нет бликов от клиентов</p>
                  </div>
                )}
              </div>
            )}

            {user.profileType === 'business' && businessTab === 'blog' && (
              // 🏢 БИЗНЕС: Блог (перенаправление на PersonalSiteScreen)
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">Блог открывается в отдельном экране</p>
              </div>
            )}

            {user.profileType === 'business' && businessTab === 'events' && (
              // 🏢 БИЗНЕС: События (заглушка)
              <div className="text-center py-12">
                <p className="text-white/60">События скоро появятся</p>
              </div>
            )}

            {user.profileType !== 'business' && (
              // 👤 ЛИЧНЫЙ ПРОФИЛЬ: Блики
              <div className="profile-bliks-mobile">
                {(showAllBliks ? displayedBliks : displayedBliks.slice(0, previewBliksCount)).map((blik, index) => (
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

                {displayedBliks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/60">Пока нет бликов</p>
                  </div>
                )}
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
