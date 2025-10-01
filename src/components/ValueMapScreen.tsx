import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Filter, Search, Grid3X3, BarChart3, Map, Battery, TrendingUp, TrendingDown, Minus, Eye, EyeOff, Heart, Users, Info } from 'lucide-react';
import { DynamicBattery } from './DynamicBattery';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion, AnimatePresence } from 'motion/react';

interface Superpower {
  name: string;
  emoji: string;
  bliks: number;
  energy: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  isOwn: boolean;
  ownerName: string;
  ownerAvatar: string;
}

interface BlikData {
  id: string;
  type: 'text' | 'photo' | 'video';
  content: string;
  mediaUrl?: string;
  author: {
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
  recipient: {
    name: string;
    avatar: string;
  };
  superpower: {
    name: string;
    emoji: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  likedBy?: Array<{ name: string; avatar: string; }>;
  commentsList?: Array<{
    id: string;
    author: { name: string; avatar: string; };
    content: string;
    timestamp: string;
  }>;
}

interface ValueMapScreenProps {
  superpowers: Superpower[];
  onBack: () => void;
  onShare: () => void;
  onSuperpowerClick: (superpowerName: string) => void;
  user: {
    name: string;
    avatarImage: string;
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
  sentBliks?: BlikData[];
}

type ViewMode = 'grid' | 'map' | 'chart';
type FilterCategory = 'all' | 'Mind' | 'Соул' | 'Тело' | 'Флоу';
type SortBy = 'energy' | 'bliks' | 'name';

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





export function ValueMapScreen({
  superpowers,
  onBack,
  onShare,
  onSuperpowerClick,
  user,
  sentBliks = []
}: ValueMapScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortBy>('energy');
  const [showOnlyOwn, setShowOnlyOwn] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция для прокрутки к секции суперсил
  const scrollToSuperpowers = () => {
    const superpowersSection = document.getElementById('superpowers-section');
    if (superpowersSection) {
      superpowersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Фильтрация и сортировка суперсил
  const filteredSuperpowers = superpowers
    .filter(sp => {
      const matchesSearch = sp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || sp.category === filterCategory;
      const matchesOwnership = !showOnlyOwn || sp.isOwn;
      return matchesSearch && matchesCategory && matchesOwnership;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'energy':
          return b.energy - a.energy;
        case 'bliks':
          return b.bliks - a.bliks;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Получаем цвет энергии
  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'from-emerald-500 to-emerald-400 text-emerald-400 border-emerald-500/40';
    if (energy >= 60) return 'from-yellow-500 to-yellow-400 text-yellow-400 border-yellow-500/40';
    if (energy >= 40) return 'from-orange-500 to-orange-400 text-orange-400 border-orange-500/40';
    return 'from-red-500 to-red-400 text-red-400 border-red-500/40';
  };

  // Получаем hex цвет для SVG кругов
  const getEnergyColorHex = (energy: number) => {
    if (energy >= 80) return '#10b981'; // emerald-500
    if (energy >= 60) return '#f59e0b'; // yellow-500
    if (energy >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  // Получаем иконку тренда
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-400" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  // Статистика
  const ownSuperpowers = superpowers.filter(sp => sp.isOwn);
  const avgEnergy = ownSuperpowers.length > 0 
    ? Math.round(ownSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / ownSuperpowers.length)
    : 0;
  const totalBliks = ownSuperpowers.reduce((sum, sp) => sum + sp.bliks, 0);
  
  // Дополнительные метрики для разнообразия
  const sentBliksCount = sentBliks?.length || 12; // Количество отправленных бликов (моковое значение, если нет данных)
  const influencePower = Math.min(100, Math.round((sentBliksCount / 15) * 100)); // Сила влияния на основе отправленных бликов
  const maxEnergy = ownSuperpowers.length > 0 ? Math.max(...ownSuperpowers.map(sp => sp.energy)) : 0; // Максимальная энергия
  const minEnergy = ownSuperpowers.length > 0 ? Math.min(...ownSuperpowers.map(sp => sp.energy)) : 0; // Минимальная энергия
  const consistency = ownSuperpowers.length > 0 && maxEnergy > 0 
    ? Math.max(20, 100 - Math.round(((maxEnergy - minEnergy) / maxEnergy) * 100)) 
    : 0; // Стабильность - обратная разброса

  // ИСПРАВЛЕНО: Индекс теперь равен показателю влияния - одна и та же метрика!
  const influenceIndex = influencePower; // Это один и тот же показатель

  // Данные для змейки индекса влияния - моковая динамика по дням
  const influenceHistory = [
    32, 35, 29, 41, 38, 45, 52, 49, 56, 61, 58, 65, 70, 68, 74, 77, 73, 80, 85, 82, influenceIndex
  ];

  // Объяснения метрик - теперь внутри компонента с доступом ко всем переменным
  const metricExplanations = {
    keyIndicators: "Общий индекс твоей ценности в сообществе Bliq. Рассчитывается на основе твоей средней энергии всех суперсил, количества полученных бликов и активности друзей в твоих суперсилах.",
    generalScore: `${avgEnergy}% - это твой общий показатель ценности в сообществе! ${avgEnergy >= 80 ? 'Отличный' : avgEnergy >= 60 ? 'Хороший' : 'Развивающийся'} уровень означает, что ты ${avgEnergy >= 80 ? 'очень активный и влиятельный' : avgEnergy >= 60 ? 'активный' : 'развивающийся'} участник. Рассчитывается на основе средней энергии суперсил.`,
    averageEnergy: `Средняя энергия всех твоих суперсил: ${avgEnergy}%. Показывает общий уровень твоей активности и развития. Энергия растет когда ты получаешь блики и поддержку от друзей.`,
    influencePower: `Показатель твоего вклада в развитие суперсил друзей: ${influencePower}%. Это тот же индекс что отображается ниже в виде графика. Рассчитывается по количеству и качеству созданных тобой бликов - чем больше и ярче твои блики, тем сильнее твоё влияние.`,
    consistency: `Стабильность развития: ${consistency}%. Показывает, насколько равномерно развиты твои суперсилы. ${consistency >= 80 ? 'Отличная стабильность' : consistency >= 60 ? 'Хорошая стабильность' : 'Есть перекосы в развитии'} - ${consistency >= 80 ? 'все суперсилы развиты гармонично' : consistency >= 60 ? 'большинство суперсил развиты равномерно' : 'стоит подтянуть отстающие области'}.`,
    frequency: "Как часто ты отправляешь блики друзьям. 92% означает, что ты очень активно поддерживаешь других! Высокая частота показывает, что ты регулярно замечаешь таланты друзей.",
    quality: "Насколько содержательные и значимые твои блики. 78% означает, что твои блики действительно ценны и помогают друзьям расти. Учитывается длина сообщений, эмоциональность, персонализация.",
    index: `Общий показатель твоего влияния на развитие суперсил друзей: ${influenceIndex}%. Рассчитывается на основе количества и качества отправленных бликов. График показывает динамику роста за последние 3 недели - видно как твоё влияние развивается!`,
    monthlyActivity: "Показывает твою активность по дням месяца. Зеленые полоски = дни с высокой активностью, желтые/оранжевые = средняя активность. +100% означает, что твоя активность выросла в 2 раза за месяц!"
  };

  // Получение цветовой схемы по категории суперсилы
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Mind':
        return {
          gradient: 'from-purple-500/15 via-violet-500/12 to-indigo-500/15',
          border: 'border-purple-500/30 hover:border-purple-400/50',
          shadow: 'hover:shadow-xl hover:shadow-purple-500/25 shadow-lg shadow-purple-500/15',
          ring: 'ring-purple-400/30',
          iconBg: 'from-purple-500/35 to-violet-500/35',
          iconShadow: 'shadow-purple-500/35',
          iconShadowStyle: '0 0 12px rgba(168, 85, 247, 0.4), 0 4px 20px rgba(168, 85, 247, 0.25)',
          glowBg: 'from-purple-500/12 via-violet-500/10 to-indigo-500/12',
          borderColor: 'border-purple-500/25',
          badgeBg: 'bg-purple-500/25 text-purple-400 border-purple-500/35 shadow-lg shadow-purple-500/20',
          textColor: 'text-purple-400',
          batteryColor: 'text-purple-400',
          textShadow: '0 0 8px rgba(168, 85, 247, 0.6)',
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(168, 85, 247, 0.1)',
          iconGlow: 'from-purple-500/6 via-transparent to-violet-500/6'
        };
      case 'Соул':
        return {
          gradient: 'from-pink-500/15 via-rose-500/12 to-red-500/15',
          border: 'border-pink-500/30 hover:border-pink-400/50',
          shadow: 'hover:shadow-xl hover:shadow-pink-500/25 shadow-lg shadow-pink-500/15',
          ring: 'ring-pink-400/30',
          iconBg: 'from-pink-500/35 to-rose-500/35',
          iconShadow: 'shadow-pink-500/35',
          iconShadowStyle: '0 0 12px rgba(236, 72, 153, 0.4), 0 4px 20px rgba(236, 72, 153, 0.25)',
          glowBg: 'from-pink-500/12 via-rose-500/10 to-red-500/12',
          borderColor: 'border-pink-500/25',
          badgeBg: 'bg-pink-500/25 text-pink-400 border-pink-500/35 shadow-lg shadow-pink-500/20',
          textColor: 'text-pink-400',
          batteryColor: 'text-pink-400',
          textShadow: '0 0 8px rgba(236, 72, 153, 0.6)',
          boxShadow: '0 0 12px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(236, 72, 153, 0.1)',
          iconGlow: 'from-pink-500/6 via-transparent to-rose-500/6'
        };
      case 'Тело':
        return {
          gradient: 'from-emerald-500/15 via-green-500/12 to-teal-500/15',
          border: 'border-emerald-500/30 hover:border-emerald-400/50',
          shadow: 'hover:shadow-xl hover:shadow-emerald-500/25 shadow-lg shadow-emerald-500/15',
          ring: 'ring-emerald-400/30',
          iconBg: 'from-emerald-500/35 to-green-500/35',
          iconShadow: 'shadow-emerald-500/35',
          iconShadowStyle: '0 0 12px rgba(16, 185, 129, 0.4), 0 4px 20px rgba(16, 185, 129, 0.25)',
          glowBg: 'from-emerald-500/12 via-green-500/10 to-teal-500/12',
          borderColor: 'border-emerald-500/25',
          badgeBg: 'bg-emerald-500/25 text-emerald-400 border-emerald-500/35 shadow-lg shadow-emerald-500/20',
          textColor: 'text-emerald-400',
          batteryColor: 'text-emerald-400',
          textShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(16, 185, 129, 0.1)',
          iconGlow: 'from-emerald-500/6 via-transparent to-green-500/6'
        };
      case 'Флоу':
        return {
          gradient: 'from-cyan-500/15 via-blue-500/12 to-sky-500/15',
          border: 'border-cyan-500/30 hover:border-cyan-400/50',
          shadow: 'hover:shadow-xl hover:shadow-cyan-500/25 shadow-lg shadow-cyan-500/15',
          ring: 'ring-cyan-400/30',
          iconBg: 'from-cyan-500/35 to-blue-500/35',
          iconShadow: 'shadow-cyan-500/35',
          iconShadowStyle: '0 0 12px rgba(34, 211, 238, 0.4), 0 4px 20px rgba(34, 211, 238, 0.25)',
          glowBg: 'from-cyan-500/12 via-blue-500/10 to-sky-500/12',
          borderColor: 'border-cyan-500/25',
          badgeBg: 'bg-cyan-500/25 text-cyan-400 border-cyan-500/35 shadow-lg shadow-cyan-500/20',
          textColor: 'text-cyan-400',
          batteryColor: 'text-cyan-400',
          textShadow: '0 0 8px rgba(34, 211, 238, 0.6)',
          boxShadow: '0 0 12px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(34, 211, 238, 0.1)',
          iconGlow: 'from-cyan-500/6 via-transparent to-blue-500/6'
        };
      default:
        // Нейтральная схема для неизвестных категорий
        return {
          gradient: 'from-slate-500/8 via-gray-500/10 to-slate-600/12',
          border: 'border-slate-500/20 hover:border-slate-400/35',
          shadow: 'hover:shadow-lg hover:shadow-slate-500/10',
          ring: 'ring-slate-400/20',
          iconBg: 'from-slate-500/25 to-gray-500/25',
          iconShadow: 'shadow-slate-500/25',
          iconShadowStyle: '0 0 8px rgba(100, 116, 139, 0.3), 0 2px 12px rgba(100, 116, 139, 0.15)',
          glowBg: 'from-slate-500/6 via-gray-500/5 to-slate-600/7',
          borderColor: 'border-slate-500/15',
          badgeBg: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
          textColor: 'text-slate-400',
          batteryColor: 'text-slate-400',
          textShadow: 'none',
          boxShadow: 'none',
          iconGlow: 'from-slate-500/4 via-transparent to-gray-500/4'
        };
    }
  };

  // Компонент карточки суперсилы для карты
  const SuperpowerMapCard = ({ superpower, index }: { superpower: Superpower; index: number }) => {
    const energyColors = getEnergyColor(superpower.energy);
    const categoryColors = getCategoryColors(superpower.category);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.08,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 12
        }}
        whileHover={{ 
          scale: 1.05, 
          y: -8, 
          rotateY: 5,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Сразу скроллим к верху перед переходом
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Небольшая задержка для плавности
          setTimeout(() => {
            onSuperpowerClick(superpower.name);
          }, 100);
        }}
        className="relative cursor-pointer group transition-all duration-300 col-span-1 row-span-1"
      >
        {/* Карточка с цветовой схемой по категории */}
        <div className={`
          h-full p-4 rounded-2xl relative overflow-hidden
          bg-gradient-to-br ${categoryColors.gradient}
          border ${categoryColors.border}
          transition-all duration-300 
          ${categoryColors.shadow}
          backdrop-blur-sm
          min-h-[140px]
          ${superpower.isOwn ? `ring-1 ${categoryColors.ring}` : ''}
        `}>
          
          {/* Энергетическое свечение для высокоэнергетичных суперсил */}
          {superpower.energy > 70 && (
            <div className={`absolute inset-0 animate-pulse bg-gradient-to-br ${categoryColors.glowBg}`} />
          )}
          
          {/* Дополнительное неоновое свечение для собственных суперсил */}
          {superpower.isOwn && (
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors.iconGlow} animate-pulse`} />
          )}
          
          {/* Индикатор владения с цветом категории */}
          {superpower.isOwn && (
            <div className={`absolute top-2 right-2 w-2 h-2 ${categoryColors.textColor.replace('text-', 'bg-')} rounded-full animate-pulse shadow-xl`}
                 style={{
                   boxShadow: categoryColors.iconShadowStyle
                 }} />
          )}
          
          {/* Заголовок с эмодзи и именем */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`
                rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300
                w-8 h-8 text-xl
                bg-gradient-to-br ${categoryColors.iconBg}
                ${superpower.energy > 80 ? categoryColors.iconShadow : ''}
              `}
              style={superpower.energy > 80 ? {
                boxShadow: categoryColors.iconShadowStyle
              } : {}}>
                <span className={superpower.energy > 90 ? 'animate-pulse' : ''}>
                  {superpower.emoji}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground truncate text-sm">
                  {superpower.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getTrendIcon(superpower.trend)}
                  <span>{superpower.isOwn ? 'Ваша' : superpower.ownerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Энергия и блики */}
          <div className="space-y-3">
            {/* Прогресс энергии */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Энергия</span>
                <span className={`text-sm font-medium ${energyColors.split(' ')[2]}`}>
                  {superpower.energy}%
                </span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${superpower.energy}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${energyColors.split(' ')[0]} ${energyColors.split(' ')[1]} rounded-full relative`}
                >
                  {/* Энергетическое свечение */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${energyColors.split(' ')[0]} ${energyColors.split(' ')[1]} blur-sm opacity-60`} />
                  {/* Дополнительный световой эффект для высокой энергии */}
                  {superpower.energy > 80 && (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Блики */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Блики</span>
              <div className="flex items-center gap-1">
                <DynamicBattery 
                  level={superpower.energy}
                  className={`${superpower.energy > 80 || superpower.isOwn ? 'drop-shadow-xl' : ''}`}
                  style={{
                    filter: superpower.energy > 80 || superpower.isOwn ? 
                      `drop-shadow(0 0 6px ${categoryColors.textColor.includes('purple') ? 'rgba(168, 85, 247, 0.8)' : 
                        categoryColors.textColor.includes('pink') ? 'rgba(236, 72, 153, 0.8)' :
                        categoryColors.textColor.includes('emerald') ? 'rgba(16, 185, 129, 0.8)' :
                        categoryColors.textColor.includes('cyan') ? 'rgba(34, 211, 238, 0.8)' : 'rgba(100, 116, 139, 0.6)'}) drop-shadow(0 0 12px ${categoryColors.textColor.includes('purple') ? 'rgba(168, 85, 247, 0.4)' : 
                        categoryColors.textColor.includes('pink') ? 'rgba(236, 72, 153, 0.4)' :
                        categoryColors.textColor.includes('emerald') ? 'rgba(16, 185, 129, 0.4)' :
                        categoryColors.textColor.includes('cyan') ? 'rgba(34, 211, 238, 0.4)' : 'rgba(100, 116, 139, 0.2)'})` : 'none'
                  }}
                />
                <span className={`text-sm font-medium ${categoryColors.textColor} ${superpower.energy > 80 || superpower.isOwn ? 'drop-shadow-xl' : ''}`}
                style={{
                  filter: superpower.energy > 80 || superpower.isOwn ? 
                    `drop-shadow(0 0 6px ${categoryColors.textColor.includes('purple') ? 'rgba(168, 85, 247, 0.8)' : 
                      categoryColors.textColor.includes('pink') ? 'rgba(236, 72, 153, 0.8)' :
                      categoryColors.textColor.includes('emerald') ? 'rgba(16, 185, 129, 0.8)' :
                      categoryColors.textColor.includes('cyan') ? 'rgba(34, 211, 238, 0.8)' : 'rgba(100, 116, 139, 0.6)'}) drop-shadow(0 0 12px ${categoryColors.textColor.includes('purple') ? 'rgba(168, 85, 247, 0.4)' : 
                      categoryColors.textColor.includes('pink') ? 'rgba(236, 72, 153, 0.4)' :
                      categoryColors.textColor.includes('emerald') ? 'rgba(16, 185, 129, 0.4)' :
                      categoryColors.textColor.includes('cyan') ? 'rgba(34, 211, 238, 0.4)' : 'rgba(100, 116, 139, 0.2)'})` : 'none'
                }}
                >
                  {superpower.bliks}
                </span>
              </div>
            </div>
          </div>

          {/* Категория */}
          <div className={`mt-3 pt-2 border-t ${categoryColors.borderColor}`}>
            <Badge 
              variant="secondary" 
              className={`text-xs transition-all duration-300 ${categoryColors.badgeBg}`}
              style={{
                textShadow: categoryColors.textShadow,
                boxShadow: categoryColors.boxShadow
              }}
            >
              {superpower.category}
            </Badge>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground">
        {/* Status Bar */}
        <StatusBar />
        
        {/* Header */}
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
              {/* Аватар владельца карты */}
              <div className="relative">
                <img
                  src={user.avatarImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gradient-to-r ring-cyan-400/40"
                  style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), 4px 0 15px rgba(6, 182, 212, 0.2)'
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background shadow-lg shadow-emerald-400/60" />
              </div>
              <div>
                <h1 className="font-bold text-xl flex items-center gap-2">
                  <span>Карта ценности</span>
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Map className="h-3.5 w-3.5 text-cyan-300" />
                  </div>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user.name}
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

        {/* Три ключевых показателя в стиле сайдбара */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {/* Арсенал суперсил */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={scrollToSuperpowers}
              className="text-center p-4 rounded-lg glass-card transition-all duration-300 hover:scale-105 hover:energy-glow group cursor-pointer"
            >
              <div className="flex flex-col items-center">
                {/* Иконка */}
                <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center mb-2 shadow-lg group-hover:energy-glow transition-all duration-300">
                  <div className="text-foreground text-sm">⚡</div>
                </div>
                
                {/* Основное значение */}
                <div className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {ownSuperpowers.length}
                </div>
                
                {/* Подпись */}
                <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Суперсилы
                  <div className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
                    Нажми чтобы перейти ⬇
                  </div>
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

            {/* Коэффициент обмена - с понятными стрелками */}
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
                    const receivedCount = sentBliks.length > 0 ? totalBliks : 247;
                    const givenCount = sentBliks.length || 164;
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

        {/* Дополнительные аналитические блоки */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Ключевые показатели - кольцевые диаграммы */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-xl bg-slate-700/40 border border-slate-600/30 space-y-4"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold text-slate-200">📊 Твои текущие результаты</h3>
              </div>
              
              {/* Главные достижения - два ключевых показателя */}
              <div className="space-y-6">
                {/* Два главных показателя рядом */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Ценность (Общий показатель) */}
                  <div className="text-center">
                    {/* Заголовок */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <span className="text-sm font-bold text-amber-300">💎 Ценность</span>
                      <InfoTooltip content={metricExplanations.generalScore} />
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
                          strokeDasharray={`${(avgEnergy * 251.33) / 100} 251.33`}
                          strokeLinecap="round"
                          className="drop-shadow-lg"
                          style={{
                            filter: `drop-shadow(0 0 8px ${getEnergyColorHex(avgEnergy)}40)`
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
                        <div className={`text-xl font-bold ${getEnergyColor(avgEnergy).split(' ')[2]} drop-shadow-sm`}>
                          {avgEnergy}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Твоя общая ценность</div>
                  </div>

                  {/* Влияние (Сила влияния) */}
                  <div className="text-center">
                    {/* Заголовок */}
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
                          stroke={getEnergyColorHex(influencePower)}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(influencePower * 251.33) / 100} 251.33`}
                          strokeLinecap="round"
                          className="drop-shadow-lg"
                          style={{
                            filter: `drop-shadow(0 0 8px ${getEnergyColorHex(influencePower)}40)`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-xl font-bold ${getEnergyColor(influencePower).split(' ')[2]} drop-shadow-sm`}>
                          {influencePower}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Твоя сила влияния</div>
                  </div>
                </div>
              </div>

              {/* Статистическое описание */}
              <div className="text-center pt-4 mt-2 border-t border-slate-600/30">
                <div className="text-xs text-slate-400 leading-relaxed">
                  {maxEnergy >= 90 && influencePower >= 80 ? 
                    '🌟 Невероятные результаты! Ты — настоящий эксперт, который сильно влияет на других' :
                    maxEnergy >= 80 ? 
                      '💎 Высокая ценность! Тебя очень уважают за твои уникальные качества' :
                      influencePower >= 80 ? 
                        '⚡ Мощное влияние! Ты вдохновляешь и мотивируешь окружающих' :
                        'Отличная база для роста! Продолжай развивать свои суперсилы'
                  }
                </div>
              </div>
            </motion.div>

            {/* Внимание другим - прогресс-бары */}  
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 rounded-xl bg-slate-700/40 border border-slate-600/30 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200">💫 Внимание другим</h3>
                <div className="text-sm font-bold text-slate-300">67/100</div>
              </div>

              {/* Список категорий с прогресс-барами */}
              <div className="space-y-4">
                {[
                  { name: 'Частота', value: 92, color: 'emerald', icon: '⚡', explanation: metricExplanations.frequency },
                  { name: 'Качество', value: 78, color: 'cyan', icon: '💎', explanation: metricExplanations.quality }
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

              {/* НОВЫЙ КОМПОНЕНТ: Индекс влияния как змейка */}
              <div className="space-y-2 pt-4 border-t border-slate-600/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="text-sm text-slate-300 font-medium">Индекс</span>
                    <InfoTooltip content={metricExplanations.index} />
                  </div>
                  <span className="text-sm font-bold text-amber-300">{influenceIndex}%</span>
                </div>
                
                {/* График-змейка динамики индекса */}
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Динамика за 3 недели</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-emerald-400">+{Math.round(((influenceIndex - influenceHistory[0]) / influenceHistory[0]) * 100)}%</span>
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
                    <span>сегодня</span>
                  </div>
                </div>
              </div>

              {/* Месячная активность - мини-график */}
              <div className="pt-4 border-t border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-sm text-slate-400">Месячная активность</div>
                    <InfoTooltip content={metricExplanations.monthlyActivity} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-emerald-400">+100%</div>
                    <div className="text-emerald-400">↗</div>
                  </div>
                </div>
                
                {/* Мини-барчарт */}
                <div className="flex items-end justify-between gap-1 h-8">
                  {[65, 45, 78, 52, 89, 67, 91, 73, 85, 69, 94, 82, 76, 88].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: 0.9 + index * 0.05 }}
                      className={`flex-1 rounded-t-sm ${
                        index % 3 === 0 ? 'bg-emerald-400' :
                        index % 3 === 1 ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{
                        filter: `drop-shadow(0 0 4px ${
                          index % 3 === 0 ? 'rgba(16, 185, 129, 0.6)' :
                          index % 3 === 1 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(245, 158, 11, 0.6)'
                        })`
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>2 нед назад</span>
                  <span>сегодня</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Заголовок секции суперсил */}
        <div id="superpowers-section" className="px-4 pb-2">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-sm">⚡</span>
            </div>
            Суперсилы
          </h2>
        </div>

        {/* Фильтры и поиск */}
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Поиск суперсил..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/50 border-border/50"
              />
            </div>
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as FilterCategory)}>
              <SelectTrigger className="w-32 bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="Mind">Mind</SelectItem>
                <SelectItem value="Соул">Соул</SelectItem>
                <SelectItem value="Тело">Тело</SelectItem>
                <SelectItem value="Флоу">Флоу</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <Map className="h-4 w-4" />
                Карта
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Сетка
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                График
              </Button>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-24 bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energy">Энергия</SelectItem>
                <SelectItem value="bliks">Блики</SelectItem>
                <SelectItem value="name">Имя</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {viewMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Карта в стиле Pinterest/Masonry - единообразные размеры карточек */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-3 md:gap-4">
                {filteredSuperpowers.map((superpower, index) => (
                  <SuperpowerMapCard 
                    key={superpower.name} 
                    superpower={superpower} 
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Сетка в стиле таблицы */}
              <div className="space-y-3">
                {/* Заголовок */}
                <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                  <div>Суперсила</div>
                  <div>Категория</div>
                  <div>Энергия</div>
                  <div>Блики</div>
                  <div>Тренд</div>
                </div>
                
                {/* Данные */}
                <div className="space-y-2">
                  {filteredSuperpowers.map((superpower, index) => (
                    <motion.div
                      key={superpower.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => {
                        // Сразу скроллим к верху перед переходом
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        // Небольшая задержка для плавности
                        setTimeout(() => {
                          onSuperpowerClick(superpower.name);
                        }, 100);
                      }}
                      className="grid grid-cols-5 gap-4 p-3 bg-card/50 hover:bg-card/80 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{superpower.emoji}</span>
                        <span className="font-medium">{superpower.name}</span>
                        {superpower.isOwn && <div className="w-2 h-2 bg-cyan-400 rounded-full" />}
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-xs">
                          {superpower.category}
                        </Badge>
                      </div>
                      <div className={`font-medium ${getEnergyColor(superpower.energy).split(' ')[2]}`}>
                        {superpower.energy}%
                      </div>
                      <div className="font-medium">
                        {superpower.bliks}
                      </div>
                      <div>
                        {getTrendIcon(superpower.trend)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Диаграмма энергии */}
              <div className="bg-card/50 rounded-2xl p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Распределение энергии
                </h3>
                <div className="space-y-4">
                  {filteredSuperpowers.map((superpower, index) => (
                    <motion.div
                      key={superpower.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">{superpower.emoji}</span>
                        <span className="text-sm font-medium truncate">{superpower.name}</span>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${superpower.energy}%` }}
                            transition={{ duration: 1, delay: index * 0.05 }}
                            className={`h-full bg-gradient-to-r ${getEnergyColor(superpower.energy).split(' ')[0]} ${getEnergyColor(superpower.energy).split(' ')[1]} rounded-full`}
                          />
                        </div>
                      </div>
                      <div className={`text-sm font-medium w-12 text-right ${getEnergyColor(superpower.energy).split(' ')[2]}`}>
                        {superpower.energy}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredSuperpowers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Суперсилы не найдены</p>
              <p className="text-sm">Попробуйте изменить фильтры или поисковой запрос</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}