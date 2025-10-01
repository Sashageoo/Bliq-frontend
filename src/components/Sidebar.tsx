import React from 'react';
import { X, Settings, Users, Bookmark, TrendingUp, 
         MessageCircle, Share2, Bell, HelpCircle, LogOut,
         Zap, Heart, Map, UserPlus } from 'lucide-react';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DynamicBattery } from './DynamicBattery';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    status: string;
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
  onSettings: () => void;
  onNotifications: () => void;
  onFriends: () => void;
  onTrends: () => void;
  onViewMap: () => void;
  onCreateValueMap: () => void;
  onSuperpowerClick?: (superpowerName: string) => void;
  onAboutBliq?: () => void;
  onProfileClick?: () => void;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  user, 
  onSettings, 
  onNotifications, 
  onFriends, 
  onTrends,
  onViewMap,
  onCreateValueMap,
  onSuperpowerClick,
  onAboutBliq,
  onProfileClick
}: SidebarProps) {
  const menuItems = [
    {
      icon: UserPlus,
      label: 'Пригласить в Bliq',
      action: onCreateValueMap,
      badge: null,
      highlight: true
    },
    {
      icon: Settings,
      label: 'Настройки',
      action: onSettings,
      badge: null
    },
    {
      icon: Users,
      label: 'Друзья',
      action: onFriends,
      badge: user.metrics.friends.toString()
    },
    {
      icon: Bell,
      label: 'Уведомления',
      action: onNotifications,
      badge: '3'
    },
    {
      icon: TrendingUp,
      label: 'Тренды',
      action: onTrends,
      badge: null
    },
    {
      icon: Bookmark,
      label: 'Сохраненное',
      action: () => {},
      badge: null
    },
    {
      icon: MessageCircle,
      label: 'Сообщения',
      action: () => {},
      badge: '2'
    },
    {
      icon: Share2,
      label: 'Поделиться профилем',
      action: () => {},
      badge: null
    }
  ];

  const supportItems = [
    {
      icon: HelpCircle,
      label: 'Помощь и поддержка',
      action: () => {}
    },
    {
      icon: Heart,
      label: 'О приложении Bliq',
      action: onAboutBliq || (() => {})
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full vibrant-card backdrop-blur-xl border-r border-purple-400/30 flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img 
                  src={bliqLogo} 
                  alt="Bliq" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User Profile Card */}
            <button 
              onClick={() => {
                if (onProfileClick) {
                  onProfileClick();
                  onClose();
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/10 border border-purple-400/30 energy-glow hover:from-purple-500/20 hover:to-pink-500/15 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={user.avatarImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300/40 neon-border group-hover:ring-purple-300/60 transition-all"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-white truncate group-hover:text-purple-100 transition-colors">{user.name}</h3>
                <p className="text-sm text-purple-200/90 truncate group-hover:text-purple-200 transition-colors">{user.status}</p>
              </div>
            </button>

            {/* Метрики в стиле профиля */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* 1. Блики */}
              <div className="flex flex-col items-center">
                <button className="
                  backdrop-blur-xl bg-white/10 
                  rounded-xl border border-white/20
                  p-4 
                  hover:bg-white/15 hover:border-blue-400/30
                  transition-all duration-300
                  cursor-pointer
                  group
                  relative overflow-hidden
                  w-20 h-20
                  flex flex-col items-center justify-center
                  energy-button
                ">
                  {/* Градиентный оверлей на hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-400/30 to-cyan-400/20" />
                  
                  {/* Иконка в верхней части */}
                  <div className="relative z-10 mb-1.5">
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-blue-400/40" />
                      <div className="text-lg">📸</div>
                    </div>
                  </div>
                  
                  {/* Число в нижней части кнопки */}
                  <div className="relative z-10 text-white font-bold text-sm leading-none">
                    {user.metrics.bliks}
                  </div>
                </button>
                <div className="text-white/70 text-sm mt-2.5 text-center">Блики</div>
              </div>
              
              {/* 2. Друзья */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={onFriends}
                  className="
                    backdrop-blur-xl bg-white/10 
                    rounded-xl border border-white/20
                    p-4 
                    hover:bg-white/15 hover:border-green-400/30
                    transition-all duration-300
                    cursor-pointer
                    group
                    relative overflow-hidden
                    w-20 h-20
                    flex flex-col items-center justify-center
                    energy-button
                  "
                >
                  {/* Градиентный оверлей на hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-green-400/30 to-emerald-400/20" />
                  
                  {/* Иконка в верхней части */}
                  <div className="relative z-10 mb-1.5">
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-green-400/40" />
                      <Users size={16} className="text-green-400" />
                    </div>
                  </div>
                  
                  {/* Число в нижней части кнопки */}
                  <div className="relative z-10 text-white font-bold text-sm leading-none">
                    {user.metrics.friends}
                  </div>
                </button>
                <div className="text-white/70 text-sm mt-2.5 text-center">Друзья</div>
              </div>
              
              {/* 3. Суперсилы */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={onViewMap}
                  className="
                    backdrop-blur-xl bg-white/10 
                    rounded-xl border border-white/20
                    p-4 
                    hover:bg-white/15 hover:border-purple-400/30
                    transition-all duration-300
                    cursor-pointer
                    group
                    relative overflow-hidden
                    w-20 h-20
                    flex flex-col items-center justify-center
                    energy-button
                  "
                >
                  {/* Градиентный оверлей на hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-purple-400/30 to-pink-400/20" />
                  
                  {/* Иконка в верхней части */}
                  <div className="relative z-10 mb-1.5">
                    <div className="relative transition-transform duration-300 group-hover:scale-110">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-purple-400/40" />
                      <Zap size={16} className="text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Число в нижней части кнопки */}
                  <div className="relative z-10 text-white font-bold text-sm leading-none">
                    {user.metrics.superpowers}
                  </div>
                </button>
                <div className="text-white/70 text-sm mt-2.5 text-center">Суперсилы</div>
              </div>
            </div>

            {/* Universal Value Map Preview */}
            <div 
              className="mt-4 p-3 rounded-xl bg-gradient-to-br from-purple-500/15 via-pink-500/12 to-orange-500/12 border border-purple-400/35 cursor-pointer hover:border-purple-300/50 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-400/20 vibrant-card"
              onClick={onViewMap}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-400/40 to-pink-400/35 flex items-center justify-center energy-glow">
                    <Map className="h-3 w-3 text-purple-200" />
                  </div>
                  <span className="text-sm font-medium text-white">Карта ценности</span>
                </div>
                <div className="text-xs font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                  {(() => {
                    // Рассчитываем общий индекс ценности из реальных данных
                    const avgEnergy = Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length);
                    const bliksScore = Math.min(100, Math.round((user.metrics.bliks / 300) * 100)); // Нормализуем блики
                    const friendsScore = Math.min(100, Math.round((user.metrics.friends / 50) * 100)); // Нормализуем друзей
                    const overallValue = Math.round((avgEnergy * 0.5 + bliksScore * 0.3 + friendsScore * 0.2));
                    return `${overallValue}%`;
                  })()}
                </div>
              </div>
              
              {/* Universal Value Indicators */}
              <div className="space-y-2 mb-3">
                {/* Energy Activity - средняя энергия всех суперсил */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">⚡</span>
                    <span className="text-xs text-foreground">Энергия суперсил</span>
                    <div className="text-xs px-1 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
                      +12%
                    </div>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${(() => {
                          const avgEnergy = Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length);
                          if (avgEnergy >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
                          if (avgEnergy >= 60) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
                          if (avgEnergy >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-400';
                          return 'bg-gradient-to-r from-red-500 to-red-400';
                        })()}`}
                        style={{ 
                          width: `${Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length)}%`,
                          filter: (() => {
                            const avgEnergy = Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length);
                            if (avgEnergy >= 80) return 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))';
                            if (avgEnergy >= 60) return 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))';
                            if (avgEnergy >= 40) return 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))';
                            return 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))';
                          })()
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {Math.round(user.topSuperpowers.reduce((sum, sp) => sum + sp.energy, 0) / user.topSuperpowers.length)}%
                  </span>
                </div>

                {/* Influence Impact - основано на бликах */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🌟</span>
                    <span className="text-xs text-foreground">Сила влияния</span>
                    <div className="text-xs px-1 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
                      +18%
                    </div>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                        style={{ 
                          width: `${Math.min(100, Math.round((user.metrics.bliks / 300) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {Math.min(100, Math.round((user.metrics.bliks / 300) * 100))}%
                  </span>
                </div>

                {/* Balance Exchange - соотношение полученных и отправленных бликов */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">⚖️</span>
                    <span className="text-xs text-foreground">Баланс обмена</span>
                    <div className="text-xs px-1 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
                      +34%
                    </div>  
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden relative">
                      {/* Центральная линия баланса */}
                      <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-400/50 transform -translate-x-0.5"></div>
                      <div 
                        className={`h-full rounded-full ${(() => {
                          const receivedBliks = user.metrics.bliks;
                          const sentBliks = 164; // Примерное количество отправленных бликов
                          const balance = (receivedBliks / Math.max(sentBliks, 1)) * 100;
                          return balance > 110 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
                                 balance < 90 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 
                                 'bg-gradient-to-r from-cyan-500 to-cyan-400';
                        })()}`}
                        style={{ 
                          width: `${(() => {
                            const receivedBliks = user.metrics.bliks;
                            const sentBliks = 164;
                            const balance = (receivedBliks / Math.max(sentBliks, 1)) * 100;
                            return Math.min(100, Math.max(10, balance));
                          })()}%`
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {(() => {
                      const receivedBliks = user.metrics.bliks;
                      const sentBliks = 164;
                      const ratio = receivedBliks / Math.max(sentBliks, 1);
                      return ratio.toFixed(1);
                    })()}
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-purple-500/20">
                <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                  <span>{user.metrics.superpowers} суперсил • {user.metrics.bliks} бликов</span>
                  <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                  <span>Открыть</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-start h-12 px-3 text-left transition-colors ${
                    item.highlight 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/15 border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/25 text-white energy-glow' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={item.action}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${item.highlight ? 'text-purple-300' : 'text-muted-foreground'}`} />
                  <span className="flex-1 text-foreground">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto bg-purple-500/20 text-purple-400 border-purple-500/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Мои суперсилы */}
            {onSuperpowerClick && (
              <>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    Мои суперсилы
                  </div>
                  {user.topSuperpowers.slice(0, 6).map((superpower, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-10 px-3 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onSuperpowerClick(superpower.name);
                        onClose();
                      }}
                    >
                      <span className="text-base mr-3">{superpower.emoji}</span>
                      <span className="text-foreground flex-1 truncate">{superpower.name}</span>
                      <div className="text-xs text-purple-400 font-medium ml-2">
                        {superpower.value}
                      </div>
                    </Button>
                  ))}
                </div>
                
                <Separator className="my-6" />
              </>
            )}

            {/* Support Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                Поддержка
              </div>
              {supportItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-10 px-3 text-left hover:bg-muted/50 transition-colors"
                  onClick={item.action}
                >
                  <item.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-foreground">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start h-10 px-3 text-left hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => {}}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Выйти из аккаунта</span>
            </Button>
            
            <div className="mt-3 text-center text-xs gradient-text">
              Bliq v1.0.0 • Made with ⚡
            </div>
          </div>
        </div>
      </div>
    </>
  );
}