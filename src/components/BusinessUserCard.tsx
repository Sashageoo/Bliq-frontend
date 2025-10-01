import React from 'react';
import { motion } from 'motion/react';
import { Building2, CheckCircle, MapPin, Star, Users, TrendingUp } from 'lucide-react';

interface BusinessUserCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    location: string;
    isOnline: boolean;
    profileType?: 'business' | 'personal';
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
  };
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function BusinessUserCard({ user, onClick, variant = 'default' }: BusinessUserCardProps) {
  if (user.profileType !== 'business') {
    return null; // Этот компонент только для бизнес-профилей
  }

  const isCompact = variant === 'compact';
  
  return (
    <motion.div
      onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        {/* Business Avatar with Gradient */}
        <div className="relative">
          <div className="p-0.5 rounded-lg bg-gradient-to-br from-orange-400 via-yellow-500 to-orange-600">
            <img
              src={user.avatar}
              alt={user.businessInfo?.companyName || user.name}
              className={`${isCompact ? 'w-12 h-12' : 'w-14 h-14'} rounded-lg object-cover bg-white/10`}
            />
          </div>
          
          {/* Verification Badge */}
          {user.businessInfo?.verified && (
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
              <CheckCircle size={10} className="text-white" />
            </div>
          )}
          
          {/* Online Status */}
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Business Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`${isCompact ? 'text-sm' : 'text-base'} font-medium text-white truncate`}>
              {user.businessInfo?.companyName || user.name}
            </h3>
            
            {/* Business Badge */}
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0">
              <Building2 size={8} />
              <span>Бизнес</span>
            </div>
          </div>

          <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-white/70 truncate mb-1`}>
            {user.businessInfo?.industry || user.status}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-white/50 text-xs mb-2">
            <MapPin size={10} />
            <span className="truncate">{user.location}</span>
          </div>

          {/* Business Metrics */}
          {!isCompact && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-white/60">
                <Star size={10} className="text-yellow-400" />
                <span>{user.metrics.bliks} отзывов</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Users size={10} className="text-blue-400" />
                <span>{user.metrics.friends} клиентов</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <TrendingUp size={10} className="text-green-400" />
                <span>{user.metrics.superpowers} экспертиз</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Indicator */}
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Building2 size={12} className="text-orange-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}