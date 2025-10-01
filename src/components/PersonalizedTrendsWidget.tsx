import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Users, Target, Award, Crown, BarChart3, Activity, Zap, Star, Brain, Trophy, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface PersonalizedTrendsStats {
  currentValue: number;
  energy: number;
  rankAmongUserSuperpowers: number;
  totalUserSuperpowers: number;
  friendsWithSameSuperpower: number;
  averageValueAmongFriends: number;
  userValueVsFriends: 'above' | 'below' | 'average';
  growthPotential: number;
  recentTrend: 'rising' | 'falling' | 'stable';
  weeklyGrowth: number;
  monthlyGrowth: number;
  strengthInCircle: number; // Сила в кругу друзей (1-100)
  uniquenessScore: number; // Уникальность среди друзей (1-100)
  peakActivityTime: string;
  superpowerMomentum: 'heating_up' | 'cooling_down' | 'stable';
}

interface PersonalizedTrendsWidgetProps {
  superpowerName: string;
  superpowerEmoji: string;
  stats: PersonalizedTrendsStats;
  userSuperpowers?: Array<{name: string; emoji: string; value: number; trend: 'up' | 'down' | 'stable'}>;
}

export function PersonalizedTrendsWidget({ 
  superpowerName,
  superpowerEmoji,
  stats,
  userSuperpowers = []
}: PersonalizedTrendsWidgetProps) {
  
  // Топ суперсил пользователя с выделением текущей (с fallback данными)
  const personalSuperpowerRanking = userSuperpowers.length > 0 
    ? userSuperpowers
        .map(sp => ({
          ...sp,
          current: sp.name === superpowerName
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    : [
        { name: 'Контент-маркетинг', emoji: '📱', value: 92, trend: 'up' as const, current: superpowerName === 'Контент-маркетинг' },
        { name: 'Харизма', emoji: '👑', value: 88, trend: 'stable' as const, current: superpowerName === 'Харизма' },
        { name: 'Крутой стиль', emoji: '❄️', value: 84, trend: 'up' as const, current: superpowerName === 'Крутой стиль' },
        { name: 'Командная работа', emoji: '🤝', value: 82, trend: 'down' as const, current: superpowerName === 'Командная работа' },
        { name: 'Креативность', emoji: '🧠', value: 78, trend: 'stable' as const, current: superpowerName === 'Креативность' }
      ].filter(sp => sp.current || sp.value > stats.currentValue - 20);

  // Данные для сравнения с друзьями
  const friendsComparison = [
    { name: 'Твой результат', value: stats.currentValue, isUser: true },
    { name: 'Алексей К.', value: stats.averageValueAmongFriends + 15 },
    { name: 'Мария С.', value: stats.averageValueAmongFriends + 8 },
    { name: 'Игорь В.', value: stats.averageValueAmongFriends - 5 },
    { name: 'Средний', value: stats.averageValueAmongFriends, isAverage: true }
  ].sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...friendsComparison.map(f => f.value));

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable', size = 12) => {
    switch (trend) {
      case 'rising': 
        return <ArrowUp size={size} className="text-emerald-400" />;
      case 'falling': 
        return <ArrowDown size={size} className="text-red-400" />;
      default: 
        return <Minus size={size} className="text-gray-400" />;
    }
  };

  const getSuperpowerTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': 
        return <ArrowUp size={12} className="text-emerald-400" />;
      case 'down': 
        return <ArrowDown size={12} className="text-red-400" />;
      default: 
        return <Minus size={12} className="text-gray-400" />;
    }
  };

  const getMomentumIcon = () => {
    switch (stats.superpowerMomentum) {
      case 'heating_up':
        return <Flame size={14} className="text-orange-400" />;
      case 'cooling_down':
        return <Activity size={14} className="text-blue-400" />;
      default:
        return <BarChart3 size={14} className="text-gray-400" />;
    }
  };

  const getMomentumText = () => {
    switch (stats.superpowerMomentum) {
      case 'heating_up':
        return 'Набирает обороты';
      case 'cooling_down':
        return 'Замедляется';
      default:
        return 'Стабильный темп';
    }
  };

  const getMomentumColor = () => {
    switch (stats.superpowerMomentum) {
      case 'heating_up':
        return 'from-orange-500/10 to-red-500/10 border-orange-400/30';
      case 'cooling_down':
        return 'from-blue-500/10 to-cyan-500/10 border-blue-400/30';
      default:
        return 'from-gray-500/10 to-slate-500/10 border-gray-400/30';
    }
  };

  const getPersonalizedRecommendation = () => {
    // Комплексная логика для персональных рекомендаций
    if (stats.rankAmongUserSuperpowers === 1) {
      return `${superpowerName} - ваша топ суперсила! Станьте ментором для друзей с ${stats.friendsWithSameSuperpower} участниками.`;
    }
    
    if (stats.userValueVsFriends === 'above' && stats.uniquenessScore > 70) {
      return `Вы уникальны в этой области! Создайте контент или проведите мастер-класс по "${superpowerName}".`;
    }
    
    if (stats.superpowerMomentum === 'heating_up') {
      return `Суперсила набирает обороты! Самое время удвоить усилия - тренд работает в вашу пользу.`;
    }
    
    if (stats.userValueVsFriends === 'below') {
      return `Изучите опыт лидеров в "${superpowerName}". Ваш потенциал роста ${stats.growthPotential}% говорит о больших возможностях!`;
    }
    
    if (stats.weeklyGrowth < 0) {
      return `Попробуйте активность в ${stats.peakActivityTime} - ваше время максимальной эффективности.`;
    }
    
    return `Развивайте "${superpowerName}" постепенно. У вас отличная позиция для роста!`;
  };

  const getUserVsFriendsColor = () => {
    switch (stats.userValueVsFriends) {
      case 'above': return 'text-emerald-400';
      case 'below': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getUserVsFriendsText = () => {
    switch (stats.userValueVsFriends) {
      case 'above': return 'Выше среднего';
      case 'below': return 'Ниже среднего';
      default: return 'Средний уровень';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-6 w-full max-w-md mx-auto lg:mx-0"
    >
      {/* Главная карточка персонализированных трендов - спокойная версия */}
      <div className="relative">
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          
          {/* Заголовок секции - минималистичный */}
          <div className="relative flex items-center gap-2 mb-4">
            <h3 className="text-white/90 font-medium text-sm">Персональная аналитика</h3>
            <span className="text-white/40 text-sm">{superpowerEmoji} {superpowerName}</span>
          </div>

          {/* Основная статистика - спокойная версия */}
          <div className="relative grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Crown size={12} className="text-purple-400" />
                <span className="text-white font-medium text-sm">#{stats.rankAmongUserSuperpowers}</span>
              </div>
              <span className="text-white/50 text-xs">из {stats.totalUserSuperpowers}</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {getMomentumIcon()}
                <span className="text-white font-medium text-xs">{stats.weeklyGrowth >= 0 ? '+' : ''}{stats.weeklyGrowth}%</span>
              </div>
              <span className="text-white/50 text-xs">{getMomentumText()}</span>
            </div>
          </div>

          {/* Рейтинг среди ваших суперсил - спокойная версия */}
          <div className="relative mb-4">
            <h4 className="text-white/70 text-xs mb-2 flex items-center gap-1.5">
              <Trophy size={12} className="text-yellow-400" />
              Ваш топ суперсил
            </h4>
            <div className="space-y-1.5">
              {personalSuperpowerRanking.slice(0, 4).map((superpower, index) => (
                <div
                  key={superpower.name}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                    superpower.current 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-white/40 w-4">#{index + 1}</span>
                      <span className="text-base">{superpower.emoji}</span>
                    </div>
                    <span className={`text-sm ${superpower.current ? 'text-white' : 'text-white/60'}`}>
                      {superpower.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${superpower.current ? 'text-white' : 'text-white/60'}`}>
                      {superpower.value}
                    </span>
                    <div className="flex items-center gap-1">
                      {getSuperpowerTrendIcon(superpower.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Уникальная аналитика - спокойная версия */}
          <div className="relative mb-4">
            <h4 className="text-white/70 text-xs mb-2 flex items-center gap-1.5">
              <Brain size={12} className="text-cyan-400" />
              Ваша позиция в кругу друзей
            </h4>
            
            {/* Две мини-карточки с уникальными метриками */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                <div className="text-emerald-400 font-medium text-base">{stats.strengthInCircle}%</div>
                <div className="text-white/50 text-xs">Влиятельность</div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-center">
                <div className="text-orange-400 font-medium text-base">{stats.uniquenessScore}%</div>
                <div className="text-white/50 text-xs">Уникальность</div>
              </div>
            </div>

            {/* Прогресс бар сравнения с друзьями - упрощенный */}
            <div className="bg-white/10 rounded-full h-1.5 overflow-hidden relative">
              <div 
                className="h-full bg-purple-500/60 rounded-full transition-all duration-500"
                style={{ width: `${((stats.currentValue - 40) / 60) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>Средний: {stats.averageValueAmongFriends}</span>
              <span className={getUserVsFriendsColor()}>
                {stats.userValueVsFriends === 'above' ? '+' : stats.userValueVsFriends === 'below' ? '-' : '±'}
                {Math.abs(stats.currentValue - stats.averageValueAmongFriends)}
              </span>
            </div>
          </div>

          {/* Потенциал роста и активность - спокойная версия */}
          <div className="relative grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
              <Star size={12} className="text-emerald-400" />
              <div>
                <div className="text-white text-xs">{stats.growthPotential}%</div>
                <div className="text-white/50 text-xs">Потенциал</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
              <Activity size={12} className="text-indigo-400" />
              <div>
                <div className="text-white text-xs">{stats.peakActivityTime}</div>
                <div className="text-white/50 text-xs">Пик активности</div>
              </div>
            </div>
          </div>

          {/* Персональная рекомендация - спокойная версия */}
          <div className="relative p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={12} className="text-indigo-400" />
              <span className="text-white/70 text-xs">Персональная рекомендация</span>
            </div>
            <span className="text-white/80 text-xs leading-relaxed">
              {getPersonalizedRecommendation()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}