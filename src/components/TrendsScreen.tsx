import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Flame, Eye } from 'lucide-react';
import { StatusBar } from './StatusBar';

interface TrendingSuperpower {
  name: string;
  emoji: string;
  currentBliks: number;
  previousBliks: number;
  trendPercentage: number;
  trendDirection: 'up' | 'down' | 'stable';
  category: string;
  isHot?: boolean;
}

interface TrendsScreenProps {
  trendingSuperpowers: TrendingSuperpower[];
}

function TrendIcon({ direction, percentage }: { direction: 'up' | 'down' | 'stable'; percentage: number }) {
  const iconProps = { size: 16 };
  
  switch (direction) {
    case 'up':
      return <TrendingUp {...iconProps} className="text-green-400" />;
    case 'down':
      return <TrendingDown {...iconProps} className="text-red-400" />;
    case 'stable':
      return <Minus {...iconProps} className="text-gray-400" />;
  }
}

function SuperpowerTrendCard({ superpower, index }: { superpower: TrendingSuperpower; index: number }) {
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mind': return 'from-purple-500/20 to-blue-500/20 border-purple-500/30';
      case 'Соул': return 'from-pink-500/20 to-purple-500/20 border-pink-500/30';
      case 'Тело': return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      case 'Флоу': return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative backdrop-blur-xl bg-gradient-to-br ${getCategoryColor(superpower.category)}
        border rounded-2xl p-4
        transition-all duration-300
        group cursor-pointer
        overflow-hidden
      `}
    >
      {/* Glow effect на hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hot badge */}
      {superpower.isHot && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
          <Flame size={12} />
          <span>HOT</span>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Заголовок и позиция */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-2xl flex items-center justify-center">
              {superpower.emoji}
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">
                {superpower.name.replace(' - Ваша', '').replace('Ваша ', '')}
              </h3>
              <p className="text-white/60 text-xs">{superpower.category}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/60 text-xs">#{index + 1}</div>
          </div>
        </div>

        {/* Статистика */}
        <div className="space-y-2">
          {/* Текущие блики */}
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Блики</span>
            <span className="text-white font-semibold">{superpower.currentBliks}</span>
          </div>

          {/* Тренд */}
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Тренд</span>
            <div className="flex items-center gap-1">
              <TrendIcon direction={superpower.trendDirection} percentage={superpower.trendPercentage} />
              <span className={`text-sm font-medium ${getTrendColor(superpower.trendDirection)}`}>
                {superpower.trendPercentage > 0 ? '+' : ''}{superpower.trendPercentage}%
              </span>
            </div>
          </div>

          {/* Прогресс бар */}
          <div className="mt-3">
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (superpower.currentBliks / 200) * 100)}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>0</span>
              <span>200</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrendsScreen({
  trendingSuperpowers
}: TrendsScreenProps) {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('week');

  const timeFilters = [
    { id: 'day' as const, label: 'День' },
    { id: 'week' as const, label: 'Неделя' },
    { id: 'month' as const, label: 'Месяц' }
  ];

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
            <div className="py-3 mb-6">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white font-semibold text-xl mb-2"
              >
                🔥 Тренды суперсил
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-sm"
              >
                Самые популярные суперсилы сейчас
              </motion.p>
            </div>

            {/* Фильтры времени */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-6 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-white font-medium mb-3">Период</h3>
                <div className="flex gap-2">
                  {timeFilters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTimeFilter(filter.id)}
                      className={`
                        flex-1 py-2 px-4 rounded-xl text-sm font-medium
                        transition-all duration-300
                        ${timeFilter === filter.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Статистика */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-8 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-white font-medium mb-4">Общая статистика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {trendingSuperpowers.reduce((sum, sp) => sum + sp.currentBliks, 0)}
                    </div>
                    <div className="text-white/60 text-xs">Всего бликов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {trendingSuperpowers.filter(sp => sp.trendDirection === 'up').length}
                    </div>
                    <div className="text-white/60 text-xs">Растущие</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Список трендинговых суперсил */}
            <div className="space-y-4">
              {trendingSuperpowers.map((superpower, index) => (
                <SuperpowerTrendCard
                  key={superpower.name}
                  superpower={superpower}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}