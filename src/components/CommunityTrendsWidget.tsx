import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Zap, Clock, Crown, Star, Award, Calendar } from 'lucide-react';

interface CommunityTrendsProps {
  superpowerName: string;
  superpowerEmoji: string;
  ownerProfileType?: 'personal' | 'business';
  stats: {
    totalMembers: number;
    activeToday: number;
    totalBliks: number;
    weeklyGrowth: number;
    averageEnergy: number;
    topBlikers: number;
    peakHour: string;
    foundedDaysAgo: number;
  };
}

export function CommunityTrendsWidget({ superpowerName, superpowerEmoji, ownerProfileType = 'personal', stats }: CommunityTrendsProps) {
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-emerald-400';
    if (growth < 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '📊';
  };

  const getActivityLevel = () => {
    const activityPercent = (stats.activeToday / stats.totalMembers) * 100;
    if (activityPercent > 15) return { level: 'Очень высокая', color: 'text-emerald-400', emoji: '🔥' };
    if (activityPercent > 10) return { level: 'Высокая', color: 'text-green-400', emoji: '⚡' };
    if (activityPercent > 5) return { level: 'Средняя', color: 'text-yellow-400', emoji: '💫' };
    return { level: 'Низкая', color: 'text-orange-400', emoji: '💤' };
  };

  const activity = getActivityLevel();

  const communityInsights = [
    {
      title: 'Участники сообщества',
      value: stats.totalMembers.toLocaleString(),
      subtitle: `${stats.activeToday} активны сегодня`,
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
      badge: activity.emoji
    },
    {
      title: 'Всего бликов',
      value: stats.totalBliks.toLocaleString(),
      subtitle: `${getGrowthIcon(stats.weeklyGrowth)} ${Math.abs(stats.weeklyGrowth)}% за неделю`,
      icon: Zap,
      color: 'from-purple-500 to-pink-400',
      badge: '✨'
    },
    {
      title: 'Средняя энергия',
      value: `${stats.averageEnergy}%`,
      subtitle: activity.level + ' активность',
      icon: TrendingUp,
      color: stats.averageEnergy > 70 ? 'from-emerald-500 to-green-400' : 
             stats.averageEnergy > 50 ? 'from-yellow-500 to-orange-400' : 
             'from-red-500 to-rose-400',
      badge: activity.emoji
    },
    {
      title: 'Пик активности',
      value: stats.peakHour,
      subtitle: 'Лучшее время для бликов',
      icon: Clock,
      color: 'from-indigo-500 to-purple-400',
      badge: '⏰'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      {/* Заголовок суперсилы */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{superpowerEmoji}</div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{superpowerName}</h3>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                ownerProfileType === 'business' 
                  ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30'
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {ownerProfileType === 'business' ? (
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                ) : (
                  <Crown size={12} />
                )}
                <span>Суперсила сообщества</span>
              </div>
              <div className="text-white/50 text-xs">
                {stats.foundedDaysAgo} дн. назад
              </div>
            </div>
          </div>
        </div>
        <p className="text-white/60 text-sm">
          Аналитика активности и роста сообщества любителей {superpowerName.toLowerCase()}
        </p>
      </div>

      {/* Основная статистика сообщества */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {communityInsights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group-hover:border-white/20">
              {/* Градиентный индикатор */}
              <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-5 rounded-xl group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <insight.icon className="text-white/60" size={20} />
                  <div className="text-lg">{insight.badge}</div>
                </div>
                
                <div className="mb-1">
                  <div className="text-white font-bold text-xl">{insight.value}</div>
                </div>
                
                <div className="text-white/50 text-xs">{insight.subtitle}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Индикаторы роста и здоровья сообщества */}
      <div className="space-y-4">
        <h4 className="text-white/80 font-medium text-sm flex items-center gap-2">
          <Star size={16} />
          Здоровье сообщества
        </h4>

        {/* Рост участников */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border border-blue-500/30 flex items-center justify-center">
              <Users size={16} className="text-blue-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Рост сообщества</div>
              <div className="text-white/50 text-xs">За последнюю неделю</div>
            </div>
          </div>
          <div className={`font-semibold ${getGrowthColor(stats.weeklyGrowth)}`}>
            {stats.weeklyGrowth > 0 ? '+' : ''}{stats.weeklyGrowth}%
          </div>
        </div>

        {/* Активность */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-400/20 border border-emerald-500/30 flex items-center justify-center">
              <Zap size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Активность</div>
              <div className="text-white/50 text-xs">
                {((stats.activeToday / stats.totalMembers) * 100).toFixed(1)}% участников онлайн
              </div>
            </div>
          </div>
          <div className={`font-semibold ${activity.color} flex items-center gap-1`}>
            <span>{activity.emoji}</span>
            <span className="text-xs">{activity.level}</span>
          </div>
        </div>

        {/* Качество контента */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-400/20 border border-purple-500/30 flex items-center justify-center">
              <Award size={16} className="text-purple-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Качество контента</div>
              <div className="text-white/50 text-xs">
                Средний рейтинг бликов
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white font-semibold text-sm">4.8</span>
          </div>
        </div>
      </div>

      {/* Призыв к участию */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-lg">🚀</div>
          <div className="text-white font-medium text-sm">Присоединяйся к сообществу!</div>
        </div>
        <p className="text-white/60 text-xs leading-relaxed">
          Развивай {superpowerName.toLowerCase()} вместе с {stats.totalMembers.toLocaleString()} единомышленниками. 
          Делись опытом, получай блики и расти профессионально!
        </p>
      </div>
    </motion.div>
  );
}