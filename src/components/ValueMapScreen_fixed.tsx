import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Filter, Search, Grid3X3, BarChart3, Map, Battery, TrendingUp, TrendingDown, Minus, Eye, EyeOff, Heart, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  const avgEnergy = Math.round(ownSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / ownSuperpowers.length);
  const totalBliks = ownSuperpowers.reduce((sum, sp) => sum + sp.bliks, 0);

  // Компонент карточки суперсилы для карты
  const SuperpowerMapCard = ({ superpower, index }: { superpower: Superpower; index: number }) => {
    const colors = getEnergyColor(superpower.energy);
    const isLarge = superpower.energy > 80;
    const isMedium = superpower.energy > 60;
    const size = isLarge ? 'large' : isMedium ? 'medium' : 'small';

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
        onClick={() => onSuperpowerClick(superpower.name)}
        className={`
          relative cursor-pointer group transition-all duration-300
          ${screenWidth >= 1920 ? 
            (size === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1') : 
            screenWidth >= 1280 ? 
            (size === 'large' ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1') : 
            'col-span-1 row-span-1'}
        `}
      >
        {/* Карточка в стиле сайдбара с энергетическим свечением */}
        <div className={`
          h-full p-4 rounded-2xl relative overflow-hidden
          ${superpower.isOwn ? 
            'bg-gradient-to-br from-cyan-500/15 via-blue-500/12 to-teal-500/15' :
            'bg-gradient-to-br from-slate-500/8 via-gray-500/10 to-slate-600/12'
          }
          ${superpower.isOwn ? 
            'border border-cyan-500/30 hover:border-cyan-400/50' : 
            'border border-slate-500/20 hover:border-slate-400/35'
          }
          transition-all duration-300 
          ${superpower.isOwn ? 
            'hover:shadow-xl hover:shadow-cyan-500/25 shadow-lg shadow-cyan-500/15' : 
            'hover:shadow-lg hover:shadow-slate-500/10'
          }
          backdrop-blur-sm
          ${size === 'large' ? 'min-h-[160px]' : size === 'medium' ? 'min-h-[140px]' : 'min-h-[120px]'}
          ${superpower.isOwn ? 'ring-1 ring-cyan-400/30' : ''}
        `}>
          
          {/* Энергетическое свечение для высокоэнергетичных суперсил */}
          {superpower.energy > 70 && (
            <div className={`absolute inset-0 animate-pulse ${
              superpower.isOwn ? 
                'bg-gradient-to-br from-cyan-500/12 via-blue-500/10 to-teal-500/12' :
                'bg-gradient-to-br from-orange-500/6 via-amber-500/5 to-yellow-500/7'
            }`} />
          )}
          
          {/* Дополнительное неоновое свечение для собственных суперсил */}
          {superpower.isOwn && (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-transparent to-blue-500/6 animate-pulse" />
          )}
          
          {/* Индикатор владения с усиленным неоновым свечением */}
          {superpower.isOwn && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-xl shadow-cyan-400/90"
                 style={{
                   boxShadow: '0 0 8px rgba(34, 211, 238, 0.9), 0 0 16px rgba(34, 211, 238, 0.6), 0 0 24px rgba(34, 211, 238, 0.4)'
                 }} />
          )}
          
          {/* Заголовок с эмодзи и именем */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`
                rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300
                ${size === 'large' ? 'w-10 h-10 text-2xl' : 'w-8 h-8 text-xl'}
                ${superpower.isOwn ? 
                  'bg-gradient-to-br from-cyan-500/35 to-blue-500/35' : 
                  'bg-gradient-to-br from-orange-500/25 to-amber-500/25'
                }
                ${superpower.energy > 80 ? 
                  (superpower.isOwn ? 
                    'shadow-xl shadow-cyan-500/35' : 
                    'shadow-lg shadow-orange-500/25'
                  ) : (superpower.isOwn ? 'shadow-lg shadow-cyan-500/20' : '')
                }
              `}
              style={superpower.isOwn ? {
                boxShadow: superpower.energy > 80 ? 
                  '0 0 12px rgba(34, 211, 238, 0.4), 0 4px 20px rgba(34, 211, 238, 0.25)' :
                  '0 0 8px rgba(34, 211, 238, 0.3), 0 2px 12px rgba(34, 211, 238, 0.15)'
              } : {}}>
                <span className={superpower.energy > 90 ? 'animate-pulse' : ''}>
                  {superpower.emoji}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`font-semibold text-foreground truncate ${size === 'large' ? 'text-base' : 'text-sm'}`}>
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
                <span className={`text-sm font-medium ${colors.split(' ')[2]}`}>
                  {superpower.energy}%
                </span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${superpower.energy}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${colors.split(' ')[0]} ${colors.split(' ')[1]} rounded-full relative`}
                >
                  {/* Энергетическое свечение */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.split(' ')[0]} ${colors.split(' ')[1]} blur-sm opacity-60`} />
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
                <Battery className={`h-3 w-3 ${
                  superpower.isOwn ? 'text-cyan-400' : 'text-orange-400'
                } ${superpower.energy > 80 || superpower.isOwn ? 'drop-shadow-xl' : ''}`} 
                style={{
                  filter: superpower.energy > 80 || superpower.isOwn ? 
                    (superpower.isOwn ? 
                      'drop-shadow(0 0 6px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 12px rgba(34, 211, 238, 0.4))' : 
                      'drop-shadow(0 0 4px rgba(251, 146, 60, 0.6))'
                    ) : 'none'
                }}
                />
                <span className={`text-sm font-medium ${
                  superpower.isOwn ? 'text-cyan-400' : 'text-orange-400'
                } ${superpower.energy > 80 || superpower.isOwn ? 'drop-shadow-xl' : ''}`}
                style={{
                  filter: superpower.energy > 80 || superpower.isOwn ? 
                    (superpower.isOwn ? 
                      'drop-shadow(0 0 6px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 12px rgba(34, 211, 238, 0.4))' : 
                      'drop-shadow(0 0 4px rgba(251, 146, 60, 0.6))'
                    ) : 'none'
                }}
                >
                  {superpower.bliks}
                </span>
              </div>
            </div>
          </div>

          {/* Категория */}
          <div className={`mt-3 pt-2 border-t ${
            superpower.isOwn ? 'border-cyan-500/25' : 'border-orange-500/15'
          }`}>
            <Badge 
              variant="secondary" 
              className={`text-xs transition-all duration-300 ${
                superpower.isOwn ? 
                  'bg-cyan-500/25 text-cyan-400 border-cyan-500/35 shadow-lg shadow-cyan-500/20' :
                  'bg-orange-500/15 text-orange-400 border-orange-500/25'
              }`}
              style={superpower.isOwn ? {
                textShadow: '0 0 8px rgba(34, 211, 238, 0.6)',
                boxShadow: '0 0 12px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(34, 211, 238, 0.1)'
              } : {}}
            >
              {superpower.category}
            </Badge>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50">
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
                  <span className="text-cyan-400 font-medium">{user.name}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowOnlyOwn(!showOnlyOwn)}
              className={showOnlyOwn ? 
                'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/20' : 
                'hover:bg-gradient-to-br hover:from-slate-500/10 hover:to-gray-500/10'
              }
            >
              {showOnlyOwn ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4" />}
            </Button>
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
              className="text-center p-4 rounded-lg bg-slate-700/40 border border-slate-600/30 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:border-slate-500/40 group"
            >
              <div className="flex flex-col items-center">
                {/* Иконка */}
                <div className="w-8 h-8 rounded-lg bg-slate-600/50 border border-slate-500/40 flex items-center justify-center mb-2 shadow-lg group-hover:bg-slate-600/60 transition-all duration-300">
                  <div className="text-slate-200 text-sm">⚡</div>
                </div>
                
                {/* Основное значение */}
                <div className="text-xl font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">
                  {ownSuperpowers.length}
                </div>
                
                {/* Подпись */}
                <div className="text-xs text-slate-400 mb-1">Арсенал суперсил</div>
                
                {/* Дополнительная информация */}
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
                  {ownSuperpowers.length > 10 ? 'богатый' : ownSuperpowers.length > 5 ? 'развитый' : 'базовый'}
                </div>
              </div>
            </motion.div>

            {/* Энергетический заряд */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-4 rounded-lg bg-slate-700/40 border border-slate-600/30 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:border-slate-500/40 group"
            >
              <div className="relative">
                <div className="flex flex-col items-center">
                  {/* Энергетическая иконка */}
                  <div className="w-8 h-8 rounded-lg bg-slate-600/50 border border-slate-500/40 flex items-center justify-center mb-2 shadow-lg group-hover:bg-slate-600/60 transition-all duration-300">
                    <Battery className={`h-4 w-4 ${(() => {
                      if (avgEnergy >= 80) return 'text-emerald-400';
                      if (avgEnergy >= 60) return 'text-yellow-400';
                      if (avgEnergy >= 40) return 'text-orange-400';
                      return 'text-red-400';
                    })()}`} />
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
                  <div className="text-xs text-slate-400 mb-1">Заряд энергии</div>
                  
                  {/* Статус энергии */}
                  <div className={`text-xs flex items-center gap-1 ${(() => {
                    if (avgEnergy >= 80) return 'text-emerald-400';
                    if (avgEnergy >= 60) return 'text-yellow-400';
                    if (avgEnergy >= 40) return 'text-orange-400';
                    return 'text-red-400';
                  })()}`}>
                    <div className={`w-1 h-1 rounded-full animate-pulse ${(() => {
                      if (avgEnergy >= 80) return 'bg-emerald-400';
                      if (avgEnergy >= 60) return 'bg-yellow-400';
                      if (avgEnergy >= 40) return 'bg-orange-400';
                      return 'bg-red-400';
                    })()}`}></div>
                    {avgEnergy >= 80 ? 'на пике' : avgEnergy >= 60 ? 'активны' : avgEnergy >= 40 ? 'устали' : 'нужен отдых'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Коэффициент обмена - с понятными стрелками */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-4 rounded-lg bg-slate-700/40 border border-slate-600/30 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:border-slate-500/40 group"
            >
              <div className="flex flex-col items-center">
                {/* Иконка обмена */}
                <div className="w-8 h-8 rounded-lg bg-slate-600/50 border border-slate-500/40 flex items-center justify-center mb-3 shadow-lg group-hover:bg-slate-600/60 transition-all duration-300">
                  <div className="text-slate-200 text-sm">⚖️</div>
                </div>
                  
                {/* Стрелки с цифрами */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {/* Исходящие блики - слева (от нас) */}
                  <div className="flex items-center gap-1">
                    <div className="text-violet-400 text-lg">↑</div>
                    <div className="text-lg font-bold text-slate-200">
                      {sentBliks.length || 164}
                    </div>
                  </div>
                  
                  {/* Входящие блики - справа (к нам) */}
                  <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-slate-200">
                      {sentBliks.length > 0 ? totalBliks : 247}
                    </div>
                    <div className="text-emerald-400 text-lg">↓</div>
                  </div>
                </div>
                
                {/* Подпись */}
                <div className="text-xs text-slate-400 mb-1">Коэффициент обмена</div>
                
                {/* Статус */}
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
                  {(() => {
                    const receivedCount = sentBliks.length > 0 ? totalBliks : 247;
                    const givenCount = sentBliks.length || 164;
                    const ratio = receivedCount / givenCount;
                    
                    if (ratio >= 0.8 && ratio <= 1.2) return 'в балансе';
                    if (ratio > 1.2) return 'получаете больше';
                    return 'даете больше';
                  })()}
                </div>
              </div>
            </motion.div>

          </div>
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
              {/* Карта в стиле Pinterest/Masonry */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-3 md:gap-4 auto-rows-min">
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
                      onClick={() => onSuperpowerClick(superpower.name)}
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
  );
}