import React from 'react';
import { motion } from 'motion/react';
import { Home, TrendingUp, Plus, Sparkles, User } from 'lucide-react';

export type NavigationTab = 'feed' | 'top' | 'create' | 'bliks' | 'profile';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  incomingBliksCount?: number;
}

export function BottomNavigation({ activeTab, onTabChange, incomingBliksCount = 0 }: BottomNavigationProps) {
  const tabs = [
    { id: 'feed' as const, icon: Home, label: 'Лента' },
    { id: 'top' as const, icon: TrendingUp, label: 'ТОП' },
    { id: 'create' as const, icon: Plus, label: 'Создать' },
    { id: 'bliks' as const, icon: Sparkles, label: 'Блики', badge: incomingBliksCount },
    { id: 'profile' as const, icon: User, label: 'Профиль' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Изящный полупрозрачный blur в стиле Bliq */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/20 border-t border-white/10" />
      
      {/* Навигация */}
      <div className="relative z-10 flex items-center justify-around px-4 py-2 pb-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 p-1 transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {/* Иконка с особым стилем для кнопки "Создать" */}
            <div className="relative">
              {tab.id === 'create' ? (
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bliq-primary-button shadow-lg'
                    : 'bliq-glass-button'
                }`}>
                  <tab.icon size={18} />
                </div>
              ) : (
                <tab.icon size={20} />
              )}
              
              {/* Badge для входящих бликов */}
              {tab.id === 'bliks' && tab.badge && tab.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bliq-simple-counter-small"
                >
                  {tab.badge > 99 ? '99' : tab.badge}
                </motion.div>
              )}
            </div>
            
            {/* Текст */}
            <span className="text-xs font-medium">{tab.label}</span>
            
            {/* Активный индикатор */}
            {activeTab === tab.id && tab.id !== 'create' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bliq-primary-button rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}