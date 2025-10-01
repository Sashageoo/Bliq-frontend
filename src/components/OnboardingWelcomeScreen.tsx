import React from 'react';
import { motion } from 'motion/react';
import { Camera, Zap, TrendingUp, ArrowRight, Users } from 'lucide-react';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';

interface OnboardingWelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingWelcomeScreen({ onNext, onSkip }: OnboardingWelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bliq-energy-gradient opacity-25" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.5) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Анимированные частицы фона */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/50 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              y: [null, -80],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          />
        ))}
      </div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Логотип */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8 flex justify-center items-center"
        >
          <div className="relative inline-block">
            {/* Пульсирующие эффекты за логотипом */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 70%)',
                filter: 'blur(25px)'
              }}
            />
            
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 60%, transparent 80%)',
                filter: 'blur(18px)'
              }}
            />
            
            {/* Сам логотип */}
            <img 
              src={bliqLogo} 
              alt="Bliq" 
              className="relative z-10 w-24 h-auto block"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(192, 132, 252, 0.9)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.5)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4))',
                maxWidth: 'none',
                background: 'transparent',
                borderRadius: '0',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
        </motion.div>

        {/* Главный слоган */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-medium text-white max-w-xs leading-relaxed">
            Вайб в бликах друзей
          </h1>
        </motion.div>

        {/* Три простые концепции "в воздухе" */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col gap-8 mb-20 max-w-sm w-full"
        >
          {/* Делись бликами */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Camera size={20} className="text-purple-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white">Делись бликами</h3>
            </div>
          </div>

          {/* Раскрывай суперсилы */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-yellow-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white">Раскрывай суперсилы</h3>
            </div>
          </div>

          {/* Укрепляй влияние */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-pink-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white">Укрепляй влияние</h3>
            </div>
          </div>

          {/* Расти в ценности */}
          <div className="flex items-center gap-4 px-2">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-blue-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white">Расти в ценности</h3>
            </div>
          </div>
        </motion.div>

        {/* Кнопка начать путешествие */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-sm"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl energy-glow"
          >
            Начать путешествие
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* Индикаторы прогресса онбординга */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <div className="w-2 h-2 rounded-full bg-purple-600/40" />
          <div className="w-2 h-2 rounded-full bg-purple-600/40" />
          <div className="w-2 h-2 rounded-full bg-purple-600/40" />
          <div className="w-2 h-2 rounded-full bg-purple-600/40" />
        </motion.div>
      </div>
    </div>
  );
}