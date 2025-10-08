import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight, Sparkles, Camera, MessageCircle, Heart } from 'lucide-react';

interface OnboardingBliksExplainScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingBliksExplainScreen({ onNext, onBack, onSkip }: OnboardingBliksExplainScreenProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Плавающие блики */}
        {[...Array(8)].map((_, i) => (
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
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${15 + (i * 8)}%`
            }}
          />
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
            <h1 className="text-xl font-semibold text-white">Блики</h1>
            <p className="text-sm text-white/70">3 из 5</p>
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
            {/* Эмодзи визуализация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl mb-6 tracking-wider"
            >
              ✨📸💬⚡
            </motion.div>

            {/* Заголовок */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-semibold text-white mb-8"
            >
              Блики - главный инструмент твоего влияния
            </motion.h2>

            {/* Компактный коллаж - все на одном экране */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-6 w-full relative"
            >
              <div className="flex flex-col gap-4 max-h-80">
                
                {/* Верхний ряд: Полароиды + Видео */}
                <div className="flex justify-center items-center gap-6">
                  
                  {/* Полароидные снимки - компактный стек */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: -8, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="relative flex-shrink-0"
                  >
                    {/* Основной полароид - уменьшенный */}
                    <div className="w-24 h-28 bg-white rounded-lg shadow-xl transform rotate-12 relative overflow-hidden">
                      <div className="w-full h-20 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1617225504130-fb45ba79da56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwc3VwcG9ydCUyMGhhcHB5fGVufDF8fHx8MTc1ODgyOTUxNHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral"
                          alt="Друзья"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-1.5 text-center bg-white">
                        <div className="text-xs text-gray-500">📸</div>
                      </div>
                      {/* Скрепка */}
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-4 bg-gray-300 rounded-sm shadow-md transform rotate-45"></div>
                    </div>
                    
                    {/* Второй полароид в стеке */}
                    <div className="absolute -top-1 -left-1.5 w-24 h-28 bg-white rounded-lg shadow-lg transform rotate-6 -z-10 opacity-85">
                      <div className="w-full h-20 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1600446020369-d5a277906615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRlYW13b3JrJTIwaW5zcGlyaW5nfGVufDF8fHx8MTc1ODgyOTUxOXww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral"
                          alt="Команда"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-1.5 bg-white">
                        <div className="text-xs text-gray-600">✨</div>
                      </div>
                    </div>
                    
                    {/* Третий полароид в стеке */}
                    <div className="absolute -top-1.5 -left-2 w-24 h-28 bg-white rounded-lg shadow-md transform -rotate-3 -z-20 opacity-70">
                      <div className="w-full h-20 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1758518731027-78a22c8852ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMGNlbGVicmF0aW9uJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTg4Mjk1MjR8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral"
                          alt="Успех"
                          className="w-full h-20 object-cover"
                        />
                      </div>
                      <div className="p-1.5 bg-white">
                        <div className="text-xs text-gray-600">💫</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Видео плеер - компактный */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="relative flex-shrink-0"
                  >
                    {/* Видео плеер - уменьшенный */}
                    <div className="w-36 h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl overflow-hidden relative border border-gray-700">
                      {/* Видео превью */}
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/60 via-pink-500/60 to-cyan-500/60 flex items-center justify-center relative">
                        
                        {/* Кнопка Play - меньше */}
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-lg backdrop-blur-sm"
                        >
                          <div className="w-0 h-0 border-l-[5px] border-l-purple-600 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
                        </motion.div>
                        
                        {/* Иконка видеокамеры в углу */}
                        <div className="absolute top-1 right-1 w-4 h-4 bg-black/50 rounded-sm flex items-center justify-center">
                          <div className="text-white text-xs">🎥</div>
                        </div>
                      </div>
                      
                      {/* Видео контролы внизу */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="flex-1 h-0.5 bg-white/30 rounded-full">
                            <motion.div 
                              className="h-full bg-purple-400 rounded-full"
                              animate={{ width: ['15%', '65%', '15%'] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            />
                          </div>
                          <div className="text-white text-xs font-mono">1:23</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                </div>

                {/* Нижний ряд: Типографика - компактная */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="relative flex justify-center"
                >
                  <div className="text-center space-y-1">
                    {/* Первая строка - компактные буквы */}
                    <div className="flex justify-center items-end gap-1">
                      <motion.div
                        animate={{ 
                          textShadow: [
                            '0 0 6px rgba(6, 182, 212, 0.4)',
                            '0 0 12px rgba(6, 182, 212, 0.7)', 
                            '0 0 6px rgba(6, 182, 212, 0.4)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                      >
                        А
                      </motion.div>
                      <div className="text-lg font-medium text-white/80">бв</div>
                      <div className="text-2xl font-bold text-purple-400">Г</div>
                      <div className="text-sm font-normal text-white/60">де</div>
                      <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Ж</div>
                      <div className="text-base font-medium text-cyan-400">з</div>
                      <div className="text-xl font-bold text-orange-400">и</div>
                    </div>
                    
                    {/* Вторая строка - компактная */}
                    <div className="flex justify-center items-center gap-0.5">
                      <div className="text-xs font-light text-white/50">й</div>
                      <div className="text-xl font-bold text-emerald-400">К</div>
                      <div className="text-sm font-medium text-white/70">лм</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Н</div>
                      <div className="text-base font-normal text-pink-400">оп</div>
                      <div className="text-sm font-light text-white/60">рс</div>
                      <div className="text-lg font-medium text-blue-400">Т</div>
                    </div>
                  </div>
                  
                  {/* Компактные декоративные элементы */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-3 text-yellow-400 text-sm"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1 -left-3 text-pink-400 text-xs"
                  >
                    💫
                  </motion.div>
                </motion.div>
                
              </div>
            </motion.div>

            {/* Кнопка продолжения */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
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
          transition={{ duration: 0.8, delay: 1.0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex gap-3 items-center">
            {/* Пройденные точки */}
            {[...Array(2)].map((_, index) => (
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
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
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
                className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur-sm"
              />
            </motion.div>

            {/* Будущие точки */}
            {[...Array(2)].map((_, index) => (
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