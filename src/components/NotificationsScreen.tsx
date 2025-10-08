import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, UserPlus, Zap, Award, TrendingUp, CheckCheck, Trash2, Bell, BellOff, Sparkles, X, Search } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { CustomSelect } from './CustomSelect';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png'; // Аватар пользователя - ПРАВИЛЬНЫЙ

export type NotificationType = 'like' | 'comment' | 'blik' | 'friend' | 'achievement' | 'superpower' | 'trend';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  avatar: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  blikId?: string;
  superpowerName?: string;
}

interface NotificationsScreenProps {
  notifications: Notification[];
  onBack: () => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onClearAll: () => void;
  onSidebar: () => void;
  onSearch: () => void;
}

// Группировка уведомлений по времени
interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  older: Notification[];
}

export function NotificationsScreen({
  notifications,
  onBack,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSidebar,
  onSearch
}: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [swipedNotification, setSwipedNotification] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(20); // Лимит для первой загрузки

  // 🎨 ЯРКИЕ ИКОНКИ С РАЗНЫМИ ЦВЕТАМИ ДЛЯ ЧИТАЕМОСТИ
  const getNotificationIcon = useCallback((type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="text-pink-300" size={16} fill="currentColor" />;
      case 'comment':
        return <MessageCircle className="text-rose-300" size={16} />;
      case 'blik':
        return <Zap className="text-purple-300" size={16} fill="currentColor" />;
      case 'friend':
        return <UserPlus className="text-violet-300" size={16} />;
      case 'achievement':
        return <Award className="text-amber-300" size={16} fill="currentColor" />;
      case 'superpower':
        return <TrendingUp className="text-fuchsia-300" size={16} />;
      case 'trend':
        return <Sparkles className="text-violet-300" size={16} />;
      default:
        return <Bell className="text-white/60" size={16} />;
    }
  }, []);

  // Группировка уведомлений по времени с учетом фильтров
  const groupedNotifications = useMemo(() => {
    // Сначала фильтруем по статусу прочтения
    let filtered = filter === 'all' 
      ? notifications 
      : notifications.filter(n => !n.isRead);
    
    // Затем фильтруем по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Ограничиваем количество для производительности
    filtered = filtered.slice(0, displayLimit);

    const grouped: GroupedNotifications = {
      today: [],
      yesterday: [],
      older: []
    };

    filtered.forEach(notification => {
      const timestamp = notification.timestamp.toLowerCase();
      
      if (timestamp.includes('только что') || 
          timestamp.includes('минут') || 
          timestamp.includes('час') ||
          timestamp.includes('сейчас')) {
        grouped.today.push(notification);
      } else if (timestamp.includes('вчера') || timestamp.includes('1 день')) {
        grouped.yesterday.push(notification);
      } else {
        grouped.older.push(notification);
      }
    });

    return grouped;
  }, [notifications, filter, typeFilter, displayLimit]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalFiltered = groupedNotifications.today.length + 
                        groupedNotifications.yesterday.length + 
                        groupedNotifications.older.length;

  // Обработчик свайпа для удаления
  const handleDragEnd = useCallback((
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    notificationId: string
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      setSwipedNotification(notificationId);
      setTimeout(() => {
        onMarkAsRead(notificationId);
        setSwipedNotification(null);
      }, 300);
    }
  }, [onMarkAsRead]);

  // Рендер группы уведомлений
  const renderNotificationGroup = (
    notifications: Notification[],
    groupTitle: string,
    startIndex: number
  ) => {
    if (notifications.length === 0) return null;

    return (
      <div className="space-y-3">
        {/* 🌟 НЕОНОВАЯ ТИПОГРАФИКА ДЛЯ ЗАГОЛОВКА ГРУППЫ */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ 
              color: '#C0B3FF',
              textShadow: '0 0 8px rgba(192, 179, 255, 0.6), 0 0 12px rgba(168, 85, 247, 0.4)'
            }}
          >
            {groupTitle}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
        </div>

        {/* 📱 АДАПТИВНАЯ СЕТКА УВЕДОМЛЕНИЙ - КАК В ЛЕНТЕ */}
        <div className="bliks-grid">
        {notifications.map((notification, index) => {
          const isDeleting = swipedNotification === notification.id;
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isDeleting ? 0 : 1, 
                y: 0
              }}
              transition={{ 
                delay: Math.min((startIndex + index) * 0.03, 0.5),
                duration: 0.2
              }}
              onClick={() => {
                if (!notification.isRead) {
                  onMarkAsRead(notification.id);
                }
                onNotificationClick(notification);
              }}
              className="relative"
            >
              {/* 🎨 УЛУЧШЕННАЯ КАРТОЧКА С ЧЕТКИМИ ИНДИКАТОРАМИ */}
              <div
                className={`
                  glass-card rounded-2xl p-4 cursor-pointer 
                  transition-all duration-200 relative overflow-hidden
                  hover:scale-[1.01] hover:-translate-y-1
                  ${notification.isRead 
                    ? 'border-white/10 hover:border-white/15' 
                    : 'border-purple-500/40 hover:border-purple-400/50 bg-purple-500/5'
                  }
                `}
              >
                {/* 🔴 ЯРКАЯ ВЕРТИКАЛЬНАЯ ПОЛОСКА ДЛЯ НЕПРОЧИТАННЫХ */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-l-2xl" />
                )}

                <div className="flex gap-3 relative z-10">
                  {/* Аватар с тонкой рамкой */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={notification.avatar}
                      alt=""
                      className={`w-12 h-12 rounded-full object-cover relative z-10 ${
                        notification.isRead 
                          ? 'border-2 border-white/10' 
                          : 'border-2 border-purple-400/60'
                      }`}
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    
                    {/* 🎯 ЧЕТКАЯ ИКОНКА ТИПА - ОТДЕЛЬНЫЙ ЯРКИЙ BADGE */}
                    <div 
                      className={`
                        absolute -bottom-1 -right-1 w-7 h-7 rounded-full 
                        flex items-center justify-center z-20
                        border-2 border-slate-900
                        ${notification.isRead 
                          ? 'bg-slate-800/95' 
                          : 'bg-gradient-to-br from-purple-600 to-pink-600'
                        }
                      `}
                      style={{
                        boxShadow: notification.isRead 
                          ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                          : '0 2px 12px rgba(168, 85, 247, 0.6), 0 0 20px rgba(236, 72, 153, 0.3)'
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      {/* Заголовок с точкой для непрочитанных */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 animate-pulse" />
                        )}
                        <h4 className={`font-semibold text-sm truncate ${
                          notification.isRead ? 'text-white/90' : 'text-white'
                        }`}>
                          {notification.title}
                        </h4>
                      </div>
                      <span className="text-white/40 text-xs whitespace-nowrap flex-shrink-0">
                        {notification.timestamp}
                      </span>
                    </div>
                    
                    <p className={`text-sm line-clamp-2 ${
                      notification.isRead ? 'text-white/60' : 'text-white/80'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    );
  };

  // 🎯 ФИЛЬТРЫ ПО ТИПАМ - ЕДИНЫЙ СТИЛЬ
  const typeFilters: Array<{
    value: NotificationType | 'all';
    label: string;
    icon: typeof Heart;
  }> = [
    { value: 'all', label: 'Все типы', icon: Bell },
    { value: 'like', label: 'Лайки', icon: Heart },
    { value: 'comment', label: 'Комментарии', icon: MessageCircle },
    { value: 'blik', label: 'Блики', icon: Zap },
    { value: 'friend', label: 'Друзья', icon: UserPlus },
    { value: 'achievement', label: 'Достижения', icon: Award },
    { value: 'superpower', label: 'Суперсилы', icon: TrendingUp },
    { value: 'trend', label: 'Тренды', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Контент с прокруткой */}
      <div className="relative z-10">
        {/* БЛОК 1: Статус-бар */}
        <div className="relative z-20">
          <StatusBar />
        </div>

        {/* БЛОК 2: Навигационная панель с логотипом */}
        <div className="relative z-20">
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

        {/* Прокручиваемый контент */}
        <div className="overflow-y-auto scrollbar-hide pb-20">
          <div className="px-6 pt-6">

            {/* Фильтры статуса - Все/Непрочитанные */}
            <div className="mb-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                    transition-all duration-200
                    ${filter === 'all'
                      ? 'bliq-primary-button'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="font-medium">Все</span>
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                    transition-all duration-200
                    ${filter === 'unread'
                      ? 'bliq-primary-button'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="font-medium">Непрочитанные</span>
                  {unreadCount > 0 && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: filter === 'unread' ? 'rgba(255, 255, 255, 0.2)' : '#ef4444',
                        color: 'white'
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Фильтры по типам - адаптивные */}
            <div className="mb-6">
              {/* 📱 МОБИЛЬНАЯ ВЕРСИЯ: Кастомный выпадающий список */}
              <div className="sm:hidden">
                <CustomSelect
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(value as typeof typeFilter)}
                  options={typeFilters}
                />
              </div>

              {/* 💻 ПЛАНШЕТ/ДЕСКТОП: Горизонтальный скролл с кнопками */}
              <div className="hidden sm:flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {typeFilters.map((typeFilterOption) => {
                  const Icon = typeFilterOption.icon;
                  return (
                    <button
                      key={typeFilterOption.value}
                      onClick={() => setTypeFilter(typeFilterOption.value)}
                      className={`
                        flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                        transition-all duration-200
                        ${typeFilter === typeFilterOption.value
                          ? 'bliq-primary-button'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{typeFilterOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Список уведомлений с группировкой */}
            <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {totalFiltered === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                    <BellOff className="text-white/40" size={32} />
                  </div>
                </motion.div>
                <h3 className="text-white/80 mb-2">
                  {filter === 'unread' ? 'Нет новых уведомлений' : 'Пока нет уведомлений'}
                </h3>
                <p className="text-white/50 text-sm">
                  {filter === 'unread' 
                    ? 'Все уведомления прочитаны ✨' 
                    : 'Здесь будут появляться твои уведомления'}
                </p>
              </motion.div>
            ) : (
              <>
                {renderNotificationGroup(groupedNotifications.today, 'Сегодня', 0)}
                {renderNotificationGroup(
                  groupedNotifications.yesterday, 
                  'Вчера', 
                  groupedNotifications.today.length
                )}
                {renderNotificationGroup(
                  groupedNotifications.older, 
                  'Раньше', 
                  groupedNotifications.today.length + groupedNotifications.yesterday.length
                )}
              </>
            )}
          </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
