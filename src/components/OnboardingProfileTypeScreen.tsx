import React, { useState } from 'react';
import { Button } from './ui/button';
import { Building2, User, ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { AppBackground } from './AppBackground';
import { motion } from 'motion/react';

interface OnboardingProfileTypeScreenProps {
  onSelectPersonal: () => void;
  onSelectBusiness: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingProfileTypeScreen({
  onSelectPersonal,
  onSelectBusiness,
  onBack,
  onSkip
}: OnboardingProfileTypeScreenProps) {
  const [hoveredCard, setHoveredCard] = useState<'personal' | 'business' | null>(null);

  return (
    <AppBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105"
          >
            Пропустить
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-12 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          
          {/* Title with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-10 h-10 text-purple-400" />
              </motion.div>
            </div>
            <h1 className="text-white font-bold text-3xl">
              Выбери тип профиля
            </h1>
          </motion.div>

          {/* Profile Type Options */}
          <div className="w-full space-y-4 mb-10">
            
            {/* Personal Profile */}
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPersonal()}
              onMouseEnter={() => setHoveredCard('personal')}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.20) 0%, rgba(236, 72, 153, 0.15) 100%)',
                borderColor: hoveredCard === 'personal' ? 'rgba(192, 132, 252, 0.7)' : 'rgba(168, 85, 247, 0.3)',
                boxShadow: hoveredCard === 'personal' 
                  ? '0 20px 50px rgba(168, 85, 247, 0.4), 0 0 80px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 8px 24px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Animated Background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.20) 100%)'
                }}
              />
              
              {/* Content */}
              <div className="relative flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/40 to-pink-500/40 text-purple-200 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-bold text-lg">
                      Личный профиль
                    </h3>
                    <Sparkles className="w-4 h-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-glow" />
                  </div>
                  <p className="text-white/70 text-sm">
                    Развивай свои суперсилы, получай блики от друзей и становись лучшей версией себя
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Business Profile */}
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBusiness()}
              onMouseEnter={() => setHoveredCard('business')}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.20) 0%, rgba(251, 146, 60, 0.15) 100%)',
                borderColor: hoveredCard === 'business' ? 'rgba(245, 158, 11, 0.7)' : 'rgba(245, 158, 11, 0.3)',
                boxShadow: hoveredCard === 'business' 
                  ? '0 20px 50px rgba(245, 158, 11, 0.4), 0 0 80px rgba(251, 146, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 8px 24px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Animated Background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 146, 60, 0.20) 100%)'
                }}
              />
              
              {/* Content */}
              <div className="relative flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/40 to-orange-500/40 text-amber-200 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/30">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-bold text-lg">
                      Бизнес-профиль
                    </h3>
                    <Zap className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-glow" />
                  </div>
                  <p className="text-white/70 text-sm">
                    Демонстрируй сильные стороны компании и получай отзывы от клиентов
                  </p>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Footer Note */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-white/50 text-sm">
              💡 Ты всегда сможешь изменить тип профиля в настройках
            </p>
          </motion.div>
        </div>
      </div>
    </AppBackground>
  );
}