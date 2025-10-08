import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Users, TrendingUp, Zap, MessageCircle, Heart, Target, Star, Grid3x3, List, Filter, SortAsc, BarChart3, Settings, Plus, UserPlus, Search, MoreHorizontal, Crown, Grid, Camera, BatteryCharging } from 'lucide-react';
import { BlikCard, BlikData } from './BlikCard';
import { CustomizableSuperpowerLogo } from './CustomizableSuperpowerLogo';
import { CommunityMemberCard } from './CommunityMemberCard';
import { TrendsWidget } from './TrendsWidget';
import { PersonalizedTrendsWidget } from './PersonalizedTrendsWidget';
import { CommunityTrendsWidget } from './CommunityTrendsWidget';
import { StatusBar } from './StatusBar';
import { SuperpowerBlikersWidget } from './SuperpowerBlikersWidget';
import { SuperpowerSettingsModal } from './SuperpowerSettingsModal';
import { ProfileAvatar } from './ProfileAvatar';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

interface SuperpowerHubProps {
  name: string;
  emoji: string;
  description: string;
  bliks: number;
  energy: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  ownerAvatar?: string;
  ownerName?: string;
  ownerProfileType?: 'personal' | 'business';
  userSuperpowers?: Array<{name: string; emoji: string; value: number; trend: 'up' | 'down' | 'stable'}>;
  feedBliks?: BlikData[];
  onBack: () => void;
  onShare: () => void;
  onCreateBlik: () => void;
  onUserProfile: (userId: string) => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onSidebar?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  onSuperpowerClick?: (superpowerName: string) => void;
  isOwner?: boolean;
  // Новые props для мегасил
  isMegaSuperpower?: boolean;
  participantCount?: number;
  participants?: Array<{name: string; avatar: string; bliks: number; energy: number}>;
}

