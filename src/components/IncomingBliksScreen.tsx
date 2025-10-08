import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, Heart, MessageCircle, Calendar, TrendingUp, Settings, ArrowUp, ChevronLeft, ChevronRight, Filter, Bell, Search } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { BlikData } from './BlikCard';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

interface IncomingBliksScreenProps {
  incomingBliks: BlikData[];
  declinedBliks: BlikData[];
  onAccept: (blikId: string) => void;
  onDecline: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onOpenSettings: () => void;
  userSuperpowers: Array<{ name: string; emoji: string; energy: number }>;
  onSidebar: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  unreadNotificationsCount?: number;
}

type Tab = 'incoming' | 'sending' | 'declined';
type FilterType = 'all' | 'photo' | 'video' | 'text';

// Система категорий суперсил (7 категорий Bliq)
const SUPERPOWER_CATEGORIES = {
  'Flow': { emoji: '🌊', name: 'Flow' },
  'Soul': { emoji: '💜', name: 'Soul' },
  'Mind': { emoji: '🧠', name: 'Mind' },
  'Crew': { emoji: '👥', name: 'Crew' },
  'Body': { emoji: '💪', name: 'Body' },
  'Style': { emoji: '🎨', name: 'Style' },
  'Drive': { emoji: '⚡', name: 'Drive' }
};

