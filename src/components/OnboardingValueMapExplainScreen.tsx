import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight, TrendingUp, Target, Eye, Map } from 'lucide-react';
import valueMapPreview from 'figma:asset/ecc62d52af586968f3ac64efd6b3a2e1e563e50c.png';

interface OnboardingValueMapExplainScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingValueMapExplainScreen({ onNext, onBack, onSkip }: OnboardingValueMapExplainScreenProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Анимированная карта в фоне */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Плавающие точки карты */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1, 1.2, 1, 0],
              x: [0, Math.cos(i * 0.5) * 50],
              y: [0, Math.sin(i * 0.5) * 50]
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className={`absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 shadow-lg`}
            style={{
              left: `${15 + (i * 6)}%`,
              top: `${20 + (i * 5)}%`
            }}
          />
        ))}

        {/* Соединительные линии */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 15}%`}
              y1={`${30 + i * 10}%`}
              x2={`${40 + i * 10}%`}
              y2={`${50 + i * 8}%`}
              stroke="url(#mapGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: i * 0.3 }}
            />
          ))}
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 pt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center neon-border"
          >
            <ChevronLeft size={20} className="text-white" />
          </motion.button>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Карта ценности</h1>
            <p className="text-sm text-white/70">4 из 5</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            Пропустить
          </motion.button>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            {/* Аккуратная карта ценности в стиле сайдбара */}
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-80 rounded-xl mx-auto mb-6 relative overflow-hidden shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              {/* Используем стиль карты ценности из сайдбара */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/15 via-pink-500/12 to-orange-500/12 border border-purple-400/35 vibrant-card energy-glow">
                
                {/* Заголовок карты */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-400/40 to-pink-400/35 flex items-center justify-center energy-glow">
                      <span className="text-sm">🗺️</span>
                    </div>
                    <span className="font-medium text-white">Карта ценности</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-lg font-bold text-purple-300"
                  >
                    74%
                  </motion.div>
                </motion.div>

                {/* Основные метрики */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="grid grid-cols-3 gap-3 mb-4"
                >
                  {/* Суперсилы */}
                  <div className="text-center">
                    <div className="text-purple-300 text-lg mb-1">⚡</div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                      className="font-bold text-white"
                    >
                      12
                    </motion.div>
                    <div className="text-xs text-slate-400">Суперсилы</div>
                  </div>

                  {/* Блики */}
                  <div className="text-center">
                    <div className="text-yellow-300 text-lg mb-1">✨</div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                      className="font-bold text-white"
                    >
                      247
                    </motion.div>
                    <div className="text-xs text-slate-400">Блики</div>
                  </div>

                  {/* Энергия */}
                  <div className="text-center">
                    <div className="text-green-400 text-lg mb-1">🔋</div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      className="font-bold text-white"
                    >
                      74%
                    </motion.div>
                    <div className="text-xs text-slate-400">Энергия</div>
                  </div>
                </motion.div>

                {/* Индикаторы прогресса */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="space-y-3"
                >
                  {/* Энергия суперсил */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">⚡</span>
                      <span className="text-xs text-foreground">Энергия суперсил</span>
                      <div className="text-xs px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
                        +12%
                      </div>
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "74%" }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ 
                            filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))'
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-foreground">74%</span>
                  </div>

                  {/* Сила влияния */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🌟</span>
                      <span className="text-xs text-foreground">Сила влияния</span>
                      <div className="text-xs px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/10">
                        +8%
                      </div>
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "82%" }}
                          transition={{ duration: 1.5, delay: 1.0 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ 
                            filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))'
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-foreground">82%</span>
                  </div>
                </motion.div>



                {/* Финальная подпись */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                  className="pt-3 border-t border-purple-500/20 mt-3"
                >
                  <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <span>12 суперсил • 247 бликов</span>
                    <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                    <span>Открыть</span>
                  </div>
                </motion.div>
              </div>

              {/* Анимированные энергетические частицы вокруг карты */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: [0, Math.cos(i * 45) * 30],
                    y: [0, Math.sin(i * 45) * 30]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.2 + 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm"
                  style={{
                    left: `${50}%`,
                    top: `${50}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </motion.div>



            {/* Заголовок */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-semibold text-white mb-4"
            >
              Карта ценности
            </motion.h2>

            {/* Описание */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/80 mb-8 leading-relaxed"
            >
              Карта ценности — это живая визуализация твоих суперсил.
              Она показывает твою уникальность, растёт от бликов друзей и отражает твое влияние на сообщество.
            </motion.p>

            {/* Ключевые особенности */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3 mb-8"
            >
              {[
                { icon: Eye, text: 'Визуализация всех твоих суперсил', color: 'from-emerald-500 to-teal-500' },
                { icon: TrendingUp, text: 'Отслеживание роста и динамики', color: 'from-blue-500 to-cyan-500' },
                { icon: Target, text: 'Понимание своей ценности', color: 'from-purple-500 to-indigo-500' },
                { icon: Map, text: 'Навигация для личного развития', color: 'from-orange-500 to-red-500' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="glass-card px-4 py-3 rounded-lg text-sm text-white/90 text-left flex items-center gap-3 group hover:scale-105 transition-transform"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent size={16} className="text-white" />
                    </div>
                    {item.text}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Кнопка продолжения */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {/* Анимированный блик */}
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
              />
              
              <span className="relative z-10">Создать карту!</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
          </motion.div>
        </div>

        {/* Неоновые точки прогресса */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex gap-3 items-center">
            {/* Пройденные точки */}
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400/60 to-pink-400/60"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400/40 to-pink-400/40 blur-[1px]"></div>
              </motion.div>
            ))}

            {/* Активная точка с пульсацией */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-400"></div>
              <motion.div
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0.2, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 blur-sm"
              />
            </motion.div>

            {/* Будущая точка */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ 
                scale: [0.8, 1, 0.8],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-2 h-2 rounded-full bg-white/20 border border-white/30"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-white/10 blur-[1px]"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Кнопка продолжить */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-20 right-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center shadow-lg neon-border"
          >
            <ArrowRight size={20} className="text-white" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}