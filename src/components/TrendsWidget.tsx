import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Zap, Users, Calendar, Target, BarChart3, Activity } from 'lucide-react';

interface TrendsStats {
  totalBliks: number;
  weeklyGrowth: number;
  activeUsers: number;
  dailyActivity: number;
  peakHour: string;
  averageEnergy: number;
}

interface TrendData {
  period: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrendsWidgetProps {
  stats: TrendsStats;
  superpowerName: string;
  category: string;
}

export function TrendsWidget({ 
  stats, 
  superpowerName,
  category 
}: TrendsWidgetProps) {
  
  // Проверяем наличие stats и устанавливаем значения по умолчанию
  const safeStats = stats || {
    totalBliks: 0,
    weeklyGrowth: 0,
    activeUsers: 0,
    dailyActivity: 0,
    peakHour: '18:00-20:00',
    averageEnergy: 0
  };
  
  // Данные трендов всего сообщества по периодам  
  const communityTrends: TrendData[] = [
    { period: 'Сегодня', value: safeStats.dailyActivity, change: 8, trend: 'up' },
    { period: 'Неделя', value: Math.round(safeStats.totalBliks * 0.15), change: safeStats.weeklyGrowth, trend: safeStats.weeklyGrowth > 0 ? 'up' : 'down' },
    { period: 'Месяц', value: Math.round(safeStats.totalBliks * 0.35), change: 5, trend: 'up' },
    { period: 'Год', value: safeStats.totalBliks, change: 18, trend: 'up' }
  ];

  // Активность сообщества по дням недели
  const communityWeeklyActivity = [
    { day: 'Пн', bliks: Math.round(safeStats.dailyActivity * 0.8), members: 34 },
    { day: 'Вт', bliks: Math.round(safeStats.dailyActivity * 1.1), members: 42 },
    { day: 'Ср', bliks: Math.round(safeStats.dailyActivity * 0.9), members: 38 },
    { day: 'Чт', bliks: Math.round(safeStats.dailyActivity * 1.3), members: 51 },
    { day: 'Пт', bliks: Math.round(safeStats.dailyActivity * 1.0), members: 47 },
    { day: 'Сб', bliks: Math.round(safeStats.dailyActivity * 0.6), members: 25 },
    { day: 'Вс', bliks: Math.round(safeStats.dailyActivity * 0.7), members: 29 }
  ];

  const maxBliks = Math.max(...communityWeeklyActivity.map(d => d.bliks));

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': 
        return <TrendingUp size={12} className="text-emerald-400" />;
      case 'down': 
        return <TrendingDown size={12} className="text-red-400" />;
      default: 
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="sticky top-6 w-full max-w-md mx-auto lg:mx-0"
    >
      {/* Главная карточка трендов */}
      <div className="relative group">
        {/* Внешний неоновый контур */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-teal-500/30 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-2xl p-5 overflow-hidden">
          
          {/* Декоративные частицы */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl opacity-50" />
          
          {/* Заголовок секции */}
          <div className="relative z-10 flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
              <BarChart3 size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Тренды сообщества</h3>
              <p className="text-white/60 text-sm">📊 Общая статистика</p>
            </div>
          </div>

          {/* Основная статистика */}
          <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-3 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap size={12} className="text-purple-400" />
                <span className="text-white font-bold text-sm">{safeStats.totalBliks}</span>
              </div>
              <span className="text-purple-200/80 text-xs">Всего бликов</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-xl p-3 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-white font-bold text-sm">+{safeStats.weeklyGrowth}%</span>
              </div>
              <span className="text-emerald-200/80 text-xs">Рост</span>
            </motion.div>
          </div>

          {/* Тренды сообщества по периодам */}
          <div className="relative z-10 mb-5">
            <h4 className="text-white/80 font-medium text-sm mb-3">Активность сообщества</h4>
            <div className="space-y-2">
              {communityTrends.map((trend, index) => (
                <motion.div
                  key={trend.period}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/70 text-sm">{trend.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{trend.value.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 ${getTrendColor(trend.trend)}`}>
                      {getTrendIcon(trend.trend)}
                      <span className="text-xs">{Math.abs(trend.change)}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Недельная активность сообщества - мини график */}
          <div className="relative z-10 mb-4">
            <h4 className="text-white/80 font-medium text-sm mb-3">Участники по дням</h4>
            <div className="flex items-end justify-between gap-1 h-16">
              {communityWeeklyActivity.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.members / Math.max(...communityWeeklyActivity.map(d => d.members))) * 100}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="flex-1 bg-gradient-to-t from-blue-500/30 to-cyan-400/50 rounded-t-sm relative group"
                >
                  {/* Тултип при наведении */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {day.day}: {day.members} участников
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {communityWeeklyActivity.map((day) => (
                <span key={day.day} className="text-white/50 text-xs flex-1 text-center">
                  {day.day}
                </span>
              ))}
            </div>
          </div>

          {/* Метрики сообщества */}
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <Users size={14} className="text-blue-400" />
              <div>
                <div className="text-white font-medium text-sm">{safeStats.activeUsers}</div>
                <div className="text-white/60 text-xs">Сегодня активных</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <Target size={14} className="text-cyan-400" />
              <div>
                <div className="text-white font-medium text-sm">{safeStats.activeUsers > 0 ? Math.round(safeStats.totalBliks / safeStats.activeUsers) : 0}</div>
                <div className="text-white/60 text-xs">Блик/участник</div>
              </div>
            </motion.div>
          </div>

          {/* Глобальная статистика сообщества */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="relative z-10 mt-4 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-orange-400" />
                <span className="text-orange-200 text-sm font-medium">Пик активности</span>
              </div>
              <span className="text-white font-bold">{safeStats.peakHour}</span>
            </div>
            <div className="text-white/70 text-xs">
              Лучшее время для активности в сообществе "{superpowerName}"
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}