export function IncomingBliksScreen({
  incomingBliks,
  declinedBliks,
  onAccept,
  onDecline,
  onBlikDetail,
  onOpenSettings,
  userSuperpowers,
  onSidebar,
  onSearch,
  onNotifications,
  unreadNotificationsCount = 0
}: IncomingBliksScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('incoming');
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showImpactPreview, setShowImpactPreview] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false); // Новое состояние для показа/скрытия фильтров

  // Генерируем календарь (7 дней назад до сегодня)
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }, []);

  // Фильтрация бликов
  const filteredBliks = useMemo(() => {
    let bliks = activeTab === 'incoming' ? incomingBliks : 
                activeTab === 'declined' ? declinedBliks :
                []; // TODO: добавить исходящие блики

    // Фильтр по типу
    if (filter !== 'all') {
      bliks = bliks.filter(blik => blik.type === filter);
    }

    // Фильтр по категории
    if (categoryFilter) {
      bliks = bliks.filter(blik => {
        // Определяем категорию по суперсиле
        const superpowerName = blik.superpower.name;
        // TODO: добавить мап��инг суперсил на категории
        return true;
      });
    }

    // Фильтр по дате
    if (showCalendar) {
      bliks = bliks.filter(blik => {
        // TODO: добавить сравнение дат когда у бликов будут реальные даты
        return true;
      });
    }

    return bliks;
  }, [activeTab, filter, categoryFilter, showCalendar, selectedDate, incomingBliks, declinedBliks]);

  // Расчет влияния блика на суперсилу
  const calculateImpact = (blik: BlikData) => {
    const superpower = userSuperpowers.find(sp => sp.name === blik.superpower.name);
    const baseImpact = 5; // Базовое увеличение энергии
    const currentEnergy = superpower?.energy || 0;
    const newEnergy = Math.min(100, currentEnergy + baseImpact);
    
    return {
      energyIncrease: baseImpact,
      currentEnergy,
      newEnergy,
      percentageChange: ((baseImpact / (currentEnergy || 1)) * 100).toFixed(1)
    };
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen pb-20">
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

      {/* Шапка с вкладками и фильтрами - ПРОЗРАЧНАЯ БЕЗ ФОНА */}
      <div className="sticky top-[108px] z-40">
        <div className="px-4 py-4 space-y-4">
          {/* Фильтры и настройки */}
          <div className="flex items-center justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                showFilters 
                  ? 'bg-purple-500/30 border border-purple-400/50' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Filter className="w-5 h-5 text-white/80" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <Settings className="w-5 h-5 text-white/80" />
            </motion.button>
          </div>

          {/* Вкладки */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'incoming' as Tab, label: 'Входящие', count: incomingBliks.length },
              { id: 'sending' as Tab, label: 'Отправленные', count: 0 },
              { id: 'declined' as Tab, label: 'Отклоненные', count: declinedBliks.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 backdrop-blur-md ${ 
                  activeTab === tab.id
                    ? 'bg-[#54347F] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-purple-400/50' : 'bg-white/20'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Расширенные фильтры (показываются только при клике на кнопку) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-3 overflow-hidden"
              >
                {/* Календарь */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all backdrop-blur-md ${
                      showCalendar
                        ? 'bg-[#54347F] text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(selectedDate)}</span>
                  </button>
                  
                  <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {calendarDays.map((date, index) => {
                      const isSelected = date.toDateString() === selectedDate.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowCalendar(true);
                          }}
                          className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all backdrop-blur-md ${
                            isSelected
                              ? 'bg-[#54347F] text-white'
                              : isToday
                              ? 'bg-white/15 text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xs font-medium">
                            {date.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2)}
                          </span>
                          <span className="text-sm font-bold">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Фильтры по категориям */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setCategoryFilter(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all backdrop-blur-md ${
                      !categoryFilter
                        ? 'bg-[#54347F] text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    Все категории
                  </button>
                  {Object.entries(SUPERPOWER_CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setCategoryFilter(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 backdrop-blur-md ${
                        categoryFilter === key
                          ? 'bg-[#54347F] text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Ф��льтры по типу контента */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {(['all', 'photo', 'video', 'text'] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all backdrop-blur-md ${
                        filter === type
                          ? 'bg-[#54347F] text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {type === 'all' ? '📋 Все' : type === 'photo' ? '📸 Фото' : type === 'video' ? '🎥 Видео' : '✍️ Текст'}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Контент */}
      <div className="px-4 py-6">
        {filteredBliks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="font-semibold text-white mb-2">
              {activeTab === 'incoming' ? 'Пока нет входящих бликов' :
               activeTab === 'declined' ? 'Нет отклоненных бликов' :
               'Нет отправленных бликов'}
            </h3>
            <p className="text-white/60 max-w-sm mx-auto">
              {activeTab === 'incoming' ? 'Когда друзья отправят тебе блики, они появятся здесь' :
               activeTab === 'declined' ? 'Отклоненные блики можно восстановить позже' :
               'Блики, которые ты отправил друзьям, появятся здесь'}
            </p>
          </motion.div>
        ) : (
          <div className="bliks-grid">
            <AnimatePresence mode="popLayout">
              {filteredBliks.map((blik, index) => {
                const impact = calculateImpact(blik);
                const isPreviewOpen = showImpactPreview === blik.id;
                
                return (
                  <motion.div
                    key={blik.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl overflow-hidden vibrant-card"
                  >
                    {/* Предпросмотр влияния */}
                    {isPreviewOpen && activeTab === 'incoming' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="font-semibold">Влияние на суперсилу</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/80">{blik.superpower.emoji} {blik.superpower.name}</span>
                                <span className="text-green-400 font-bold flex items-center gap-1">
                                  <ArrowUp className="w-4 h-4" />
                                  +{impact.energyIncrease} энергии
                                </span>
                              </div>
                              
                              {/* Прогресс бар */}
                              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: `${impact.currentEnergy}%` }}
                                  animate={{ width: `${impact.newEnergy}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <span>{impact.currentEnergy}%</span>
                                <span className="text-green-400 font-semibold">→ {impact.newEnergy}%</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-white/60">
                            Рост энергии откроет новые возможности и повысит твою видимость в этой категории
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Шапка блика */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={blik.author.avatar}
                            alt={blik.author.name}
                            className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-full object-cover ring-2 ring-purple-400/50"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                          {blik.author.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{blik.author.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>{blik.superpower.emoji}</span>
                            <span>{blik.superpower.name}</span>
                          </div>
                        </div>

                        {/* Кнопка предпросмотра с значением влияния */}
                        {activeTab === 'incoming' && (
                          <button
                            onClick={() => setShowImpactPreview(isPreviewOpen ? null : blik.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              isPreviewOpen
                                ? 'bliq-primary-button'
                                : 'bliq-glass-button'
                            }`}
                          >
                            <span className="text-sm font-semibold text-green-400">+{impact.energyIncrease}</span>
                            <TrendingUp className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Медиа */}
                    {blik.mediaUrl && (
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => onBlikDetail(blik.id)}
                      >
                        {blik.type === 'video' ? (
                          <div className="relative aspect-video bg-slate-800">
                            <img
                              src={blik.mediaUrl}
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <div className="w-0 h-0 border-l-8 border-t-6 border-b-6 border-l-white border-t-transparent border-b-transparent ml-1" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={blik.mediaUrl}
                            alt="Blik media"
                            className="w-full aspect-square object-cover"
                          />
                        )}
                      </div>
                    )}

                    {/* Текст */}
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => onBlikDetail(blik.id)}
                    >
                      <p className="text-white leading-relaxed">{blik.content}</p>
                    </div>

                    {/* Статистика и время */}
                    <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {/* Интерактивное сердечко */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-1 text-white/60 hover:text-pink-400 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                        {/* Интерактивный комментарий */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-1 text-white/60 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </motion.button>
                      </div>
                      {/* Приглушенная дата */}
                      <span className="text-xs" style={{ color: '#B6AEE8' }}>{blik.timestamp}</span>
                    </div>

                    {/* Кнопки действий */}
                    <div className="p-4 border-t border-white/10 flex gap-3">
                      {activeTab === 'incoming' && (
                        <>
                          {/* Кнопка "Отклонить" - прозрачная с неоновой обводкой */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onDecline(blik.id)}
                            className="flex-1 py-3 rounded-xl backdrop-blur-md bg-transparent border border-white/20 hover:border-purple-400/50 hover:bg-white/5 text-white/80 hover:text-white transition-all flex items-center justify-center gap-2"
                            style={{
                              boxShadow: '0 0 0 rgba(168, 85, 247, 0)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 10px rgba(168, 85, 247, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 0 0 rgba(168, 85, 247, 0)';
                            }}
                          >
                            <X className="w-5 h-5" />
                            <span>Отклонить</span>
                          </motion.button>
                          {/* Кнопка "Принять" - яркий фиолетовый градиент */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAccept(blik.id)}
                            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                            style={{
                              background: 'linear-gradient(135deg, #6C1FFF 0%, #A347FF 100%)',
                              color: 'white',
                              fontWeight: 600,
                              boxShadow: '0 4px 16px rgba(108, 31, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 6px 24px rgba(108, 31, 255, 0.6), 0 0 30px rgba(163, 71, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(108, 31, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <Check className="w-5 h-5" />
                            <span>Принять</span>
                          </motion.button>
                        </>
                      )}
                      {activeTab === 'declined' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAccept(blik.id)}
                          className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                          style={{
                            background: 'linear-gradient(135deg, #6C1FFF 0%, #A347FF 100%)',
                            color: 'white',
                            fontWeight: 600,
                            boxShadow: '0 4px 16px rgba(108, 31, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 6px 24px rgba(108, 31, 255, 0.6), 0 0 30px rgba(163, 71, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(108, 31, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Check className="w-5 h-5" />
                          <span>Восстановить</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
