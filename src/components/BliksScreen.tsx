import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Send } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { BlikCard, BlikData } from './BlikCard';

interface BliksScreenProps {
  receivedBliks: BlikData[];
  sentBliks: BlikData[];
  userProfileType?: 'personal' | 'business';
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShare: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onSuperpowerClick?: (superpowerName: string) => void;
  onUserProfile?: (userId: string) => void;
  onSidebar: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  unreadNotificationsCount?: number;
}

export function BliksScreen({
  receivedBliks,
  sentBliks,
  userProfileType = 'personal',
  onLike,
  onComment,
  onShare,
  onBlikDetail,
  onSuperpowerClick,
  onUserProfile,
  onSidebar,
  onSearch,
  onNotifications,
  unreadNotificationsCount = 0
}: BliksScreenProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const tabs = [
    { 
      id: 'received' as const, 
      label: userProfileType === 'business' ? 'От клиентов' : 'Полученные', 
      icon: Inbox, 
      count: receivedBliks.length 
    },
    { 
      id: 'sent' as const, 
      label: userProfileType === 'business' ? 'Клиентам' : 'Отправленные', 
      icon: Send, 
      count: sentBliks.length 
    }
  ];

  const currentBliks = activeTab === 'received' ? receivedBliks : sentBliks;

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Контент с прокруткой */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Статус-бар БЕЗ фона - прозрачный */}
        <div className="relative z-20">
          <StatusBar
            onMenuClick={onSidebar}
            onNotificationsClick={onNotifications}
            onSearchClick={onSearch}
            notificationsCount={unreadNotificationsCount}
          />
        </div>

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-6 pt-6">

            {/* Табы - ТОЧНАЯ КОПИЯ ФИЛЬТРОВ ПЕРИОДА ИЗ ТОПА */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                      transition-all duration-300
                      ${activeTab === tab.id
                        ? 'bliq-primary-button'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <tab.icon size={16} />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Статистика - БЕЗ ФОНОВОЙ КАРТОЧКИ (как в ТОПе) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-white font-medium mb-4 px-2">Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {receivedBliks.reduce((sum, blik) => sum + blik.likes, 0)}
                  </div>
                  <div className="text-white/60 text-xs">Всего лайков</div>
                </div>
                <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {receivedBliks.reduce((sum, blik) => sum + blik.comments, 0)}
                  </div>
                  <div className="text-white/60 text-xs">Всего комментариев</div>
                </div>
              </div>
            </motion.div>

            {/* Список бликов */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'received' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'received' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentBliks.map((blik, index) => (
                  <motion.div
                    key={blik.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => onBlikDetail(blik.id)}
                    className="cursor-pointer"
                  >
                    <BlikCard
                      blik={blik}
                      layout="grid"
                      index={index}
                      onLike={onLike}
                      onComment={onComment}
                      onShare={onShare}
                      onSuperpowerClick={onSuperpowerClick}
                      onUserProfile={onUserProfile}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Пустое состояние */}
            {currentBliks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">
                  {activeTab === 'received' ? '📥' : '📤'}
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  {activeTab === 'received' 
                    ? (userProfileType === 'business' ? 'Пока нет бликов от клиентов' : 'Пока нет полученных бликов')
                    : (userProfileType === 'business' ? 'Пока нет бликов клиентам' : 'Пока нет отправленных бликов')
                  }
                </h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto">
                  {activeTab === 'received' 
                    ? (userProfileType === 'business' 
                        ? 'Здесь будут отображаться блики, которые вам отправили клиенты'
                        : 'Здесь будут отображаться блики, которые вам отправили друзья'
                      )
                    : (userProfileType === 'business'
                        ? 'Здесь будут отображаться блики, которые вы отправили клиентам'
                        : 'Здесь будут отображаться блики, которые вы отправили друзьям'
                      )
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}