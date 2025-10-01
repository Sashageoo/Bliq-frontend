import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  MessageCircle, 
  UserPlus, 
  Bell, 
  MoreVertical,
  Building2, 
  MapPin, 
  Globe, 
  Star,
  Heart,
  MessageSquare,
  Share,
  Calendar,
  Megaphone,
  Sparkles,
  Users,
  Zap,
  CheckCircle,
  Crown,
  Clock,
  AlertCircle,
  Camera,
  Video,
  FileText,
  TrendingUp,
  Award,
  Gift,
  Search,
  Menu
} from 'lucide-react';
import { BlikCard } from './BlikCard';

export interface BusinessUser {
  id: string;
  name: string;
  status: string;
  location: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  isOnline: boolean;
  profileType: 'business';
  businessInfo: {
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
    friends: number; // Это будет "Клиенты" в UI
    superpowers: number;
  };
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
}

interface BusinessProfileScreenProps {
  user: BusinessUser;
  userBliks: any[];
  onBack: () => void;
  onChat: () => void;
  onAddFriend: () => void; // В бизнес-контексте это "Подписаться"
  onSubscribe: () => void;
  onShare: () => void;
  onSuperpowerClick: (superpowerName: string) => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShareBlik: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onUserProfile: (userId: string) => void;
  onViewFriends: () => void; // В бизнес-контексте это "Клиенты"
  onViewSuperpowersMap: () => void;
  onCreateBlik: () => void;
  onViewPersonalSite?: () => void;
  onSidebar?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
}

// Объединяем табы и фильтры в одну навигацию
type UnifiedTab = 'all' | 'photo' | 'video' | 'text' | 'news' | 'events';

