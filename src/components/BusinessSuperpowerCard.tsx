import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BusinessSuperpowerCardProps {
  name: string;
  emoji: string;
  value: number;
  energy: number;
  category: string;
  businessCategory: string;
  businessDescription: string;
  trend: 'up' | 'down' | 'stable';
  onClick?: () => void;
}

// Цвета для бизнес-категорий
const getCategoryColors = (category: string) => {
  switch (category) {
    case 'Flow':
      return {
        bg: 'from-cyan-500/10 to-teal-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300'
      };
    case 'Soul':
      return {
        bg: 'from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300'
      };
    case 'Mind':
      return {
        bg: 'from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300'
      };
    case 'Crew':
      return {
        bg: 'from-orange-500/10 to-yellow-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        badge: 'bg-orange-500/20 text-orange-300'
      };
    case 'Body':
      return {
        bg: 'from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300'
      };
    case 'Style':
      return {
        bg: 'from-rose-500/10 to-pink-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300'
      };
    case 'Drive':
      return {
        bg: 'from-red-500/10 to-orange-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-300'
      };
    default:
      return {
        bg: 'from-gray-500/10 to-slate-500/10',
        border: 'border-gray-500/30',
        text: 'text-gray-400',
        badge: 'bg-gray-500/20 text-gray-300'
      };
  }
};

// Градиент энергии от красного к зеленому
const getEnergyGradient = (energy: number) => {
  if (energy >= 80) return 'from-emerald-500 to-green-400';
  if (energy >= 60) return 'from-yellow-500 to-emerald-400';
  if (energy >= 40) return 'from-orange-500 to-yellow-400';
  if (energy >= 20) return 'from-red-500 to-orange-400';
  return 'from-red-600 to-red-500';
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-green-400" />;
    case 'down':
      return <TrendingDown className="w-3 h-3 text-red-400" />;
    case 'stable':
      return <Minus className="w-3 h-3 text-yellow-400" />;
  }
};

export function BusinessSuperpowerCard({
  name,
  emoji,
  value,
  energy,
  category,
  businessCategory,
  businessDescription,
  trend,
  onClick
}: BusinessSuperpowerCardProps) {
  const colors = getCategoryColors(category);
  const energyGradient = getEnergyGradient(energy);

  return (
    <Card 
      className={`glass-card p-4 cursor-pointer hover:energy-glow transition-all duration-300 border ${colors.border}`}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl`}>
              {emoji}
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{name}</h3>
              <Badge className={`text-xs mt-1 ${colors.badge} border-0`}>
                {businessCategory}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {getTrendIcon(trend)}
            <span className={`text-xl font-bold ${colors.text}`}>
              {value}
            </span>
          </div>
        </div>

        {/* Business Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {businessDescription}
        </p>

        {/* Energy Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Энергия бизнеса</span>
            <span className={`font-semibold ${colors.text}`}>{energy}%</span>
          </div>
          
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${energyGradient} transition-all duration-500 rounded-full`}
              style={{ width: `${energy}%` }}
            >
              {/* Неоновое свечение для высокой энергии */}
              {energy > 80 && (
                <div className="w-full h-full bg-gradient-to-r from-emerald-400/50 to-green-400/50 animate-pulse rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Category Tag */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{category}</span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${energyGradient}`}></div>
            <span className="text-muted-foreground">
              {energy > 80 ? 'Высокая' : energy > 50 ? 'Средняя' : 'Низкая'} активность
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}