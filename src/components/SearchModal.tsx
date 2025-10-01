import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, User, Zap, MessageCircle, TrendingUp, Clock, Users, Building2 } from 'lucide-react';
import { BlikData } from './BlikCard';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  name: string;
  status: string;
  avatar: string;
  isOnline: boolean;
  metrics: {
    bliks: number;
    friends: number;
    superpowers: number;
  };
  profileType?: 'personal' | 'business';
  businessInfo?: any;
}

interface Superpower {
  name: string;
  emoji: string;
  bliks: number;
  energy: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  isOwn: boolean;
  ownerName: string;
  ownerAvatar: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  bliks: BlikData[];
  superpowers: Superpower[];
  onUserSelect: (userId: string) => void;
  onBlikSelect: (blikId: string) => void;
  onSuperpowerSelect: (superpowerName: string) => void;
}

type SearchCategory = 'all' | 'users' | 'business' | 'superpowers' | 'bliks';

interface SearchResult {
  id: string;
  type: 'user' | 'business' | 'blik' | 'superpower';
  title: string;
  subtitle?: string;
  avatar?: string;
  emoji?: string;
  metadata?: string;
  isOnline?: boolean;
  data: any;
}

export function SearchModal({
  isOpen,
  onClose,
  users,
  bliks,
  superpowers,
  onUserSelect,
  onBlikSelect,
  onSuperpowerSelect
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Креативность',
    'Алексей Корнеев',
    'Харизма',
    'Мария Смирнова'
  ]);

  // Функция для подсветки найденного текста
  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400/30 text-yellow-200 font-medium">
          {part}
        </span>
      ) : part
    );
  }, []);

  // Создаем объединенные результаты поиска
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Поиск пользователей (личные профили)
    users.forEach(user => {
      if ((user.name && user.name.toLowerCase().includes(query)) || 
          (user.status && user.status.toLowerCase().includes(query))) {
        
        // Проверяем тип профиля (приоритет - поле profileType)
        const isBusiness = user.profileType === 'business' ||
                          user.name === 'NeoTech Solutions' || 
                          user.name.includes('Ltd') || 
                          user.name.includes('Inc') ||
                          user.name.includes('Solutions') ||
                          user.name.includes('Company') ||
                          user.name.includes('Corp') ||
                          user.name === 'Цех85' ||
                          user.name === 'InnovaCorp' ||
                          user.name === 'Pixel Perfect Studio' ||
                          user.name === 'Strategic Minds Ltd' ||
                          user.name === 'FinFlow Solutions';
        
        results.push({
          id: user.id,
          type: isBusiness ? 'business' : 'user',
          title: user.name || '',
          subtitle: user.status || '',
          avatar: user.avatar,
          metadata: isBusiness 
            ? `Бизнес • ${user.metrics?.bliks || 0} бликов • ${user.metrics?.friends || 0} подписчиков`
            : `${user.metrics?.bliks || 0} бликов • ${user.metrics?.friends || 0} друзей`,
          isOnline: user.isOnline,
          data: user
        });
      }
    });

    // Поиск бликов
    bliks.forEach(blik => {
      if ((blik.content && blik.content.toLowerCase().includes(query)) ||
          (blik.superpower?.name && blik.superpower.name.toLowerCase().includes(query)) ||
          (blik.author?.name && blik.author.name.toLowerCase().includes(query))) {
        results.push({
          id: blik.id,
          type: 'blik',
          title: blik.content && blik.content.length > 60 ? blik.content.substring(0, 60) + '...' : blik.content || '',
          subtitle: `${blik.superpower?.emoji || ''} ${blik.superpower?.name || ''} • от ${blik.author?.name || ''}`,
          avatar: blik.author?.avatar,
          metadata: `${blik.likes || 0} лайков • ${blik.comments || 0} комментариев • ${blik.timestamp || ''}`,
          data: blik
        });
      }
    });

    // Поиск суперсил
    superpowers.forEach(superpower => {
      if ((superpower.name && superpower.name.toLowerCase().includes(query)) ||
          (superpower.category && superpower.category.toLowerCase().includes(query))) {
        results.push({
          id: superpower.name || '',
          type: 'superpower',
          title: superpower.name || '',
          subtitle: `Категория: ${superpower.category || ''} • ${superpower.ownerName || ''}`,
          emoji: superpower.emoji,
          avatar: superpower.ownerAvatar,
          metadata: `${superpower.bliks || 0} бликов • энергия ${superpower.energy || 0}%`,
          data: superpower
        });
      }
    });

    return results;
  }, [searchQuery, users, bliks, superpowers]);

  // Фильтруем результаты по категории
  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') return searchResults;
    
    // Правильное маппирование категорий к типам
    const categoryTypeMap = {
      users: 'user',
      business: 'business',
      bliks: 'blik', 
      superpowers: 'superpower'
    };
    
    const targetType = categoryTypeMap[activeCategory as keyof typeof categoryTypeMap];
    return searchResults.filter(result => result.type === targetType);
  }, [searchResults, activeCategory]);

  // Категории для фильтрации
  const categories = useMemo(() => [
    { id: 'all' as const, label: 'Все', icon: Search, count: searchResults.length },
    { id: 'users' as const, label: 'Люди', icon: Users, count: searchResults.filter(r => r.type === 'user').length },
    { id: 'business' as const, label: 'Бизнес', icon: Building2, count: searchResults.filter(r => r.type === 'business').length },
    { id: 'superpowers' as const, label: 'Суперсилы', icon: Zap, count: searchResults.filter(r => r.type === 'superpower').length },
    { id: 'bliks' as const, label: 'Блики', icon: MessageCircle, count: searchResults.filter(r => r.type === 'blik').length }
  ], [searchResults]);

  // Обработчик клика по результату поиска
  const handleResultClick = useCallback((result: SearchResult) => {
    // Добавляем в недавние поиски
    const newRecentSearches = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecentSearches);

    // Показываем уведомление
    const typeNames = { user: 'профиль', business: 'бизнес-профиль', blik: 'блик', superpower: 'суперсила' };
    toast.success(`Открываем ${typeNames[result.type as keyof typeof typeNames]}: ${result.title} ✨`);

    // Переходим к результату
    switch (result.type) {
      case 'user':
      case 'business':
        onUserSelect(result.id);
        break;
      case 'blik':
        onBlikSelect(result.id);
        break;
      case 'superpower':
        onSuperpowerSelect(result.id);
        break;
    }
    
    onClose();
  }, [recentSearches, onUserSelect, onBlikSelect, onSuperpowerSelect, onClose]);

  const handleRecentSearchClick = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} className="text-green-400" />;
      case 'down':
        return <TrendingUp size={12} className="text-red-400 rotate-180" />;
      default:
        return null;
    }
  };

  // Очищаем поиск при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setActiveCategory('all');
      setIsSearching(false);
    }
  }, [isOpen]);

  // Имитация поиска с задержкой для лучшего UX
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Обработка горячих клавиш
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape для закрытия
      if (event.key === 'Escape') {
        onClose();
      }
      
      // Enter для выбора первого результата
      if (event.key === 'Enter' && filteredResults.length > 0) {
        handleResultClick(filteredResults[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, onClose, handleResultClick]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-12"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="
            w-full max-w-2xl mx-4 
            glass-card rounded-2xl 
            shadow-2xl border border-white/20
            max-h-[80vh] overflow-hidden
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок с поиском */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 transition-all duration-300 ${isSearching ? 'animate-pulse' : ''}`} size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск людей, суперсил, бликов..."
                  className="
                    w-full h-12 pl-12 pr-4 
                    bg-white/10 border border-white/20 rounded-xl
                    text-white placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-purple-400/50
                    transition-all duration-300
                  "
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="
                  p-3 rounded-xl
                  bg-white/10 hover:bg-white/20
                  text-white/80 hover:text-white
                  transition-all duration-300
                "
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Счетчик результатов */}
            {searchQuery.trim() && (
              <div className="text-white/60 text-sm mb-3">
                Найдено результатов: <span className="text-white font-medium">{searchResults.length}</span>
              </div>
            )}

            {/* Категории фильтрации */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-medium whitespace-nowrap
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-purple-500/30 text-white border border-purple-400/50' 
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span>{category.label}</span>
                    {category.count > 0 && (
                      <span className={`
                        px-1.5 py-0.5 rounded-full text-xs
                        ${isActive ? 'bg-purple-400/50' : 'bg-white/20'}
                      `}>
                        {category.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Результаты поиска */}
          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {!searchQuery.trim() ? (
              activeCategory === 'all' ? (
                /* Недавние поиски */
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-white/60" />
                    <span className="text-white/80 text-sm font-medium">Недавние поиски</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((query, index) => (
                      <motion.button
                        key={query}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRecentSearchClick(query)}
                        className="
                          px-3 py-2 rounded-lg
                          bg-white/10 hover:bg-white/20
                          text-white/80 hover:text-white
                          text-sm transition-all duration-300
                        "
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Предварительные результаты для выбранной категории */
                <div className="p-2">
                  <div className="p-4 text-center">
                    <div className="text-white/80 text-sm mb-4">
                      {activeCategory === 'business' && 'Популярные бизнес-профили'}
                      {activeCategory === 'users' && 'Популярные пользователи'}
                      {activeCategory === 'superpowers' && 'Популярные суперсилы'}
                      {activeCategory === 'bliks' && 'Недавние блики'}
                    </div>
                  </div>
                  {(() => {
                    // Предварительные результаты для каждой категории
                    if (activeCategory === 'business') {
                      const businessProfiles = [
                        {
                          id: 'neotech-solutions',
                          type: 'business' as const,
                          title: 'NeoTech Solutions',
                          subtitle: 'AI-powered Software Development Company',
                          avatar: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 892 бликов • 156 подписчиков',
                          isOnline: true,
                          data: { profileType: 'business' }
                        },
                        {
                          id: 'tech-startup-1',
                          type: 'business' as const,
                          title: 'InnovaCorp',
                          subtitle: 'Digital Innovation & Consulting',
                          avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 456 бликов • 89 подписчиков',
                          isOnline: false,
                          data: { profileType: 'business' }
                        },
                        {
                          id: 'design-agency-1',
                          type: 'business' as const,
                          title: 'Pixel Perfect Studio',
                          subtitle: 'Creative Design Agency',
                          avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 623 бликов • 234 подписчиков',
                          isOnline: true,
                          data: { profileType: 'business' }
                        },
                        {
                          id: 'consulting-firm-1',
                          type: 'business' as const,
                          title: 'Strategic Minds Ltd',
                          subtitle: 'Business Strategy & Management Consulting',
                          avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 345 бликов • 167 подписчиков',
                          isOnline: false,
                          data: { profileType: 'business' }
                        },
                        {
                          id: 'fintech-startup-1',
                          type: 'business' as const,
                          title: 'FinFlow Solutions',
                          subtitle: 'Financial Technology & Digital Banking',
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 789 бликов • 312 подписчиков',
                          isOnline: true,
                          data: { profileType: 'business' }
                        },
                        {
                          id: 'tsekh85-bakery',
                          type: 'business' as const,
                          title: 'Цех85',
                          subtitle: 'Artisan Bakery & Pastry Shop',
                          avatar: 'https://images.unsplash.com/photo-1653922841869-58867b60d0e1?w=100&h=100&fit=crop&crop=center',
                          metadata: 'Бизнес • 567 бликов • 298 подписчиков',
                          isOnline: true,
                          data: { profileType: 'business' }
                        }
                      ];
                      
                      return businessProfiles.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResultClick(result)}
                          className="
                            relative p-4 rounded-xl cursor-pointer
                            hover:bg-white/10 transition-all duration-300
                            border border-transparent hover:border-white/20
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={result.avatar}
                                alt={result.title}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {result.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pr-20">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white truncate">
                                  {result.title}
                                </h3>
                              </div>
                              <p className="text-white/70 text-sm truncate mb-1">
                                {result.subtitle}
                              </p>
                              <p className="text-white/50 text-xs">
                                {result.metadata}
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-400/40 rounded-md backdrop-blur-sm">
                              <Building2 size={10} className="text-orange-400" />
                              <span className="text-orange-200 text-xs font-medium">Бизнес</span>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    }
                    
                    if (activeCategory === 'users') {
                      const popularUsers = users.slice(0, 5);
                      return popularUsers.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResultClick({
                            id: user.id,
                            type: 'user',
                            title: user.name || '',
                            subtitle: user.status || '',
                            avatar: user.avatar,
                            metadata: `${user.metrics?.bliks || 0} бликов • ${user.metrics?.friends || 0} друзей`,
                            isOnline: user.isOnline,
                            data: user
                          })}
                          className="
                            relative p-4 rounded-xl cursor-pointer
                            hover:bg-white/10 transition-all duration-300
                            border border-transparent hover:border-white/20
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pr-20">
                              <h3 className="font-medium text-white truncate mb-1">
                                {user.name}
                              </h3>
                              <p className="text-white/70 text-sm truncate mb-1">
                                {user.status}
                              </p>
                              <p className="text-white/50 text-xs">
                                {user.metrics?.bliks || 0} бликов • {user.metrics?.friends || 0} друзей
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-400/40 rounded-md backdrop-blur-sm">
                              <User size={10} className="text-blue-400" />
                              <span className="text-blue-200 text-xs font-medium">Пользователь</span>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    }
                    
                    if (activeCategory === 'superpowers') {
                      const popularSuperpowers = superpowers.slice(0, 5);
                      return popularSuperpowers.map((superpower, index) => (
                        <motion.div
                          key={superpower.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResultClick({
                            id: superpower.name || '',
                            type: 'superpower',
                            title: superpower.name || '',
                            subtitle: `Категория: ${superpower.category || ''} • ${superpower.ownerName || ''}`,
                            emoji: superpower.emoji,
                            avatar: superpower.ownerAvatar,
                            metadata: `${superpower.bliks || 0} бликов • энергия ${superpower.energy || 0}%`,
                            data: superpower
                          })}
                          className="
                            relative p-4 rounded-xl cursor-pointer
                            hover:bg-white/10 transition-all duration-300
                            border border-transparent hover:border-white/20
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
                              {superpower.emoji}
                            </div>
                            <div className="flex-1 min-w-0 pr-20">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-white truncate">
                                  {superpower.name}
                                </h3>
                                {superpower.trend && getTrendIcon(superpower.trend)}
                              </div>
                              <p className="text-white/70 text-sm truncate mb-1">
                                Категория: {superpower.category} • {superpower.ownerName}
                              </p>
                              <p className="text-white/50 text-xs">
                                {superpower.bliks} бликов • энергия {superpower.energy}%
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-400/40 rounded-md backdrop-blur-sm">
                              <Zap size={10} className="text-yellow-400" />
                              <span className="text-yellow-200 text-xs font-medium">Суперсила</span>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    }
                    
                    if (activeCategory === 'bliks') {
                      const recentBliks = bliks.slice(0, 5);
                      return recentBliks.map((blik, index) => (
                        <motion.div
                          key={blik.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResultClick({
                            id: blik.id,
                            type: 'blik',
                            title: blik.content && blik.content.length > 60 ? blik.content.substring(0, 60) + '...' : blik.content || '',
                            subtitle: `${blik.superpower?.emoji || ''} ${blik.superpower?.name || ''} • от ${blik.author?.name || ''}`,
                            avatar: blik.author?.avatar,
                            metadata: `${blik.likes || 0} лайков • ${blik.comments || 0} комментариев • ${blik.timestamp || ''}`,
                            data: blik
                          })}
                          className="
                            relative p-4 rounded-xl cursor-pointer
                            hover:bg-white/10 transition-all duration-300
                            border border-transparent hover:border-white/20
                          "
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={blik.author?.avatar}
                              alt={blik.author?.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0 pr-20">
                              <h3 className="font-medium text-white truncate mb-1">
                                {blik.content && blik.content.length > 60 ? blik.content.substring(0, 60) + '...' : blik.content}
                              </h3>
                              <p className="text-white/70 text-sm truncate mb-1">
                                {blik.superpower?.emoji} {blik.superpower?.name} • от {blik.author?.name}
                              </p>
                              <p className="text-white/50 text-xs">
                                {blik.likes} лайков • {blik.comments} комментариев • {blik.timestamp}
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/40 rounded-md backdrop-blur-sm">
                              <MessageCircle size={10} className="text-green-400" />
                              <span className="text-green-200 text-xs font-medium">Блик</span>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    }
                    
                    return null;
                  })()}
                </div>
              )
            ) : isSearching ? (
              /* Индикатор загрузки */
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full mx-auto mb-4"
                />
                <p className="text-white/60 text-sm">Ищем...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              /* Результаты поиска */
              <div className="p-2">
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResultClick(result)}
                    className="
                      relative p-4 rounded-xl cursor-pointer
                      hover:bg-white/10 transition-all duration-300
                      border border-transparent hover:border-white/20
                    "
                  >
                    <div className="flex items-center gap-3">
                      {/* Аватар/Эмодзи */}
                      <div className="relative">
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
                            {result.emoji}
                          </div>
                        )}
                        
                        {/* Индикатор онлайн */}
                        {result.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                        )}
                      </div>

                      {/* Контент */}
                      <div className="flex-1 min-w-0 pr-20">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate">
                            {highlightText(result.title, searchQuery)}
                          </h3>
                          
                          {/* Тренд для суперсил */}
                          {result.type === 'superpower' && result.data.trend && (
                            getTrendIcon(result.data.trend)
                          )}
                        </div>
                        
                        {result.subtitle && (
                          <p className="text-white/70 text-sm truncate mb-1">
                            {highlightText(result.subtitle, searchQuery)}
                          </p>
                        )}
                        
                        {result.metadata && (
                          <p className="text-white/50 text-xs">
                            {result.metadata}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Тег типа контента снизу справа */}
                    <div className="absolute bottom-3 right-3">
                      {result.type === 'user' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-400/40 rounded-md backdrop-blur-sm">
                          <User size={10} className="text-blue-400" />
                          <span className="text-blue-200 text-xs font-medium">Пользователь</span>
                        </div>
                      )}
                      {result.type === 'business' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-400/40 rounded-md backdrop-blur-sm">
                          <Building2 size={10} className="text-orange-400" />
                          <span className="text-orange-200 text-xs font-medium">Бизнес</span>
                        </div>
                      )}
                      {result.type === 'blik' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/40 rounded-md backdrop-blur-sm">
                          <MessageCircle size={10} className="text-green-400" />
                          <span className="text-green-200 text-xs font-medium">Блик</span>
                        </div>
                      )}
                      {result.type === 'superpower' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-400/40 rounded-md backdrop-blur-sm">
                          <Zap size={10} className="text-yellow-400" />
                          <span className="text-yellow-200 text-xs font-medium">Суперсила</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Пустые результаты */
              <div className="p-12 text-center">
                <Search size={48} className="text-white/30 mx-auto mb-4" />
                <h3 className="text-white/80 font-medium mb-2">Ничего не найдено</h3>
                <p className="text-white/60 text-sm">
                  Попробуй изменить запрос или поискать что-то другое
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}