export function BusinessProfileScreen({
  user,
  userBliks,
  onBack,
  onChat,
  onAddFriend,
  onSubscribe,
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
  onViewPersonalSite,
  onSidebar,
  onSearch,
  onNotifications
}: BusinessProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<UnifiedTab>('all');
  const [showFullBio, setShowFullBio] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Моковые данные для разных вкладок
  const updateItems = [
    {
      id: '1',
      title: 'Новое меню весна 2025',
      content: 'Представляем новую коллекцию авторских булочек с сезонными ингредиентами',
      image: 'https://images.unsplash.com/photo-1733754348873-feeb45df3bab?w=400&h=300&fit=crop',
      date: '2 дня назад',
      likes: 45,
      comments: 12,
      isHot: true
    },
    {
      id: '2', 
      title: 'Открытие второй пекарни',
      content: 'Мы рады сообщить об открытии нашей второй точки в центре города!',
      image: 'https://images.unsplash.com/photo-1653922841869-58867b60d0e1?w=400&h=300&fit=crop',
      date: '1 неделя назад',
      likes: 127,
      comments: 28,
      isHot: false
    }
  ];



  const events = [
    {
      id: '1',
      title: 'Мастер-класс по выпечке',
      description: 'Учимся печь круассаны как профессионалы',
      date: '15 марта',
      time: '14:00',
      price: '₽ 2500',
      image: 'https://images.unsplash.com/photo-1641394535269-dbea1fa94ff1?w=400&h=300&fit=crop',
      spots: '8 мест',
      totalSpots: 12,
      daysLeft: 3,
      isUrgent: true
    },
    {
      id: '2',
      title: 'Дегустация новых сортов хлеба',
      description: 'Попробуйте наши новые рецепты первыми',
      date: '22 марта',
      time: '18:00',
      price: 'Бесплатно',
      image: 'https://images.unsplash.com/photo-1679673987713-54f809ce417d?w=400&h=300&fit=crop',
      spots: '20 мест',
      totalSpots: 25,
      daysLeft: 10,
      isUrgent: false
    }
  ];



  // Подсчёт бликов по типам
  const blikCounts = useMemo(() => {
    return {
      all: userBliks.length,
      photo: userBliks.filter(b => b.type === 'photo').length,
      video: userBliks.filter(b => b.type === 'video').length,
      text: userBliks.filter(b => b.type === 'text').length
    };
  }, [userBliks]);

  // Фильтрация бликов по типу
  const filteredBliks = useMemo(() => {
    if (activeTab === 'all') {
      return userBliks;
    }
    if (activeTab === 'photo' || activeTab === 'video' || activeTab === 'text') {
      return userBliks.filter(blik => blik.type === activeTab);
    }
    return [];
  }, [userBliks, activeTab]);

  // Объединённая навигация: фильтры бликов + новости + события
  const unifiedTabs = [
    { id: 'all' as UnifiedTab, label: 'Все', icon: Sparkles, count: blikCounts.all, type: 'blik' },
    { id: 'photo' as UnifiedTab, label: 'Фото', icon: Camera, count: blikCounts.photo, type: 'blik' },
    { id: 'video' as UnifiedTab, label: 'Видео', icon: Video, count: blikCounts.video, type: 'blik' },
    { id: 'text' as UnifiedTab, label: 'Текст', icon: FileText, count: blikCounts.text, type: 'blik' },
    { id: 'news' as UnifiedTab, label: 'Новости', icon: Megaphone, count: updateItems.length, type: 'other' },
    { id: 'events' as UnifiedTab, label: 'События', icon: Calendar, count: events.length, type: 'other' }
  ];

  const renderTabContent = () => {
    // Если это таб с бликами (all, photo, video, text)
    if (activeTab === 'all' || activeTab === 'photo' || activeTab === 'video' || activeTab === 'text') {
      return (
        <div className="space-y-4">
          {/* Лента бликов в адаптивной сетке */}
          {filteredBliks.length > 0 ? (
            <div className="bliks-grid">
              {filteredBliks.map((blik, index) => (
                <motion.div
                  key={blik.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlikCard
                    blik={blik}
                    onLike={onLike}
                    onComment={onComment}
                    onShare={onShareBlik}
                    onUserProfile={onUserProfile}
                    onBlikDetail={onBlikDetail}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              {activeTab === 'photo' && <Camera size={40} className="text-blue-400/30 mx-auto mb-4 sm:hidden" />}
              {activeTab === 'photo' && <Camera size={48} className="text-blue-400/30 mx-auto mb-4 hidden sm:block" />}
              {activeTab === 'video' && <Video size={40} className="text-orange-400/30 mx-auto mb-4 sm:hidden" />}
              {activeTab === 'video' && <Video size={48} className="text-orange-400/30 mx-auto mb-4 hidden sm:block" />}
              {activeTab === 'text' && <FileText size={40} className="text-green-400/30 mx-auto mb-4 sm:hidden" />}
              {activeTab === 'text' && <FileText size={48} className="text-green-400/30 mx-auto mb-4 hidden sm:block" />}
              {activeTab === 'all' && <Sparkles size={40} className="text-white/30 mx-auto mb-4 sm:hidden" />}
              {activeTab === 'all' && <Sparkles size={48} className="text-white/30 mx-auto mb-4 hidden sm:block" />}
              <h3 className="text-white/70 text-base sm:text-lg mb-2">
                {activeTab === 'all' ? 'Пока нет бликов' : 
                 activeTab === 'photo' ? 'Нет фото-бликов' :
                 activeTab === 'video' ? 'Нет видео-бликов' :
                 'Нет текстовых бликов'}
              </h3>
              <p className="text-white/50 text-sm sm:text-base max-w-sm mx-auto">
                Блики покажут здесь отзывы и впечатления клиентов об этом бизнесе
              </p>
            </div>
          )}
        </div>
      );
    }

    // Новости
    if (activeTab === 'news') {
        return (
          <div className="bliks-grid">
            {updateItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-3 sm:p-4 relative"
              >
                {/* Маркер "горячих" новостей */}
                {item.isHot && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <Zap size={10} />
                      <span className="hidden sm:inline">Горячо</span>
                      <span className="sm:hidden">🔥</span>
                    </div>
                  </div>
                )}
                
                {/* Адаптивная раскладка обновлений */}
                <div className="flex gap-3 sm:gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white mb-1 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-white/70 text-xs sm:text-sm mb-2 line-clamp-2">{item.content}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white/50 text-xs flex-shrink-0">{item.date}</span>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Heart size={10} className="sm:hidden" />
                          <Heart size={12} className="hidden sm:block" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={10} className="sm:hidden" />
                          <MessageSquare size={12} className="hidden sm:block" />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
    }

    // События
    if (activeTab === 'events') {
      return (
          <div className="bliks-grid">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-3 sm:p-4 relative"
              >
                {/* Индикаторы срочности */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                  {event.isUrgent && (
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <AlertCircle size={10} />
                      <span>🔥 Осталось {event.spots}</span>
                    </div>
                  )}
                  {event.daysLeft <= 7 && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock size={10} />
                      <span>⏰ До старта {event.daysLeft} дн.</span>
                    </div>
                  )}
                </div>
                
                {/* Адаптивная раскладка событий */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg object-cover sm:flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white mb-1 text-sm sm:text-base pr-20 sm:pr-0">{event.title}</h3>
                    <p className="text-white/70 text-xs sm:text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    {/* Информация о событии - адаптивная сетка */}
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={12} className="text-purple-400 sm:hidden" />
                        <Calendar size={14} className="text-purple-400 hidden sm:block" />
                        <span className="text-white/80 truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Clock size={12} className="text-blue-400 sm:hidden" />
                        <Clock size={14} className="text-blue-400 hidden sm:block" />
                        <span className="text-white/80 truncate">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-green-400 font-medium truncate">{event.price}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Users size={12} className="text-blue-400 sm:hidden" />
                        <Users size={14} className="text-blue-400 hidden sm:block" />
                        <span className="text-white/80 truncate">{event.spots}</span>
                      </div>
                    </div>
                    
                    {/* Кнопки действий */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:from-purple-700 hover:to-purple-800 transition-all">
                        Записаться
                      </button>
                      <button 
                        onClick={() => {
                          // Логика добавления в календарь
                          const startDate = new Date();
                          const title = encodeURIComponent(event.title);
                          const details = encodeURIComponent(event.description);
                          const location = encodeURIComponent(user.location);
                          
                          const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${details}&location=${location}`;
                          window.open(calendarUrl, '_blank');
                        }}
                        className="px-3 py-2 glass-card border border-white/20 text-white rounded-lg text-xs sm:text-sm hover:border-white/40 transition-all flex items-center gap-1"
                      >
                        <Calendar size={14} />
                        <span className="hidden sm:inline">В календарь</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
    }

    return null;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-indigo-900/40 overflow-x-hidden w-full">
      {/* 🎨 HERO СЕКЦИЯ С НАЕЗДОМ СТАТИСТИКИ */}
      <div className="relative pb-28 sm:pb-24 w-full">
        {/* Стильный фоновый градиент - ПОЛНАЯ ШИРИНА БЕЗ PADDING */}
        <div 
          className="h-48 sm:h-56 md:h-64 bg-cover bg-center relative w-full"
          style={{ 
            backgroundImage: `url(${user.backgroundImage})`,
            filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
            width: '100vw',
            marginLeft: '0',
            marginRight: '0'
          }}
        >
          {/* Энергетический градиент-overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-purple-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/15" />
          
          {/* Навигация в стиле суперсил */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4 z-20">
            <motion.button
              onClick={onBack}
              className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
            </motion.button>
            
            <div className="flex items-center gap-2">
              {/* Кнопка поиска */}
              {onSearch && (
                <motion.button
                  onClick={onSearch}
                  className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={18} />
                </motion.button>
              )}
              
              {/* Кнопка уведомлений */}
              {onNotifications && (
                <motion.button
                  onClick={onNotifications}
                  className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300 relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell size={18} />
                  {/* Уведомление badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border border-slate-900" />
                </motion.button>
              )}
              
              {/* Кнопка сайдбара */}
              {onSidebar && (
                <motion.button
                  onClick={onSidebar}
                  className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu size={18} />
                </motion.button>
              )}
              
              {/* Кнопка Share (оставляем старую) */}
              <motion.button
                onClick={onShare}
                className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={18} />
              </motion.button>
              <motion.button
                className="p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-black/70 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreVertical size={18} />
              </motion.button>
            </div>
          </div>
          
          {/* 🎯 ИНФОРМАЦИЯ О БИЗНЕСЕ - НАЗВАНИЕ, ИНДУСТРИЯ И РЕГИОН */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex items-end gap-3 sm:gap-4">
              {/* Business Avatar */}
              <div className="relative flex-shrink-0">
                <div className="p-0.5 sm:p-1 rounded-xl bg-gradient-to-br from-orange-400 via-yellow-500 to-orange-600">
                  <img
                    src={user.avatar}
                    alt={user.businessInfo.companyName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-white/10"
                  />
                </div>
                {user.businessInfo.verified && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-500 rounded-full p-0.5 sm:p-1">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* Business Details */}
              <div className="flex-1 mb-1 min-w-0">
                <div className="flex items-start gap-2 mb-0.5">
                  <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {user.businessInfo.companyName}
                  </h1>
                  <div className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30 text-orange-200 border border-orange-400/50 px-1 py-1 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star size={12} className="fill-orange-300 text-orange-300" />
                  </div>
                </div>
                
                <p className="text-white/90 text-xs line-clamp-1 mb-0.5">
                  {user.businessInfo.industry}
                </p>
                
                {/* Регион под названием профиля */}
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <MapPin size={10} />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 📊 СТАТИСТИКА С НАЕЗДОМ НА ШАПКУ - ОПУЩЕНА НИЖЕ */}
        <div className="absolute left-0 right-0 px-4" style={{ bottom: '36px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 max-w-md mx-auto"
          >
            {/* Суперсилы */}
            <motion.div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onViewSuperpowersMap}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-3 hover:bg-white/15 hover:border-purple-400/30 transition-all duration-300 group relative overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-purple-400/30 to-pink-400/20" />
                <div className="relative z-10 mb-1">
                  <Zap size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                </div>
                <div className="relative z-10 text-white font-bold text-xs sm:text-sm">
                  {user.metrics.superpowers}
                </div>
              </motion.button>
              <div className="text-white/70 text-xs mt-1.5">Суперсилы</div>
            </motion.div>

            {/* Блики */}
            <motion.div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveTab('bliks')}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-3 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-300 group relative overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-blue-400/30 to-cyan-400/20" />
                <div className="relative z-10 mb-1">
                  <Sparkles size={14} className="text-blue-400 sm:w-4 sm:h-4" />
                </div>
                <div className="relative z-10 text-white font-bold text-xs sm:text-sm">
                  {user.metrics.bliks}
                </div>
              </motion.button>
              <div className="text-white/70 text-xs mt-1.5">Блики</div>
            </motion.div>

            {/* Клиенты */}
            <motion.div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onViewFriends}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-3 hover:bg-white/15 hover:border-green-400/30 transition-all duration-300 group relative overflow-hidden w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-green-400/30 to-emerald-400/20" />
                <div className="relative z-10 mb-1">
                  <Users size={14} className="text-green-400 sm:w-4 sm:h-4" />
                </div>
                <div className="relative z-10 text-white font-bold text-xs sm:text-sm">
                  {user.metrics.friends}
                </div>
              </motion.button>
              <div className="text-white/70 text-xs mt-1.5">Клиенты</div>
            </motion.div>
          </motion.div>
        </div>
      </div>



      {/* 👥 ФИД БЛИКЕРОВ */}
      <div className="px-4 pb-3">
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {/* Простая сетка аватарок без рамок */}
          <div className="grid grid-cols-4 gap-3">
            {userBliks && userBliks.length > 0 ? (
              // Если есть реальные блики, показываем уникальных авторов
              [...new Map(userBliks.map(blik => [blik.author.name, blik])).values()]
                .slice(0, 4)
                .map((blik, index) => (
                  <motion.div
                    key={blik.author.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => onUserProfile(blik.author.name)}
                  >
                    {/* Аватарка */}
                    <div className="relative mb-2">
                      <img 
                        src={blik.author.avatar} 
                        alt={blik.author.name}
                        className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      {/* Онлайн статус */}
                      {blik.author.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Имя */}
                    <div className="text-center">
                      <div className="text-white text-xs font-medium truncate w-full mb-0.5">
                        {blik.author.name.split(' ')[0]}
                      </div>
                      {/* Суперсила */}
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs">{blik.superpower.emoji}</span>
                        <span className="text-white/60 text-xs truncate max-w-16">
                          {blik.superpower.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              // Имитация для красоты, если никто не бликовал
              [
                { name: 'Анна М.', fullName: 'Анна Михайлова', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', superpower: 'Мастерство пекарей', emoji: '👨‍🍳', time: '1 час назад', isOnline: true },
                { name: 'Михаил П.', fullName: 'Михаил Петров', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', superpower: 'Семейные традиции', emoji: '💜', time: '2 часа назад', isOnline: false },
                { name: 'Екатерина Л.', fullName: 'Екатерина Лебедева', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', superpower: 'Клиентский сервис', emoji: '⚡', time: '3 часа назад', isOnline: true },
                { name: 'Владимир С.', fullName: 'Владимир Семенов', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face', superpower: 'Свежесть продукции', emoji: '🌟', time: '4 часа назад', isOnline: true }
              ].map((user, index) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => onUserProfile(user.fullName)}
                >
                  {/* Аватарка */}
                  <div className="relative mb-2">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    {/* Онлайн статус */}
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Имя */}
                  <div className="text-center">
                    <div className="text-white text-xs font-medium truncate w-full mb-0.5">
                      {user.name}
                    </div>
                    {/* Суперсила */}
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs">{user.emoji}</span>
                      <span className="text-white/60 text-xs truncate max-w-16">
                        {user.superpower.length > 8 ? user.superpower.substring(0, 8) + '...' : user.superpower}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* 💎 КОМПАКТНАЯ КАРТА ЦЕННОСТИ (КАРГОРИО��ОГИЯ) - как на макете */}
      <div className="px-4 pb-4">
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <div className="glass-card rounded-2xl p-4 border-2 border-purple-400/30 relative overflow-hidden">
            {/* Энергетический фон */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent opacity-60" />
            
            <div className="relative z-10">
              {/* Заголовок */}
              <div className="flex items-center mb-3">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Award size={16} className="text-purple-400" />
                  <span>Карта ценности</span>
                </h3>
              </div>

              {/* Основной контент - 2 колонки */}
              <div className="flex gap-4 items-center">
                {/* Левая колонка - Круговая диаграмма */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24">
                    {/* Круговая диаграмма через SVG */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Фон круга */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      {/* Прогресс */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#energyGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${((user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length) / 100) * 251.2} 251.2`}
                        className="transition-all duration-1000"
                      />
                      {/* Градиент для круга */}
                      <defs>
                        <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Центральный текст */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-white font-bold text-lg leading-none">
                        {Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length)}%
                      </div>
                      <div className="text-white/50 text-xs">Ценность</div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка - Топ метрики */}
                <div className="flex-1 space-y-2">
                  {user.topSuperpowers.slice(0, 3).map((sp, index) => (
                    <button 
                      key={index}
                      onClick={() => onSuperpowerClick(sp.name)}
                      className="w-full flex items-center justify-between group hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-base">{sp.emoji}</span>
                        <span className="text-white/90 text-xs font-medium truncate">{sp.name}</span>
                      </div>
                      <span className={`font-bold text-sm ml-2 flex-shrink-0 ${
                        sp.energy >= 80 ? 'text-green-400' :
                        sp.energy >= 60 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {sp.energy}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Нижняя строка - статистика */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-white/70">
                  <TrendingUp size={12} className="text-green-400" />
                  <span>Блики за неделю:</span>
                  <span className="text-green-400 font-semibold">+{Math.round(user.metrics.bliks * 0.2)}</span>
                </div>
                <div className="text-white/70">
                  энергия <span className="text-purple-400 font-semibold">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📸 УПРОЩЁННАЯ ОБЪЕДИНЁННАЯ НАВИГАЦИЯ */}
      <div className="px-4 pb-4">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {unifiedTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-center transition-all duration-300 group flex items-center gap-2 whitespace-nowrap ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-purple-500/30 border border-purple-400/50' 
                        : 'glass-card border-0 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: isActive ? 1.02 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Энергетическое свечение для активной вкладки */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/15 via-pink-400/10 to-purple-400/15 rounded-xl opacity-50" />
                    )}
                    
                    {/* Иконка и текст */}
                    <div className={`flex items-center gap-2 relative z-10 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-white/70 group-hover:text-white'
                    }`}>
                      <Icon size={16} />
                      <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                          isActive 
                            ? 'bg-purple-500/40 text-white' 
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* СТАРЫЕ ФИЛЬТРЫ - УДАЛЯЕМ */}
      {false && activeTab === 'all' && (
        <div className="px-4 pb-4">
          <motion.div 
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            <div className="grid grid-cols-4 gap-2">
              {/* Все */}
              <motion.button
                onClick={() => setBlikFilter('all')}
                className={`relative overflow-hidden rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-2 text-white group transition-all duration-300 ${
                  blikFilter === 'all' 
                    ? 'bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-purple-500/30 border border-purple-400/50' 
                    : 'glass-card border-0 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {blikFilter === 'all' && (
                  <div className="absolute inset-0 rounded-xl opacity-50 transition-opacity bg-gradient-to-br from-purple-400/20 via-pink-400/10 to-purple-400/20" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-medium">Все</span>
                  <span className="text-[10px] text-white/60">{blikCounts.all}</span>
                </div>
              </motion.button>

              {/* Фото */}
              <motion.button
                onClick={() => setBlikFilter('photo')}
                className={`relative overflow-hidden rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-2 text-white group transition-all duration-300 ${
                  blikFilter === 'photo' 
                    ? 'bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-blue-500/30 border border-blue-400/50' 
                    : 'glass-card border-0 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {blikFilter === 'photo' && (
                  <div className="absolute inset-0 rounded-xl opacity-50 transition-opacity bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-blue-400/20" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <Camera className="w-4 h-4" />
                  <span className="text-xs font-medium">Фото</span>
                  <span className="text-[10px] text-white/60">{blikCounts.photo}</span>
                </div>
              </motion.button>

              {/* Видео */}
              <motion.button
                onClick={() => setBlikFilter('video')}
                className={`relative overflow-hidden rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-2 text-white group transition-all duration-300 ${
                  blikFilter === 'video' 
                    ? 'bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-500/30 border border-orange-400/50' 
                    : 'glass-card border-0 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {blikFilter === 'video' && (
                  <div className="absolute inset-0 rounded-xl opacity-50 transition-opacity bg-gradient-to-br from-orange-400/20 via-amber-400/10 to-orange-400/20" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <Video className="w-4 h-4" />
                  <span className="text-xs font-medium">Видео</span>
                  <span className="text-[10px] text-white/60">{blikCounts.video}</span>
                </div>
              </motion.button>

              {/* Текст */}
              <motion.button
                onClick={() => setBlikFilter('text')}
                className={`relative overflow-hidden rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-2 text-white group transition-all duration-300 ${
                  blikFilter === 'text' 
                    ? 'bg-gradient-to-r from-green-500/30 via-emerald-500/20 to-green-500/30 border border-green-400/50' 
                    : 'glass-card border-0 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {blikFilter === 'text' && (
                  <div className="absolute inset-0 rounded-xl opacity-50 transition-opacity bg-gradient-to-br from-green-400/20 via-emerald-400/10 to-green-400/20" />
                )}
                <div className="relative z-10 flex flex-col items-center justify-center gap-0.5">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-medium">Текст</span>
                  <span className="text-[10px] text-white/60">{blikCounts.text}</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tab Content - Адаптивный контент */}
      <div className="px-4 pb-8">
        {/* Контейнер с максимальной шириной для десктопов */}
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Простой отступ снизу */}
      <div className="pb-24"></div>
    </div>
  );
}