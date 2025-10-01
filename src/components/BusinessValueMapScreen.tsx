import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Award, Star, TrendingUp, BarChart3, Users, Target, Zap, Info, Map } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { StatusBar } from './StatusBar';
import { DynamicBattery } from './DynamicBattery';

interface BusinessValueMapScreenProps {
  user: {
    name: string;
    avatarImage: string;
    businessInfo?: {
      companyName: string;
      industry: string;
      verified: boolean;
    };
    metrics: {
      bliks: number;
      friends: number;
      superpowers: number;
    };
    topSuperpowers: Array<{
      name: string;
      emoji: string;
      value: number;
      energy: number;
    }>;
  };
  userBliks: Array<{
    id: string;
    rating?: number;
    timestamp: string;
    superpower: {
      name: string;
      emoji: string;
    };
  }>;
  onBack: () => void;
  onShare: () => void;
  onSuperpowerClick: (name: string) => void;
}

// Компонент справочной иконки с тултипом
const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1 w-4 h-4 rounded-full bg-slate-600/40 border border-slate-500/30 flex items-center justify-center hover:bg-slate-500/40 transition-colors group">
          <Info size={10} className="text-slate-400 group-hover:text-slate-300" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3 bg-slate-800/95 border border-slate-600/50 backdrop-blur-xl">
        <p className="text-sm text-slate-200 leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function BusinessValueMapScreen({
  user,
  userBliks,
  onBack,
  onShare,
  onSuperpowerClick
}: BusinessValueMapScreenProps) {

  // 📊 РАСЧЕТ МЕТРИК ВЛИЯНИЯ
  const calculateInfluenceMetrics = () => {
    const weeklyBliks = userBliks.filter(blik => {
      const daysAgo = blik.timestamp.includes('час') ? 0 : 
                     blik.timestamp.includes('день') ? parseInt(blik.timestamp) : 7;
      return daysAgo <= 7;
    }).length;

    const expectedWeeklyBliks = 20;
    const influenceScore = Math.min(100, Math.round((weeklyBliks / expectedWeeklyBliks) * 100));

    return {
      weeklyBliks,
      expectedWeeklyBliks,
      influenceScore,
      trend: weeklyBliks > expectedWeeklyBliks ? 'up' : weeklyBliks < expectedWeeklyBliks ? 'down' : 'stable'
    };
  };

  // ⭐ РАСЧЕТ МЕТРИК ЦЕННОСТИ
  const calculateValueMetrics = () => {
    const ratedBliks = userBliks.filter(blik => blik.rating && blik.rating > 0);
    
    const averageRating = ratedBliks.length > 0
      ? ratedBliks.reduce((sum, blik) => sum + (blik.rating || 0), 0) / ratedBliks.length
      : 0;

    const valueScore = Math.round((averageRating / 5) * 100);

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: ratedBliks.filter(blik => blik.rating === stars).length,
      percentage: ratedBliks.length > 0 
        ? Math.round((ratedBliks.filter(blik => blik.rating === stars).length / ratedBliks.length) * 100)
        : 0
    }));

    return {
      averageRating,
      valueScore,
      totalRatings: ratedBliks.length,
      ratingDistribution
    };
  };

  // 🎯 РАСЧЕТ ОЦЕНОК ПО СУПЕРСИЛАМ
  const calculateSuperpowerRatings = () => {
    return user.topSuperpowers.slice(0, 5).map(sp => {
      const spBliks = userBliks.filter(blik => blik.superpower.name === sp.name);
      const ratedSpBliks = spBliks.filter(blik => blik.rating && blik.rating > 0);
      
      const avgRating = ratedSpBliks.length > 0
        ? ratedSpBliks.reduce((sum, blik) => sum + (blik.rating || 0), 0) / ratedSpBliks.length
        : 0;

      const frequency = spBliks.length;
      const weeklyFrequency = spBliks.filter(blik => {
        const daysAgo = blik.timestamp.includes('час') ? 0 : 
                       blik.timestamp.includes('день') ? parseInt(blik.timestamp) : 7;
        return daysAgo <= 7;
      }).length;

      return {
        ...sp,
        avgRating: Math.round(avgRating * 10) / 10,
        frequency,
        weeklyFrequency,
        ratedCount: ratedSpBliks.length
      };
    });
  };

  const influenceMetrics = calculateInfluenceMetrics();
  const valueMetrics = calculateValueMetrics();
  const superpowerRatings = calculateSuperpowerRatings();

  // Средняя энергия суперсил
  const avgEnergy = user.topSuperpowers.length > 0 
    ? Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length)
    : 0;

  // Частота и качество для прогресс-баров
  const frequencyScore = Math.min(100, Math.round((influenceMetrics.weeklyBliks / influenceMetrics.expectedWeeklyBliks) * 100));
  const qualityScore = Math.min(100, Math.round((valueMetrics.averageRating / 5) * 100));

  // Данные для графика индекса влияния
  const influenceHistory = [
    32, 35, 29, 41, 38, 45, 52, 49, 56, 61, 58, 65, 70, 68, 74, 77, 73, 80, 85, 82, influenceMetrics.influenceScore
  ];

  // Объяснения метрик
  const metricExplanations = {
    valueScore: `${valueMetrics.valueScore}% - общая оценка ценности вашего бизнеса клиентами! ${valueMetrics.averageRating >= 4.5 ? 'Превосходно' : valueMetrics.averageRating >= 4.0 ? 'Отлично' : 'Хорошая база'}. Основано на средней оценке ${valueMetrics.averageRating.toFixed(1)} из 5 звезд.`,
    influencePower: `Показатель активности и влияния бизнеса: ${influenceMetrics.influenceScore}%. Рассчитывается по количеству бликов за неделю (${influenceMetrics.weeklyBliks} / ${influenceMetrics.expectedWeeklyBliks}). Это тот же индекс что отображается ниже в виде графика.`,
    frequency: `Частота получения отзывов и оценок. ${frequencyScore}% означает ${frequencyScore >= 80 ? 'очень высокую' : frequencyScore >= 60 ? 'хорошую' : 'умеренную'} активность клиентов!`,
    quality: `Качество предоставляемых услуг и продуктов. ${qualityScore}% означает ${qualityScore >= 80 ? 'превосходное' : qualityScore >= 60 ? 'хорошее' : 'достойное'} качество по оценкам клиентов.`,
    index: `Общий индекс влияния бизнеса: ${influenceMetrics.influenceScore}%. Рассчитывается на основе активности и количества получаемых отзывов. График показывает динамику роста за последние 3 недели.`
  };

  // Функции для цветов энергии
  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'from-emerald-500 to-emerald-400 text-emerald-400';
    if (energy >= 60) return 'from-yellow-500 to-yellow-400 text-yellow-400';
    if (energy >= 40) return 'from-orange-500 to-orange-400 text-orange-400';
    return 'from-red-500 to-red-400 text-red-400';
  };

  const getEnergyColorHex = (energy: number) => {
    if (energy >= 80) return '#10b981';
    if (energy >= 60) return '#f59e0b';
    if (energy >= 40) return '#f97316';
    return '#ef4444';
  };

  const getEnergyGradient = (energy: number) => {
    if (energy >= 80) return 'from-purple-500/20 via-pink-500/15 to-purple-500/20';
    if (energy >= 60) return 'from-blue-500/20 via-cyan-500/15 to-blue-500/20';
    if (energy >= 40) return 'from-yellow-500/20 via-orange-500/15 to-yellow-500/20';
    return 'from-orange-500/20 via-red-500/15 to-orange-500/20';
  };

  const getBorderColor = (energy: number) => {
    if (energy >= 80) return 'border-purple-500/30 hover:border-purple-400/50';
    if (energy >= 60) return 'border-blue-500/30 hover:border-blue-400/50';
    if (energy >= 40) return 'border-yellow-500/30 hover:border-yellow-400/50';
    return 'border-orange-500/30 hover:border-orange-400/50';
  };

  const getTextColor = (energy: number) => {
    if (energy >= 80) return 'text-purple-400';
    if (energy >= 60) return 'text-blue-400';
    if (energy >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground">
        {/* Status Bar */}
        <StatusBar />
        
        {/* HEADER - ИДЕНТИЧНО ЛИЧНОМУ ПРОФИЛЮ */}
        <div className="sticky top-0 z-10 glass-card border-b border-border/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-cyan-500/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                {/* Аватар компании */}
                <div className="relative">
                  <img
                    src={user.avatarImage}
                    alt={user.businessInfo?.companyName || user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gradient-to-r ring-cyan-400/40"
                    style={{
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), 4px 0 15px rgba(6, 182, 212, 0.2)'
                    }}
                  />
                  {/* Индикатор верификации */}
                  {user.businessInfo?.verified && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background shadow-lg shadow-blue-500/60 flex items-center justify-center">
                      <Award size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-xl flex items-center gap-2">
                    <span>Карта ценности</span>
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Map className="h-3.5 w-3.5 text-cyan-300" />
                    </div>
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {user.businessInfo?.companyName || user.name}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Три ключевых показателя в стиле личного профиля */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Арсенал суперсил */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-4 rounded-lg glass-card transition-all duration-300 hover:scale-105 hover:energy-glow group cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  {/* Иконка */}
                  <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center mb-2 shadow-lg group-hover:energy-glow transition-all duration-300">
                    <div className="text-foreground text-sm">⚡</div>
                  </div>
                  
                  {/* Основное значение */}
                  <div className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {user.metrics.superpowers}
                  </div>
                  
                  {/* Подпись */}
                  <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Суперсилы
                  </div>
                </div>
              </motion.div>

              {/* Энергетический заряд */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-4 rounded-lg glass-card transition-all duration-300 hover:scale-105 hover:energy-glow group"
              >
                <div className="relative">
                  <div className="flex flex-col items-center">
                    {/* Энергетическая иконка */}
                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center mb-2 shadow-lg group-hover:energy-glow transition-all duration-300">
                      <DynamicBattery 
                        level={avgEnergy}
                        className="w-4 h-4"
                      />
                    </div>
                    
                    {/* Основное значение */}
                    <div className={`text-xl font-bold mb-1 group-hover:scale-110 transition-transform ${(() => {
                      if (avgEnergy >= 80) return 'text-emerald-300';
                      if (avgEnergy >= 60) return 'text-yellow-300';
                      if (avgEnergy >= 40) return 'text-orange-300';
                      return 'text-red-300';
                    })()}`}>
                      {avgEnergy}%
                    </div>
                    
                    {/* Подпись */}
                    <div className="text-xs text-muted-foreground">Энергия суперсил</div>
                  </div>
                </div>
              </motion.div>

              {/* Коэффициент обмена */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center p-4 rounded-lg glass-card transition-all duration-300 hover:scale-105 hover:energy-glow group"
              >
                <div className="flex flex-col items-center">
                  {/* Иконка обмена */}
                  <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center mb-3 shadow-lg group-hover:energy-glow transition-all duration-300">
                    <div className="text-foreground text-sm">⚖️</div>
                  </div>
                    
                  {/* Стрелки с цифрами */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {(() => {
                      const receivedCount = user.metrics.bliks;
                      const givenCount = user.metrics.friends;
                      const isReceivingMore = receivedCount > givenCount;
                      const isGivingMore = givenCount > receivedCount;
                      
                      return (
                        <>
                          {/* Исходящие блики - слева (от нас) */}
                          <div className="flex items-center gap-1">
                            <div className="text-violet-400 text-lg">↑</div>
                            <div className={`font-bold transition-all duration-300 ${
                              isGivingMore 
                                ? 'text-xl text-violet-300' 
                                : 'text-lg text-violet-200'
                            }`}>
                              {givenCount}
                            </div>
                          </div>
                          
                          {/* Входящие блики - справа (к нам) */}
                          <div className="flex items-center gap-1">
                            <div className={`font-bold transition-all duration-300 ${
                              isReceivingMore 
                                ? 'text-xl text-emerald-300' 
                                : 'text-lg text-emerald-200'
                            }`}>
                              {receivedCount}
                            </div>
                            <div className="text-emerald-400 text-lg">↓</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Подпись */}
                  <div className="text-xs text-muted-foreground">Коэффициент обмена</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* 📊 ТЕКУЩИЕ РЕЗУЛЬТАТЫ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-xl bg-slate-700/40 border border-slate-600/30 space-y-4"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold text-slate-200">📊 Текущие результаты</h3>
              </div>
              
              {/* Два главных показателя рядом */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Ценность (на основе оценок клиентов) */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <span className="text-sm font-bold text-amber-300">💎 Ценность</span>
                      <InfoTooltip content={metricExplanations.valueScore} />
                    </div>
                    
                    {/* Увеличенная круговая диаграмма */}
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="40" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="6" fill="none" />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#valueGradient)"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(valueMetrics.valueScore * 251.33) / 100} 251.33`}
                          strokeLinecap="round"
                          className="drop-shadow-lg"
                          style={{
                            filter: `drop-shadow(0 0 8px ${getEnergyColorHex(valueMetrics.valueScore)}40)`
                          }}
                        />
                        <defs>
                          <linearGradient id="valueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-xl font-bold ${getEnergyColor(valueMetrics.valueScore).split(' ')[2]} drop-shadow-sm`}>
                          {valueMetrics.averageRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Средняя оценка клиентов</div>
                  </div>

                  {/* Влияние (активность бизнеса) */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <span className="text-sm font-bold text-purple-300">⚡ Влияние</span>
                      <InfoTooltip content={metricExplanations.influencePower} />
                    </div>
                    
                    {/* Увеличенная круговая диаграмма */}
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="40" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="6" fill="none" />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={getEnergyColorHex(influenceMetrics.influenceScore)}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(influenceMetrics.influenceScore * 251.33) / 100} 251.33`}
                          strokeLinecap="round"
                          className="drop-shadow-lg"
                          style={{
                            filter: `drop-shadow(0 0 8px ${getEnergyColorHex(influenceMetrics.influenceScore)}40)`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-xl font-bold ${getEnergyColor(influenceMetrics.influenceScore).split(' ')[2]} drop-shadow-sm`}>
                          {influenceMetrics.influenceScore}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Активность и влияние</div>
                  </div>
                </div>
              </div>

              {/* Статистическое описание */}
              <div className="text-center pt-4 mt-2 border-t border-slate-600/30">
                <div className="text-xs text-slate-400 leading-relaxed">
                  {valueMetrics.averageRating >= 4.5 && influenceMetrics.influenceScore >= 80 ? 
                    '🌟 Невероятные результаты! Высокая ценность и сильное влияние на рынке' :
                    valueMetrics.averageRating >= 4.0 ? 
                      '💎 Высокая ценность! Клиенты очень довольны вашими услугами' :
                      influenceMetrics.influenceScore >= 80 ? 
                        '⚡ Высокая активность! Вы активно развиваетесь и растете' :
                        'Отличная база для роста! Продолжайте развивать бизнес'
                  }
                </div>
              </div>
            </motion.div>

            {/* 💫 ВОВЛЕЧЕННОСТЬ КЛИЕНТОВ */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 rounded-xl bg-slate-700/40 border border-slate-600/30 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200">💫 Вовлеченность клиентов</h3>
                <div className="text-sm font-bold text-slate-300">{Math.round((frequencyScore + qualityScore) / 2)}/100</div>
              </div>

              {/* Список категорий с прогресс-барами */}
              <div className="space-y-4">
                {[
                  { name: 'Частота', value: frequencyScore, color: 'emerald', icon: '⚡', explanation: metricExplanations.frequency },
                  { name: 'Качество', value: qualityScore, color: 'cyan', icon: '💎', explanation: metricExplanations.quality }
                ].map((metric, index) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{metric.icon}</span>
                        <span className="text-sm text-slate-300 font-medium">{metric.name}</span>
                        <InfoTooltip content={metric.explanation} />
                      </div>
                      <span className="text-sm font-bold text-slate-200">{metric.value}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-600/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1.0, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          metric.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          metric.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                          'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}
                        style={{
                          boxShadow: `0 0 8px ${
                            metric.color === 'emerald' ? 'rgba(16, 185, 129, 0.4)' :
                            metric.color === 'cyan' ? 'rgba(6, 182, 212, 0.4)' :
                            'rgba(245, 158, 11, 0.4)'
                          }`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ГРАФИК-ЗМЕЙКА ИНДЕКСА ВЛИЯНИЯ */}
              <div className="space-y-2 pt-4 border-t border-slate-600/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="text-sm text-slate-300 font-medium">Индекс</span>
                    <InfoTooltip content={metricExplanations.index} />
                  </div>
                  <span className="text-sm font-bold text-amber-300">{influenceMetrics.influenceScore}%</span>
                </div>
                
                {/* График-змейка динамики индекса */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Динамика за 3 недели</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-emerald-400">+{Math.round(((influenceMetrics.influenceScore - influenceHistory[0]) / influenceHistory[0]) * 100)}%</span>
                      <span className="text-emerald-400 text-xs">↗</span>
                    </div>
                  </div>
                  
                  {/* SVG график-змейка */}
                  <div className="h-16 w-full">
                    <svg className="w-full h-full" viewBox="0 0 280 64" preserveAspectRatio="none">
                      {/* Сетка фона */}
                      <defs>
                        <pattern id="grid" width="14" height="16" patternUnits="userSpaceOnUse">
                          <path d="M 14 0 L 0 0 0 16" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="0.5"/>
                        </pattern>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9"/>
                          <stop offset="100%" stopColor="#fcd34d" stopOpacity="1"/>
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      
                      <rect width="280" height="64" fill="url(#grid)" />
                      
                      {/* Построение точек змейки */}
                      {(() => {
                        const points = influenceHistory.map((value, index) => {
                          const x = (index / (influenceHistory.length - 1)) * 280;
                          const y = 64 - ((value / 100) * 64);
                          return `${x},${y}`;
                        }).join(' ');
                        
                        const pathD = influenceHistory.reduce((path, value, index) => {
                          const x = (index / (influenceHistory.length - 1)) * 280;
                          const y = 64 - ((value / 100) * 64);
                          if (index === 0) return `M ${x} ${y}`;
                          return `${path} L ${x} ${y}`;
                        }, '');
                        
                        const areaPathD = `${pathD} L 280 64 L 0 64 Z`;
                        
                        return (
                          <>
                            {/* Область под кривой */}
                            <motion.path
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                              d={areaPathD}
                              fill="url(#areaGradient)"
                            />
                            
                            {/* Основная линия змейки */}
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                              d={pathD}
                              stroke="url(#lineGradient)"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))'
                              }}
                            />
                            
                            {/* Точки на графике */}
                            {influenceHistory.map((value, index) => {
                              const x = (index / (influenceHistory.length - 1)) * 280;
                              const y = 64 - ((value / 100) * 64);
                              return (
                                <motion.circle
                                  key={index}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 1 + (index * 0.05) }}
                                  cx={x}
                                  cy={y}
                                  r={index === influenceHistory.length - 1 ? "3" : "1.5"}
                                  fill={index === influenceHistory.length - 1 ? "#fbbf24" : "#f59e0b"}
                                  className={index === influenceHistory.length - 1 ? "animate-pulse" : ""}
                                  style={{
                                    filter: index === influenceHistory.length - 1 ? 
                                      'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' : 
                                      'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))'
                                  }}
                                />
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* Подписи осей */}
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>3 нед назад</span>
                    <span>Сейчас</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 💎 СУПЕРСИЛЫ БИЗНЕСА */}
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            id="superpowers-section"
          >
            <div className="mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Zap size={18} className="text-purple-400" />
                <span>Суперсилы бизнеса</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {superpowerRatings.map((sp, index) => (
                <motion.button
                  key={sp.name}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -6,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSuperpowerClick(sp.name)}
                  className={`
                    relative overflow-hidden rounded-2xl p-4
                    bg-gradient-to-br ${getEnergyGradient(sp.energy)}
                    border ${getBorderColor(sp.energy)}
                    transition-all duration-300
                    hover:shadow-xl
                    backdrop-blur-sm
                    min-h-[160px]
                    group
                  `}
                >
                  {/* Энергетическое свечение */}
                  {sp.energy > 70 && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
                  )}
                  
                  {/* Индикатор высокой энергии */}
                  {sp.energy > 80 && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
                  )}
                  
                  {/* Заголовок с эмодзи */}
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl flex items-center justify-center w-10 h-10 text-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 group-hover:scale-110 transition-transform">
                        {sp.emoji}
                      </div>
                    </div>
                  </div>
                  
                  {/* Название */}
                  <div className="relative z-10 mb-3">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {sp.name}
                    </h3>
                  </div>
                  
                  {/* Метрики */}
                  <div className="relative z-10 space-y-2">
                    {/* Оценка */}
                    {sp.avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">{sp.avgRating}</span>
                        <span className="text-white/40 text-xs">({sp.ratedCount})</span>
                      </div>
                    )}
                    
                    {/* Энергия */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            sp.energy >= 80 ? 'from-purple-400 to-pink-400' :
                            sp.energy >= 60 ? 'from-blue-400 to-cyan-400' :
                            sp.energy >= 40 ? 'from-yellow-400 to-orange-400' :
                            'from-orange-400 to-red-400'
                          } transition-all duration-500`}
                          style={{ width: `${sp.energy}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getTextColor(sp.energy)}`}>
                        {sp.energy}%
                      </span>
                    </div>
                    
                    {/* Частота */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{sp.frequency} бликов</span>
                      <span className={`font-semibold ${
                        sp.weeklyFrequency >= 3 ? 'text-green-400' :
                        sp.weeklyFrequency >= 2 ? 'text-cyan-400' :
                        sp.weeklyFrequency >= 1 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {sp.weeklyFrequency}/нед
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 👥 ВНИМАНИЕ ДРУГИХ - РАСПРЕДЕЛЕНИЕ ОЦЕНОК */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 glass-card rounded-2xl p-5 border border-white/10"
          >
            <div className="mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <span>👥 Внимание других</span>
              </h3>
              <p className="text-white/60 text-xs mt-1">
                {valueMetrics.averageRating >= 4 ? 'Высокая ценность — Тебя очень уважают' : 'Ценность растет — Продолжай развиваться'}
              </p>
            </div>
            
            <div className="space-y-3">
              {valueMetrics.ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex gap-0.5 w-16">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-white/60 text-sm w-16 text-right">
                    {count} ({percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}