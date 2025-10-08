import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight, Sparkles, Zap, Users, Star, Brain, Heart, Target, TrendingUp, Battery } from 'lucide-react';
import { DynamicBattery } from './DynamicBattery';

interface OnboardingSuperpowersExplainScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingSuperpowersExplainScreen({ onNext, onBack, onSkip }: OnboardingSuperpowersExplainScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Плавающие иконки суперсил */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm"
            style={{
              left: `${20 + (i * 8)}%`,
              top: `${15 + (i * 6)}%`
            }}
          >
            {['💪', '🧠', '💜', '⚡', '🌊', '👥', '🎨', '⭐', '💡', '🚀', '🔥', '✨'][i]}
          </motion.div>
        ))}
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
            <h1 className="text-xl font-semibold text-white">Суперсилы</h1>
            <p className="text-sm text-white/70">2 из 5</p>
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
            {/* Точная копия карточки суперсилы из карты ценности */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto mb-8 w-full max-w-sm"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  y: [-2, 0, -2] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative cursor-pointer group transition-all duration-300"
              >
                {/* Карточка с точной стилизацией */}
                <div className="h-[180px] p-4 rounded-2xl relative overflow-hidden
                  bg-gradient-to-br from-purple-500/15 via-indigo-500/12 to-blue-500/15
                  border border-purple-500/30 hover:border-purple-400/50
                  transition-all duration-300 
                  hover:shadow-xl hover:shadow-purple-500/25 shadow-lg shadow-purple-500/15
                  backdrop-blur-sm
                  ring-1 ring-purple-400/30
                  min-h-[180px]
                ">
                  
                  {/* Энергетическое свечение для высокоэнергетичных суперсил */}
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/6 via-transparent to-indigo-500/6"
                  />
                  
                  {/* Дополнительное неоновое свечение */}
                  <motion.div 
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/4 via-transparent to-pink-500/4"
                  />

                  {/* Индикатор владения */}
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full shadow-xl"
                    style={{ boxShadow: '0 0 12px rgba(168, 85, 247, 0.4), 0 4px 20px rgba(168, 85, 247, 0.25)' }}
                  />
                  
                  {/* Заголовок с эмодзи и именем */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut"
                        }}
                        className="rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300
                          w-8 h-8 text-xl
                          bg-gradient-to-br from-purple-500/35 to-indigo-500/35
                          shadow-lg shadow-purple-500/35"
                        style={{ boxShadow: '0 0 12px rgba(168, 85, 247, 0.4), 0 4px 20px rgba(168, 85, 247, 0.25)' }}
                      >
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="animate-pulse"
                        >
                          🧠
                        </motion.span>
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <motion.h3 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="font-semibold text-foreground truncate text-sm"
                        >
                          Креативность
                        </motion.h3>
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <motion.div
                            animate={{ y: [0, -1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                          </motion.div>
                          <span>Ваша</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Энергия и блики */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-3"
                  >
                    {/* Прогресс энергии */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Энергия</span>
                        <span className="text-sm font-medium text-emerald-400">
                          95%
                        </span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "95%" }}
                          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full relative"
                        >
                          {/* Энергетическое свечение */}
                          <motion.div 
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 blur-sm opacity-60"
                          />
                          {/* Световой эффект для высокой энергии */}
                          <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/20 rounded-full"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Блики */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Блики</span>
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <DynamicBattery 
                            level={95}
                            className="drop-shadow-xl"
                            style={{
                              filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))'
                            }}
                          />
                        </motion.div>
                        <motion.span 
                          animate={{ 
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="text-sm font-medium text-purple-400"
                          style={{
                            filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))'
                          }}
                        >
                          78
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Категория */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="mt-3 pt-2 border-t border-purple-500/25"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          '0 0 10px rgba(168, 85, 247, 0.2)',
                          '0 0 20px rgba(168, 85, 247, 0.4)',
                          '0 0 10px rgba(168, 85, 247, 0.2)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                        bg-purple-500/25 text-purple-400 border border-purple-500/35 shadow-lg shadow-purple-500/20"
                      style={{
                        textShadow: '0 0 8px rgba(168, 85, 247, 0.6)',
                        boxShadow: '0 0 12px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(168, 85, 247, 0.1)'
                      }}
                    >
                      Mind
                    </motion.div>
                  </motion.div>
                </div>

                {/* Пульсирующее внешнее свечение */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.03, 1],
                    opacity: [0.0, 0.3, 0.0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl border border-purple-400/20 blur-sm"
                />
              </motion.div>

              {/* Подпись под карточкой */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-center mt-4 text-sm text-white/70"
              >
                Так будет выглядеть твоя суперсила! ✨
              </motion.p>
            </motion.div>

            {/* Заголовок */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-semibold text-white mb-10"
            >
              Что такое суперсилы?
            </motion.h2>

            {/* Ключевые особенности - ТОЛЬКО 2 САМЫХ ВАЖНЫХ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-6 mb-12"
            >
              {[
                { icon: Brain, text: 'Твои уникальные качества', color: 'from-indigo-400 to-purple-400' },
                { icon: Heart, text: 'Растут от бликов', color: 'from-pink-400 to-rose-400' }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.9 + index * 0.15,
                      type: "spring",
                      bounce: 0.4 
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-5 text-left group cursor-pointer"
                  >
                    {/* Неоновая точка вместо карточки */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          `0 0 10px rgba(192, 132, 252, 0.3)`,
                          `0 0 20px rgba(192, 132, 252, 0.6)`,
                          `0 0 10px rgba(192, 132, 252, 0.3)`
                        ]
                      }}
                      transition={{ 
                        duration: 2 + index * 0.3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.4
                      }}
                      className="relative flex-shrink-0"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center relative`}>
                        <IconComponent size={20} className="text-white relative z-10" />
                        
                        {/* Внутреннее свечение */}
                        <motion.div
                          animate={{ 
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.4, 0.8, 0.4]
                          }}
                          transition={{ 
                            duration: 2 + index * 0.2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                          className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm"
                        />
                        
                        {/* Внешнее неоновое свечение */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.8, 1],
                            opacity: [0.6, 0.2, 0.6]
                          }}
                          transition={{ 
                            duration: 3 + index * 0.2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                          className={`absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r ${item.color} blur-lg`}
                        />
                      </div>
                      
                      {/* Дополнительные пульсирующие кольца */}
                      <motion.div
                        animate={{ 
                          scale: [1, 2.2, 1],
                          opacity: [0.3, 0.05, 0.3]
                        }}
                        transition={{ 
                          duration: 4 + index * 0.3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 1 + index * 0.2
                        }}
                        className="absolute inset-0 w-12 h-12 rounded-full border border-white/20 blur-sm"
                      />
                    </motion.div>

                    {/* Текст с деликатным свечением */}
                    <motion.div
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                      className="text-white group-hover:text-white transition-colors relative"
                    >
                      {item.text}
                      
                      {/* Тонкая световая линия при ховере */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent origin-left"
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Кнопка продолжения */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(192, 132, 252, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              {/* Анимированный блик */}
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
              />
              
              <span className="relative z-10">Дальше</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
          </motion.div>
        </div>

        {/* Неоновые точки прогресса */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex gap-3 items-center">
            {/* Пройденная точка */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400/60 to-pink-400/60"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400/40 to-pink-400/40 blur-[1px]"></div>
            </motion.div>

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
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
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
                className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-sm"
              />
            </motion.div>

            {/* Будущие точки */}
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ 
                  scale: [0.8, 1, 0.8],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-2 h-2 rounded-full bg-white/20 border border-white/30"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-white/10 blur-[1px]"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </div>
  );
}