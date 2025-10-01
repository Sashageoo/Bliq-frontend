import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Inbox, Send } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { BlikCard, BlikData } from './BlikCard';

interface BliksScreenProps {
  receivedBliks: BlikData[];
  sentBliks: BlikData[];
  userProfileType?: 'personal' | 'business';
  onBack: () => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string) => void;
  onShare: (blikId: string) => void;
  onBlikDetail: (blikId: string) => void;
  onSuperpowerClick?: (superpowerName: string) => void; // Добавляем функцию для перехода к суперсиле
}

export function BliksScreen({
  receivedBliks,
  sentBliks,
  userProfileType = 'personal',
  onBack,
  onLike,
  onComment,
  onShare,
  onBlikDetail,
  onSuperpowerClick
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
        {/* Статус-бар */}
        <StatusBar />

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-6 pt-8">
            {/* Заголовок */}
            <div className="flex items-center justify-between py-4 mb-6">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onBack}
                  className="text-white p-1"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div>
                  <h1 className="text-white font-semibold text-xl">Блики</h1>
                  <p className="text-white/60 text-sm">История ваших бликов</p>
                </div>
              </div>
            </div>

            {/* Табы */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-6 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                        transition-all duration-300
                        group relative
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      {/* Glow effect на hover */}
                      {activeTab !== tab.id && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      
                      <tab.icon size={18} className="relative z-10" />
                      <span className="relative z-10 font-medium">{tab.label}</span>
                      <span className={`
                        relative z-10 text-xs px-2 py-0.5 rounded-full
                        ${activeTab === tab.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/60'
                        }
                      `}>
                        {tab.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Статистика */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-8 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-white font-medium mb-4">Статистика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {receivedBliks.reduce((sum, blik) => sum + blik.likes, 0)}
                    </div>
                    <div className="text-white/60 text-xs">Всего лайков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {receivedBliks.reduce((sum, blik) => sum + blik.comments, 0)}
                    </div>
                    <div className="text-white/60 text-xs">Всего комментариев</div>
                  </div>
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