export function SuperpowerHubScreen({
  name,
  emoji,
  description,
  bliks,
  energy,
  trend,
  category,
  ownerAvatar,
  ownerName,
  ownerProfileType,
  userSuperpowers = [],
  feedBliks = [],
  onBack,
  onShare,
  onCreateBlik,
  onUserProfile,
  onLike,
  onComment,
  onBlikDetail,
  onSidebar,
  onSearch,
  onNotifications,
  onSuperpowerClick,
  isOwner = false,
  isMegaSuperpower = false,
  participantCount,
  participants = []
}: SuperpowerHubProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'community' | 'trends'>('feed');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для таба "ТОП участники"
  const [communityViewMode, setCommunityViewMode] = useState<'list' | 'grid'>('grid'); // По умолчанию галерея
  const [communitySortBy, setCommunitySortBy] = useState<'rating' | 'recent' | 'activity'>('rating');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'online' | 'experts'>('all');
  
  // Состояние для подменю участников (Обладатели/Креаторы)
  const [participantsSubTab, setParticipantsSubTab] = useState<'owners' | 'supporters'>('owners');

  // Состояние для настроек суперсилы
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [superpowerSettings, setSuperpowerSettings] = useState({
    isVisible: true,
    whoCanBlik: 'everyone' as 'everyone' | 'friends' | 'nobody',
    blockedUsers: [] as string[]
  });

  // Отладочная информация для определения владельца (временно для отладки)
  console.log(`🎯 SuperpowerHubScreen получил данные для "${name}":`, {
    isOwner,
    ownerName,
    ownerProfileType,
    isMegaSuperpower
  });

  // Имя владельца суперсилы и определение userId
  const displayOwnerName = ownerName || (isOwner ? 'Risha Bliq' : name === 'Программирование' ? 'Алексей Корнеев' : name === 'Фотография' ? 'Мария Смирнова' : name === 'Кулинария' ? 'Игорь Волков' : name === 'Танцы' ? 'Елена Рыбакова' : name === 'Музыка' ? 'Дмитрий Козлов' : 'Другой пользователь');
  
  // Определяем userId владельца суперсилы для перехода в профиль
  const getOwnerUserId = () => {
    if (isOwner) return null; // Это наша суперсила, не переходим
    
    // Маппинг имен владельцев на их userId
    const ownerToUserIdMap: Record<string, string> = {
      'Алексей Корнеев': 'alexey-korneev',
      'Мария Смирнова': 'maria-smirnova',
      'Игорь Волков': 'igor-volkov',
      'Елена Рыбакова': 'elena-rybakova',
      'Дмитрий Козлов': 'dmitry-kozlov'
    };
    
    return ownerToUserIdMap[displayOwnerName] || null;
  };
  
  const ownerUserId = getOwnerUserId();

  // Принудительно прокручиваем к верху при открытии экрана суперсилы
  useEffect(() => {
    const scrollToTop = () => {
      // Множественные методы для гарантированной прокрутки
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Также скроллим любые контейнеры с overflow
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
      scrollableContainers.forEach(container => {
        container.scrollTop = 0;
      });
    };
    
    // Немедленная прокрутка при смене суперсилы
    scrollToTop();
    
    // Дополнительные попытки для надежности
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 200);
  }, [name]); // Зависимость от name, чтобы скроллить при смене суперсилы

  // Статистика для трендов
  const trendsStats = {
    totalBliks: 3456,
    weeklyGrowth: 12,
    activeUsers: 89,
    dailyActivity: 47,
    peakHour: '18:00-20:00',
    averageEnergy: 78
  };

  // Бликеры суперсилы с правильными аватарками
  const superpowerBlikers = [
    {
      id: '1',
      name: 'Алексей',
      avatar: 'https://images.unsplash.com/photo-1659353221237-6a1cfb73fd90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwaGVhZHNob3QlMjBjb3Jwb3JhdGV8ZW58MXx8fHwxNzU4ODY5NDk0fDA&ixlib=rb-4.1.0&q=80&w=400',
      isOnline: true,
      recentBliks: 5,
      hasNewContent: true,
      level: 'Эксперт' as const,
      badgeEmoji: '🔥'
    },
    {
      id: '2', 
      name: 'Мария',
      avatar: 'https://images.unsplash.com/photo-1656568726647-9092bf2b5640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODc3NTU0NHww&ixlib=rb-4.1.0&q=80&w=400',
      isOnline: true,
      recentBliks: 3,
      hasNewContent: true,
      level: 'Мастер' as const,
      badgeEmoji: '⭐'
    },
    {
      id: '3',
      name: 'Игорь', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 2,
      hasNewContent: true,
      level: 'Про' as const
    },
    {
      id: '4',
      name: 'Елена',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 8,
      hasNewContent: true,
      level: 'Мастер' as const,
      badgeEmoji: '💎'
    },
    {
      id: '5',
      name: 'Дмитрий',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 1,
      hasNewContent: false,
      level: 'Любитель' as const
    }
  ];

  // Моковые данные сообщества
  const communityStats = {
    members: 1247,
    activeToday: 89,
    totalBliks: 3456,
    weeklyGrowth: 12
  };

  // Расширенные данные сообщества с правильными аватарками
  const allCommunityMembers = [
    {
      id: '1',
      name: 'Алексей Корнеев',
      avatar: 'https://images.unsplash.com/photo-1659353221237-6a1cfb73fd90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwaGVhZHNob3QlMjBjb3Jwb3JhdGV8ZW58MXx8fHwxNzU4ODY5NDk0fDA&ixlib=rb-4.1.0&q=80&w=400',
      bliks: 156,
      level: 'Эксперт' as const,
      isOnline: true,
      joinedDaysAgo: 89,
      totalLikes: 342,
      badgeEmoji: '🔥'
    },
    {
      id: '2', 
      name: 'Мария Смирнова',
      avatar: 'https://images.unsplash.com/photo-1656568726647-9092bf2b5640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODc3NTU0NHww&ixlib=rb-4.1.0&q=80&w=400',
      bliks: 134,
      level: 'Мастер' as const,
      isOnline: true,
      joinedDaysAgo: 67,
      totalLikes: 298,
      badgeEmoji: '⭐'
    },
    {
      id: '3',
      name: 'Игорь Волков', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bliks: 98,
      level: 'Про' as const,
      isOnline: false,
      joinedDaysAgo: 45,
      totalLikes: 187
    },
    {
      id: '4',
      name: 'Елена Рыбакова',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bliks: 87,
      level: 'Про' as const,
      isOnline: true,
      joinedDaysAgo: 0,
      totalLikes: 156,
      badgeEmoji: '💎'
    },
    {
      id: '5',
      name: 'Дмитрий Козлов',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      bliks: 73,
      level: 'Любитель' as const,
      isOnline: false,
      joinedDaysAgo: 0,
      totalLikes: 134
    },
    {
      id: '6',
      name: 'Анна Петрова',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      bliks: 112,
      level: 'Мастер' as const,
      isOnline: true,
      joinedDaysAgo: 23,
      totalLikes: 245
    }
  ];

  // Персонализированная аналитика для персональных суперсил
  const personalizedStats = {
    currentValue: bliks,
    energy: energy,
    rankAmongUserSuperpowers: (userSuperpowers && userSuperpowers.length > 0) 
      ? Math.max(1, userSuperpowers.findIndex(sp => sp.name === name) + 1)
      : 1,
    totalUserSuperpowers: (userSuperpowers && userSuperpowers.length) || 12,
    friendsWithSameSuperpower: 8,
    averageValueAmongFriends: 65,
    userValueVsFriends: bliks > 65 ? 'above' as const : bliks < 65 ? 'below' as const : 'average' as const,
    growthPotential: Math.min(95, Math.max(15, 100 - bliks + (energy / 2))),
    recentTrend: trend === 'up' ? 'rising' as const : trend === 'down' ? 'falling' as const : 'stable' as const,
    weeklyGrowth: trend === 'up' ? 12 : trend === 'down' ? -5 : 2,
    monthlyGrowth: trend === 'up' ? 28 : trend === 'down' ? -12 : 8,
    strengthInCircle: Math.min(95, bliks + 10),
    uniquenessScore: energy > 80 ? 85 : energy > 60 ? 70 : 55,
    peakActivityTime: '18:00-20:00',
    superpowerMomentum: energy > 80 ? 'heating_up' as const : energy < 40 ? 'cooling_down' as const : 'stable' as const
  };

  // Аналитика публичных суперсил сообщества (мегасилы и бизнес-силы)
  const communityStats_detailed = {
    totalMembers: communityStats.members,
    activeToday: communityStats.activeToday,
    totalBliks: communityStats.totalBliks,
    weeklyGrowth: communityStats.weeklyGrowth,
    averageEnergy: Math.round((superpowerBlikers.reduce((sum, b) => sum + (b.recentBliks || 0), 0) / superpowerBlikers.length) * 10),
    topBlikers: superpowerBlikers.filter(b => (b.recentBliks || 0) > 5).length,
    peakHour: '18:00-20:00',
    foundedDaysAgo: name === 'Программирование' ? 156 : name === 'Фотография' ? 89 : 67
  };

  // Используем реальные блики, переданные из App.tsx, или показываем расширенную заглушку
  const feedContent: BlikData[] = feedBliks.length > 0 ? feedBliks : [
    {
      id: 'placeholder-1',
      type: 'text',
      content: `Пока что нет бликов для суперсилы "${name}". Станьте первым, кто поделится опытом! 🌟`,
      author: {
        name: 'Bliq',
        avatar: '⭐',
        isOnline: true
      },
      recipient: {
        name: 'Сообщество',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: 'только что',
      likes: 0,
      comments: 0,
      isLiked: false
    },
    {
      id: 'placeholder-2',
      type: 'text',
      content: `Эта суперсила помогает достигать новых высот! Присоединяйтесь к нашему сообществу ${emoji}`,
      author: {
        name: 'Система',
        avatar: emoji,
        isOnline: true
      },
      recipient: {
        name: 'Сообщество',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: '1 час назад',
      likes: 5,
      comments: 2,
      isLiked: false
    },
    {
      id: 'placeholder-3',
      type: 'text',
      content: `Развивайте ${name.toLowerCase()} вместе с единомышленниками! Делитесь опытом и получайте блики 🚀`,
      author: {
        name: 'Сообщество',
        avatar: '🌟',
        isOnline: true
      },
      recipient: {
        name: 'Новички',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: '2 часа назад',
      likes: 12,
      comments: 4,
      isLiked: true
    },
    {
      id: 'placeholder-4',
      type: 'text',
      content: `Советы по развитию суперсилы "${name}" от опытных участников сообщества 💡`,
      author: {
        name: 'Наставник',
        avatar: '🎯',
        isOnline: false
      },
      recipient: {
        name: 'Ученики',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: '4 часа назад',
      likes: 8,
      comments: 6,
      isLiked: false
    },
    {
      id: 'placeholder-5',
      type: 'text',
      content: `Практические упражнения и техники для укрепления ${name.toLowerCase()} ⚡`,
      author: {
        name: 'Тренер',
        avatar: '💪',
        isOnline: true
      },
      recipient: {
        name: 'Практиканты',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: '6 часов назад',
      likes: 15,
      comments: 3,
      isLiked: true
    },
    {
      id: 'placeholder-6',
      type: 'text',
      content: `Истории успеха людей, которые развили ${name.toLowerCase()} до высокого уровня 🏆`,
      author: {
        name: 'Вдохновитель',
        avatar: '✨',
        isOnline: true
      },
      recipient: {
        name: 'Мечтатели',
        avatar: emoji
      },
      superpower: {
        name: name,
        emoji: emoji
      },
      timestamp: '8 часов назад',
      likes: 22,
      comments: 9,
      isLiked: false
    }
  ];

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'from-emerald-500 to-green-400';
    if (energy >= 60) return 'from-yellow-500 to-amber-400';
    if (energy >= 40) return 'from-orange-500 to-red-400';
    return 'from-red-500 to-rose-400';
  };

  // Функция для получения отфильтрованных и отсортированных участников
  const getFilteredAndSortedMembers = () => {
    // Для мегасил используем реальных участников, для персональных - моковые данные
    const membersData = isMegaSuperpower && participants.length > 0 
      ? participants.map(p => ({
          id: p.name,
          name: p.name,
          avatar: p.avatar,
          bliks: p.bliks,
          energy: p.energy,
          level: p.energy > 90 ? 'Гуру' : p.energy > 80 ? 'Эксперт' : p.energy > 60 ? 'Мастер' : 'Ученик',
          isOnline: Math.random() > 0.3, // Рандомно определяем онлайн статус
          joinedDaysAgo: Math.floor(Math.random() * 30),
          totalLikes: p.bliks
        }))
      : allCommunityMembers;

    let filtered = [...membersData];

    // Поиск по имени участника
    if (searchQuery.trim() && activeTab === 'community') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.level.toLowerCase().includes(query)
      );
    }

    // Фильтрация
    switch (communityFilter) {
      case 'online':
        filtered = filtered.filter(member => member.isOnline);
        break;
      case 'experts':
        filtered = filtered.filter(member => ['Эксперт', 'Мастер', 'Гуру'].includes(member.level));
        break;
      case 'all':
      default:
        break;
    }

    // Сортировка
    switch (communitySortBy) {
      case 'rating':
        filtered.sort((a, b) => b.bliks - a.bliks);
        break;
      case 'recent':
        filtered.sort((a, b) => a.joinedDaysAgo - b.joinedDaysAgo);
        break;
      case 'activity':
        filtered.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
        break;
    }

    return filtered;
  };

  const filteredMembers = getFilteredAndSortedMembers();

  // Функция для фильтрации контента по поисковому запросу
  const getFilteredContent = () => {
    if (!searchQuery.trim()) return feedContent;
    
    const query = searchQuery.toLowerCase().trim();
    return feedContent.filter(blik => 
      blik.content.toLowerCase().includes(query) ||
      blik.author.name.toLowerCase().includes(query) ||
      blik.superpower.name.toLowerCase().includes(query)
    );
  };

  const filteredContent = getFilteredContent();

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSaveSettings = (newSettings: typeof superpowerSettings) => {
    setSuperpowerSettings(newSettings);
    console.log('Настройки суперсилы сохранены:', newSettings);
  };

  return (
    <>
      <div className="min-h-screen relative w-full max-w-full">
        {/* Контент */}
        <div className="relative z-10 w-full">
          {/* Статус-бар */}
          <StatusBar />

          {/* Хедер с кнопкой назад и сайдбаром */}
          <div className="flex items-center justify-between p-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20"
            >
              <ArrowLeft className="text-white" size={20} />
            </motion.button>

            {/* Миниаватарка пользователя для доступа к сайдбару */}
            {onSidebar && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSidebar}
                className="
                  relative group
                  p-1 rounded-xl
                  hover:bg-white/10
                  backdrop-blur-xl
                  transition-all duration-300
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
              </motion.button>
            )}
          </div>

          {/* БЛОК БЛИКЕРОВ ВВЕРХУ - только на десктопе */}
          <div className="px-4 mb-4 hidden lg:block">
            <SuperpowerBlikersWidget
              blikers={superpowerBlikers}
              superpowerName={name}
              superpowerEmoji={emoji}
              totalBlikers={communityStats.members}
              activeToday={communityStats.activeToday}
              weeklyGrowth={communityStats.weeklyGrowth}
              onUserProfile={onUserProfile}
            />
          </div>

          {/* ОСНОВНОЙ КОНТЕНТ - весь экран прокручивается */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-4 lg:gap-6">
              
              {/* ЛЕВАЯ КОЛОНКА - основной контент с табами (шире на больших экранах) */}
              <div className="lg:col-span-8 xl:col-span-7 superpower-hub-wide-column">
                
                {/* ЗАГОЛОВОЧНЫЕ БЛОКИ */}
                <div className="space-y-4 mb-4">
                
                  {/* МИНИ-БЛОК О СУПЕРСИЛЕ (только на мобильном) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:hidden"
                  >
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 relative">
                      {/* Кнопка настроек в правом верхнем углу */}
                      {isOwner && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsSettingsModalOpen(true)}
                          className="absolute top-3 right-3 p-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                          title="Настройки"
                        >
                          <Settings size={16} />
                        </motion.button>
                      )}

                      {/* НОВЫЙ КОМПАКТНЫЙ БЛОК УЧАСТНИКОВ */}
                      <div className="space-y-4">
                        {/* Заголовок суперсилы - в левом углу */}
                        <div>
                          {/* 🎯 АВАТАРКА ВЛАДЕЛЬЦА СЛЕВА ОТ НАЗВАНИЯ (В ЛЕВОМ УГЛУ) */}
                          <div className="flex items-start gap-3 mb-3">
                            {ownerAvatar && (
                              <img
                                src={ownerAvatar}
                                alt={displayOwnerName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/40 cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0"
                                onClick={() => ownerUserId && onUserProfile(ownerUserId)}
                              />
                            )}
                            <div className="flex flex-col items-start flex-1 min-w-0">
                              <h1 className="font-bold text-white mb-0.5">
                                {name}
                              </h1>
                              <span 
                                className="text-white/80 cursor-pointer hover:text-purple-300 transition-colors duration-200"
                                onClick={() => ownerUserId && onUserProfile(ownerUserId)}
                                title={`Перейти в профиль ${displayOwnerName}`}
                              >
                                {displayOwnerName}
                              </span>
                              <span className="text-white/50 bg-white/10 px-2 py-0.5 rounded-full mt-1">{category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Блок О суперсиле - компактный (МОБИЛЬНЫЙ) */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 space-y-3">
                          {/* 3 метрики сверху */}
                          <div className="grid grid-cols-3 gap-2">
                            {/* Блики */}
                            <div className="text-center">
                              <Camera className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                              <div className="text-white font-medium">{bliks}</div>
                              <div className="text-white/50">Блики</div>
                            </div>
                            
                            {/* Энергия */}
                            <div className="text-center">
                              <BatteryCharging className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                              <div className="text-white font-medium">{energy}%</div>
                              <div className="text-white/50">Энергия</div>
                            </div>
                            
                            {/* Участники */}
                            <div className="text-center">
                              <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                              <div className="text-white font-medium">{communityStats.members.toLocaleString()}</div>
                              <div className="text-white/50">Участники</div>
                            </div>
                          </div>

                          {/* Уровень энергии с прогресс-баром */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/60">Уровень энергии</span>
                              <span className="text-white/90 font-medium">{energy}%</span>
                            </div>
                            <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${energy}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full bg-gradient-to-r ${getEnergyColor(energy)} rounded-full`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Блок Активные участники (отдельно, мобильный) */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 mb-3">
                          {/* Заголовок блока */}
                          <div className="text-white/70 font-medium mb-2">
                            Активные участники
                          </div>
                          
                          {/* Только аватарки без статистики */}
                          <div className="flex -space-x-2">
                            {superpowerBlikers.slice(0, 6).map((member, index) => (
                              <motion.div
                                key={member.id}
                                style={{ zIndex: 10 - index }}
                                whileHover={{ scale: 1.15, zIndex: 20 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  onClick={() => onUserProfile(member.id)}
                                  className="w-8 h-8 rounded-lg border-2 border-white/40 cursor-pointer bg-white/10"
                                  title={member.name}
                                />
                              </motion.div>
                            ))}
                            {superpowerBlikers.length > 6 && (
                              <div className="w-8 h-8 rounded-lg bg-white/20 border-2 border-white/40 flex items-center justify-center">
                                <span className="text-white font-medium">+{superpowerBlikers.length - 6}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Кно��ки действий в едином стиле */}
                      <div className="mt-4 space-y-3">
                        {/* Основные кнопки действий */}
                        <div className="flex gap-3">
                          {/* Кнопка "Бликнуть" */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onCreateBlik}
                            className="flex-1 energy-button py-3 px-4 rounded-2xl text-white transition-all duration-300 flex items-center justify-center"
                          >
                            <Plus size={20} className="mr-2" />
                            Бликнуть
                          </motion.button>

                          {/* Кнопка "Поделиться" */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onShare}
                            className="flex-1 backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 py-3 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                          >
                            <Share2 size={20} className="mr-2" />
                            Поделиться
                          </motion.button>
                        </div>

                        {/* Дополнительная кнопка подписки для чужих суперсил */}
                        {!isOwner && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsSubscribed(!isSubscribed)}
                            className={`w-full py-3 px-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 font-medium flex items-center justify-center ${
                              isSubscribed
                                ? 'bg-white/20 border-white/30 text-white shadow-lg'
                                : 'bg-white/10 border-white/20 text-white/80 hover:text-white hover:bg-white/20 hover:shadow-lg'
                            }`}
                            title={isSubscribed ? 'Отписаться' : 'Подписаться'}
                          >
                            {isSubscribed ? <Heart size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />}
                            {isSubscribed ? 'Отписаться' : 'Подписаться'}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* БЛОК БЛИКЕРОВ ПОД МИ��И-БЛОКОМ О СУПЕРСИЛЕ (только на мобильном) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:hidden"
                  >
                    <SuperpowerBlikersWidget
                      blikers={superpowerBlikers}
                      superpowerName={name}
                      superpowerEmoji={emoji}
                      totalBlikers={communityStats.members}
                      activeToday={communityStats.activeToday}
                      weeklyGrowth={communityStats.weeklyGrowth}
                      onUserProfile={onUserProfile}
                    />
                  </motion.div>
                  
                  {/* ТАБЫ НАВИГАЦИИ С ПОИСКОМ */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex gap-3 items-center"
                  >
                    {/* Контейнер табов */}
                    <div className="flex-1 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-1">
                      <div className="flex gap-1">
                        {[
                          { id: 'feed' as const, label: 'Блики', icon: Zap },
                          { id: 'community' as const, label: 'ТОП участники', icon: Users },
                          { id: 'trends' as const, label: 'Тренды', icon: BarChart3 }
                        ].map((tab) => (
                          <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setSearchQuery(''); // Очищаем поиск при переключении табов
                            }}
                            className={`
                              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300
                              ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                              }
                            `}
                          >
                            <tab.icon size={16} />
                            {tab.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Кнопка поиска */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearchToggle}
                      className={`p-3 rounded-xl backdrop-blur-xl border transition-colors ${
                        isSearchOpen
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      <Search size={16} />
                    </motion.button>
                  </motion.div>

                  {/* СТРОКА ПОИСКА (появляется когда активна) */}
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-1">
                        <input
                          type="text"
                          placeholder={
                            activeTab === 'community' ? "Поиск участников..." : 
                            activeTab === 'feed' ? "Поиск в бликах..." : 
                            "Поиск..."
                          }
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-transparent text-white placeholder-white/50 px-3 py-2 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* КОНТЕНТ БЕЗ ОТДЕЛЬНОЙ ПРОКРУТКИ */}
                <div>
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6 pb-6"
                    >
                      {/* Основная информация о суперсиле */}
                      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 text-4xl flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                            {emoji}
                          </div>
                          <div className="flex-1">
                            <h1 className="font-bold text-white mb-2">
                              {name.replace(' - Ваша', '').replace('Ваша ', '')}
                            </h1>
                            <p className="text-purple-200 mb-3">{category}</p>
                            <p className="text-white/70">
                              {description}
                            </p>
                          </div>
                        </div>

                        {/* Статистика */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="font-bold text-white mb-1">{bliks}</div>
                            <div className="text-white/60">Блики</div>
                          </div>
                          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="font-bold text-white mb-1">{energy}%</div>
                            <div className="text-white/60">Энергия</div>
                          </div>
                        </div>

                        {/* Владелец суперсилы */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <img
                              src={ownerAvatar}
                              alt={displayOwnerName}
                              className="w-10 h-10 rounded-full border border-white/20"
                            />
                            <div>
                              <div className="text-white font-medium">
                                {isOwner ? 'Ваша суперсила' : displayOwnerName}
                              </div>
                              <div className="text-white/60 flex items-center gap-2">
                                {isOwner ? 'Владелец' : 'Автор суперсилы'}
                                {!isOwner && ownerProfileType === 'business' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                    Бизнес
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {!isOwner && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setIsSubscribed(!isSubscribed)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                isSubscribed
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
                              }`}
                            >
                              {isSubscribed ? 'Подписан' : 'Подписаться'}
                            </motion.button>
                          )}
                        </div>

                        {/* Участники мегасилы */}
                        {isMegaSuperpower && participants.length > 0 && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Users size={16} className="text-blue-400" />
                                <span className="text-white font-medium">Участники</span>
                                <span className="text-white/60 text-sm">({participantCount})</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {participants.slice(0, 5).map((participant, index) => (
                                <motion.div
                                  key={participant.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  onClick={() => onUserProfile(participant.name)}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                  <div className="relative">
                                    <img
                                      src={participant.avatar}
                                      alt={participant.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    {index < 3 && (
                                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                                        index === 0 ? 'bg-yellow-500 text-black' : 
                                        index === 1 ? 'bg-gray-400 text-black' : 'bg-orange-600 text-white'
                                      }`}>
                                        {index + 1}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-white text-sm font-medium truncate">{participant.name}</div>
                                    <div className="text-white/60 text-xs">{participant.bliks} бликов • {participant.energy}% энергии</div>
                                  </div>
                                </motion.div>
                              ))}
                              
                              {participants.length > 5 && (
                                <div className="text-center pt-2">
                                  <button
                                    onClick={() => setActiveTab('community')}
                                    className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                                  >
                                    Показать всех участников ({participants.length})
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Быстрые действия */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('feed')}
                          className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                        >
                          <Zap className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Посмотреть блики</div>
                          <div className="text-sm text-white/60">{feedBliks.length} бликов</div>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('community')}
                          className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-white hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300"
                        >
                          <Users className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Сообщество</div>
                          <div className="text-sm text-white/60">{communityStats.members} участников</div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'feed' && (
                    <div className="pb-6">
                      {filteredContent.length > 0 ? (
                        <div className="space-y-4">
                          {/* Если бликов мало (1-3), показываем вертикально */}
                          {filteredContent.length <= 3 ? (
                            <div className="space-y-4">
                              {/* Блики в вертикальном списке */}
                              {filteredContent.map((blik, index) => (
                                <motion.div
                                  key={blik.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                  className="max-w-lg mx-auto"
                                >
                                  <BlikCard
                                    blik={blik}
                                    layout="feed"
                                    index={index}
                                    onLike={() => onLike(blik.id)}
                                    onComment={() => onComment(blik.id)}
                                    onShare={() => {}}
                                    onBlikDetail={() => onBlikDetail(blik.id)}
                                  />
                                </motion.div>
                              ))}
                              
                              {/* Призыв к действию */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: filteredContent.length * 0.1 }}
                                className="text-center pt-4"
                              >
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={onCreateBlik}
                                  className="energy-button py-3 px-6 rounded-2xl text-white transition-all duration-300 flex items-center mx-auto"
                                >
                                  <Plus size={20} className="mr-2" />
                                  Добавить блик
                                </motion.button>
                              </motion.div>
                            </div>
                          ) : (
                            /* Если бликов много, показываем в сетке с адаптивными колонками */
                            <div className="bliks-grid">
                              {filteredContent.map((blik, index) => (
                                <motion.div
                                  key={blik.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                  <BlikCard
                                    blik={blik}
                                    layout="vertical"
                                    index={index}
                                    onLike={() => onLike(blik.id)}
                                    onComment={() => onComment(blik.id)}
                                    onShare={() => {}}
                                    onBlikDetail={() => onBlikDetail(blik.id)}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="text-4xl mb-4">{emoji}</div>
                          <h3 className="text-white font-semibold text-lg mb-2">Нет результатов поиска</h3>
                          <p className="text-white/60 text-sm">Попробуйте изменить запрос или очистить поиск</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'community' && (
                    <div className="space-y-4 pb-6">
                      {/* Подменю для выбора типа участников и режим просмотра */}
                      <div className="flex items-center justify-between gap-4 p-1 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
                        {/* Вкладки Обладатели / Креаторы */}
                        <div className="flex gap-1 flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setParticipantsSubTab('owners')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              participantsSubTab === 'owners'
                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Crown size={16} />
                            <span>Обладатели</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setParticipantsSubTab('supporters')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              participantsSubTab === 'supporters'
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Users size={16} />
                            <span>Креаторы</span>
                          </motion.button>
                        </div>
                        
                        {/* Переключатель режима просмотра */}
                        <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCommunityViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${
                              communityViewMode === 'grid'
                                ? 'bg-white/20 text-white'
                                : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            <Grid size={16} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCommunityViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${
                              communityViewMode === 'list'
                                ? 'bg-white/20 text-white'
                                : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            <List size={16} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Контент в зависимости от выбранной вкладки */}
                      {!isOwner ? (
                        <div className="space-y-6">
                          {participantsSubTab === 'owners' ? (
                            /* ОБЛАДАТЕЛИ СУПЕРСИЛЫ */
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Crown size={18} className="text-amber-400" />
                                  <h3 className="text-white font-semibold text-lg">Обладатели</h3>
                                  <div className="text-white/50 text-sm bg-white/10 px-2 py-1 rounded-lg">
                                    Те, кто владеет этой суперсилой
                                  </div>
                                </div>
                                <div className="text-amber-300 text-sm font-medium">
                                  {isMegaSuperpower ? participantCount : allCommunityMembers.length} участников
                                </div>
                              </div>
                              
                              {/* Контент обладателей в зависимости от режима просмотра */}
                              {communityViewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {allCommunityMembers.map((member, index) => (
                                    <motion.div
                                      key={`owner-${member.id}`}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300"
                                    >
                                      <div className="flex flex-col items-center text-center gap-3">
                                        {/* Аватар без дополнительной стилизации */}
                                        <div className="relative">
                                          <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                                            onClick={() => onUserProfile(member.id)}
                                          />
                                          {member.isOnline && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-black rounded-full" />
                                          )}
                                        </div>
                                        
                                        {/* Информация об обладателе */}
                                        <div className="space-y-2">
                                          <div className="space-y-1">
                                            <span 
                                              className="text-white font-medium cursor-pointer hover:text-purple-300 transition-colors block"
                                              onClick={() => onUserProfile(member.id)}
                                            >
                                              {member.name}
                                            </span>
                                            <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20 flex items-center gap-1 w-fit mx-auto">
                                              <span>Обладатель</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center justify-center gap-1 text-sm">
                                            <Zap size={12} className="text-purple-400" />
                                            <span className="text-white/80 font-medium">{member.bliks}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {allCommunityMembers.map((member, index) => (
                                    <motion.div
                                      key={`owner-${member.id}`}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* Аватар без дополнительной стилизации */}
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
                                        </div>
                                        
                                        {/* Информация об обладателе */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span 
                                              className="text-white font-medium cursor-pointer hover:text-purple-300 transition-colors"
                                              onClick={() => onUserProfile(member.id)}
                                            >
                                              {member.name}
                                            </span>
                                            <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20 flex items-center gap-1">
                                              <span>Обладатель</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                              <Zap size={12} className="text-purple-400" />
                                              <span className="text-white/80 font-medium">{member.bliks} бликов</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                              <span className="text-white/50 text-xs">●</span>
                                              <span className="text-white/60 text-xs">{member.level || 'Участник'}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </div>

                          ) : (
                            /* КРЕАТОРЫ (те кто поддерживают через блики) */
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Users size={18} className="text-purple-400" />
                                  <h3 className="text-white font-semibold text-lg">Креаторы</h3>
                                  <div className="text-white/50 text-sm bg-white/10 px-2 py-1 rounded-lg">
                                    {ownerProfileType === 'business' ? 'Те, кто поддерживают бизнес-силу через блики' : 'Те, кто поддерживают мегасилу через блики'}
                                  </div>
                                </div>
                                <div className="text-purple-300 text-sm font-medium">
                                  {allCommunityMembers.length * 3} участников
                                </div>
                              </div>

                              {/* Фильтры для креаторов */}
                              <div className="flex gap-2 flex-wrap mb-4">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setCommunityFilter(communityFilter === 'all' ? 'online' : 'all')}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    communityFilter === 'online'
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                                  }`}
                                >
                                  <Filter size={12} className="inline mr-1" />
                                  {communityFilter === 'online' ? 'Только онлайн' : 'Все участники'}
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    const nextSort = communitySortBy === 'rating' ? 'recent' : communitySortBy === 'recent' ? 'activity' : 'rating';
                                    setCommunitySortBy(nextSort);
                                  }}
                                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                  <SortAsc size={12} className="inline mr-1" />
                                  {communitySortBy === 'rating' ? 'По активности' : communitySortBy === 'recent' ? 'По времени' : 'По бликам'}
                                </motion.button>
                              </div>
                              
                              {/* Контент креаторов в зависимости от режима просмотра */}
                              {communityViewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {allCommunityMembers.slice().reverse().map((member, index) => (
                                    <motion.div
                                      key={`supporter-${member.id}`}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300"
                                    >
                                      <div className="flex flex-col items-center text-center gap-3">
                                        {/* Аватар без дополнительной стилизации */}
                                        <div className="relative">
                                          <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                                            onClick={() => onUserProfile(member.id)}
                                          />
                                          {member.isOnline && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-black rounded-full" />
                                          )}
                                        </div>
                                        
                                        {/* Информация о креаторе */}
                                        <div className="space-y-2">
                                          <div className="space-y-1">
                                            <span 
                                              className="text-white font-medium cursor-pointer hover:text-purple-300 transition-colors block"
                                              onClick={() => onUserProfile(member.id)}
                                            >
                                              {member.name}
                                            </span>
                                            <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20 flex items-center gap-1 w-fit mx-auto">
                                              <span>Креатор</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center justify-center gap-1 text-sm">
                                            <Zap size={12} className="text-purple-400" />
                                            <span className="text-white/80 font-medium">{Math.floor(member.bliks * 0.7)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {allCommunityMembers.slice().reverse().map((member, index) => (
                                    <motion.div
                                      key={`supporter-${member.id}`}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300"
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* Аватар без дополнительной стилизации */}
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
                                        </div>
                                        
                                        {/* Информация о креаторе */}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span 
                                              className="text-white font-medium cursor-pointer hover:text-purple-300 transition-colors"
                                              onClick={() => onUserProfile(member.id)}
                                            >
                                              {member.name}
                                            </span>
                                            <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20 flex items-center gap-1">
                                              <span>Креатор</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                              <Zap size={12} className="text-purple-400" />
                                              <span className="text-white/80 font-medium">{Math.floor(member.bliks * 0.7)} бликов</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                              <span className="text-white/50 text-xs">●</span>
                                              <span className="text-white/60 text-xs">{member.level || 'Поддерживает'}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ПЕРСОНАЛЬНАЯ СУПЕРСИЛА - старая логика для личных суперсил */
                        <div className="space-y-4">
                          {/* Фильтры для сообщества */}
                          <div className="flex gap-2 flex-wrap">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCommunityFilter(communityFilter === 'all' ? 'online' : 'all')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                communityFilter === 'online'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                              }`}
                            >
                              <Filter size={12} className="inline mr-1" />
                              {communityFilter === 'online' ? 'Только онлайн' : 'Все участники'}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCommunityFilter(communityFilter === 'experts' ? 'all' : 'experts')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                communityFilter === 'experts'
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                              }`}
                            >
                              <Star size={12} className="inline mr-1" />
                              {communityFilter === 'experts' ? 'Только эксперты' : 'Все уровни'}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const nextSort = communitySortBy === 'rating' ? 'recent' : communitySortBy === 'recent' ? 'activity' : 'rating';
                                setCommunitySortBy(nextSort);
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 transition-colors"
                            >
                              <SortAsc size={12} className="inline mr-1" />
                              {communitySortBy === 'rating' ? 'По рейтингу' : communitySortBy === 'recent' ? 'По времени' : 'По активности'}
                            </motion.button>
                          </div>

                          {/* Список участников */}
                          <div className="space-y-3">
                            {filteredMembers.length > 0 ? (
                              filteredMembers.map((member, index) => (
                                <motion.div
                                  key={member.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                  <CommunityMemberCard
                                    member={member}
                                    layout="list"
                                    onUserProfile={onUserProfile}
                                    index={index}
                                  />
                                </motion.div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="text-4xl mb-4">👥</div>
                                <h3 className="text-white font-semibold text-lg mb-2">Нет участников</h3>
                                <p className="text-white/60 text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'trends' && (
                    <div className="space-y-4 pb-6">
                      <TrendsWidget
                        stats={trendsStats}
                        superpowerName={name}
                        superpowerEmoji={emoji}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ПРАВАЯ КОЛОНКА - дополнительная информация (только на десктопе, компактнее) */}
              <div className="lg:col-span-4 xl:col-span-3 hidden lg:block space-y-4">
                {/* БЛОК О СУПЕРСИЛЕ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative"
                >
                  {/* Кнопка настроек в правом верхнем углу */}
                  {isOwner && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="absolute top-4 right-4 p-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                      title="Настройки"
                    >
                      <Settings size={16} />
                    </motion.button>
                  )}

                  {/* НОВЫЙ КОМПАКТНЫЙ БЛОК УЧАСТНИКОВ (ДЕСКТОП) */}
                  <div className="space-y-4 mb-6">
                    {/* Заголовок суперсилы - в левом углу */}
                    <div>
                      {/* 🎯 АВАТАРКА ВЛАДЕЛЬЦА СЛЕВА ОТ НАЗВАНИЯ (В ЛЕВОМ УГЛУ) */}
                      <div className="flex items-start gap-4 mb-4">
                        {ownerAvatar && (
                          <img
                            src={ownerAvatar}
                            alt={displayOwnerName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/40 cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0"
                            onClick={() => ownerUserId && onUserProfile(ownerUserId)}
                          />
                        )}
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <h1 className="text-white font-bold text-xl mb-1">
                            {name}
                          </h1>
                          <span 
                            className="text-white/80 text-base cursor-pointer hover:text-purple-300 transition-colors duration-200"
                            onClick={() => ownerUserId && onUserProfile(ownerUserId)}
                            title={`Перейти в профиль ${displayOwnerName}`}
                          >
                            {displayOwnerName}
                          </span>
                          <span className="text-white/50 text-sm bg-white/10 px-3 py-1 rounded-full mt-2">{category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Блок О суперсиле - как на скриншоте (ДЕСКТОП) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-4">
                      {/* 3 метрики сверху */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Блики */}
                        <div className="text-center">
                          <Camera className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                          <div className="text-white font-medium text-lg">{bliks}</div>
                          <div className="text-white/50 text-xs">Блики</div>
                        </div>
                        
                        {/* Энергия */}
                        <div className="text-center">
                          <BatteryCharging className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                          <div className="text-white font-medium text-lg">{energy}%</div>
                          <div className="text-white/50 text-xs">Энергия</div>
                        </div>
                        
                        {/* Участники */}
                        <div className="text-center">
                          <Users className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                          <div className="text-white font-medium text-lg">{communityStats.members.toLocaleString()}</div>
                          <div className="text-white/50 text-xs">Участники</div>
                        </div>
                      </div>

                      {/* Уровень энергии с прогресс-баром */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-sm">Уровень энергии</span>
                          <span className="text-white/90 text-sm font-medium">{energy}%</span>
                        </div>
                        <div className="relative w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${energy}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full bg-gradient-to-r ${getEnergyColor(energy)} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Блок Активные участники (отдельно) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                      {/* Заголовок блока */}
                      <div className="text-white/70 text-sm font-medium mb-3">
                        Активные участники
                      </div>
                      
                      {/* Только аватарки без статистики */}
                      <div className="flex -space-x-3">
                        {superpowerBlikers.slice(0, 8).map((member, index) => (
                          <motion.img
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            onClick={() => onUserProfile(member.id)}
                            className="w-10 h-10 rounded-xl border-2 border-white/40 cursor-pointer bg-white/10"
                            style={{ zIndex: 10 - index }}
                            whileHover={{ scale: 1.15, zIndex: 20 }}
                            whileTap={{ scale: 0.95 }}
                            title={member.name}
                          />
                        ))}
                        {superpowerBlikers.length > 8 && (
                          <div className="w-10 h-10 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">+{superpowerBlikers.length - 8}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Кнопки действий в едином стиле */}
                  <div className="space-y-2.5">
                    {/* Основные кнопки действий */}
                    <div className="flex gap-2">
                      {/* Кнопка "Бликнуть" */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onCreateBlik}
                        className="flex-1 energy-button py-2.5 px-3 rounded-xl text-white text-sm transition-all duration-300 flex items-center justify-center"
                      >
                        <Plus size={16} className="mr-1.5" />
                        Бликнуть
                      </motion.button>

                      {/* Кнопка "Поделиться" */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onShare}
                        className="flex-1 backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 py-2.5 px-3 rounded-xl text-sm transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                      >
                        <Share2 size={16} className="mr-1.5" />
                        Поделиться
                      </motion.button>
                    </div>

                    {/* Дополнительная кнопка подписки для чужих суперсил */}
                    {!isOwner && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsSubscribed(!isSubscribed)}
                        className={`w-full py-2.5 px-3 rounded-xl backdrop-blur-xl border transition-all duration-300 text-sm font-medium flex items-center justify-center ${
                          isSubscribed
                            ? 'bg-white/20 border-white/30 text-white shadow-lg'
                            : 'bg-white/10 border-white/20 text-white/80 hover:text-white hover:bg-white/20 hover:shadow-lg'
                        }`}
                        title={isSubscribed ? 'Отписаться' : 'Подписаться'}
                      >
                        {isSubscribed ? <Heart size={16} className="mr-1.5" /> : <UserPlus size={16} className="mr-1.5" />}
                        {isSubscribed ? 'Отписаться' : 'Подписаться'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* АНАЛИТИКА - ПЕРСОНАЛЬНАЯ ИЛИ СООБЩЕСТВА */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {isOwner ? (
                    /* Персональная аналитика для личных суперсил */
                    <PersonalizedTrendsWidget
                      stats={personalizedStats}
                      superpowerName={name}
                      superpowerEmoji={emoji}
                    />
                  ) : (
                    /* Аналитика сообщества для публичных суперсил */
                    <CommunityTrendsWidget
                      superpowerName={name}
                      superpowerEmoji={emoji}
                      ownerProfileType={ownerProfileType}
                      stats={communityStats_detailed}
                    />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальные окна настроек */}
      {isOwner && (
        <SuperpowerSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          superpowerName={name}
          superpowerEmoji={emoji}
          settings={superpowerSettings}
          onSave={handleSaveSettings}
        />
      )}
    </>
  );
}