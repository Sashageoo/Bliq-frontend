import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Rocket, Users, Zap, ArrowRight } from 'lucide-react';

interface OnboardingCompleteScreenProps {
  onComplete: () => void;
}

export function OnboardingCompleteScreen({ onComplete }: OnboardingCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-violet-900 relative overflow-hidden">
      {/* Празднечные конфетти */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-pink-400' : 'bg-cyan-400'
            }`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -20,
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              y: window.innerHeight + 20,
              scale: [0, 1, 0.5, 1, 0],
              rotate: 360,
              opacity: [0, 1, 1, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Успешное завершение */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 flex items-center justify-center mx-auto shadow-2xl relative">
            <Sparkles size={48} className="text-white" />
            {/* Пульсирующее свечение */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-30"
            />
          </div>
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Добро пожаловать в Bliq!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl text-purple-100 mb-12 max-w-md leading-relaxed"
        >
          Твоя карта начинает оживать! Теперь ты можешь делиться бликами и развивать суперсилы ✨
        </motion.p>

        {/* Следующие шаги */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid gap-4 mb-12 max-w-sm w-full"
        >
          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-purple-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/30 flex items-center justify-center">
              <Rocket size={24} className="text-purple-200" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Влияй на суперсилы друзей</h3>
              <p className="text-purple-200 text-sm">Твои блики усиливают их таланты</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-pink-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/40 to-orange-500/30 flex items-center justify-center">
              <Zap size={24} className="text-pink-200" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Получай энергию от сообщества</h3>
              <p className="text-purple-200 text-sm">Каждый блик прокачивает тебя</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-cyan-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/40 to-blue-500/30 flex items-center justify-center">
              <Users size={24} className="text-cyan-200" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Строй свою команду влияния</h3>
              <p className="text-purple-200 text-sm">Окружай себя теми, кто делает тебя сильнее</p>
            </div>
          </div>
        </motion.div>

        {/* CTA кнопка */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full max-w-sm px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
        >
          <Sparkles size={20} />
          Перейти в ленту
          <ArrowRight size={20} />
        </motion.button>

        {/* Финальная анимация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex gap-3 items-center">
            {/* Все пройденные точки */}
            {[...Array(5)].map((_, index) => (
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

            {/* Финальная активная точка с особой анимацией */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <motion.div
                animate={{ 
                  scale: [1, 2, 1],
                  opacity: [0.8, 0.1, 0.8]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-md"
              />
              {/* Дополнительное внешнее свечение */}
              <motion.div
                animate={{ 
                  scale: [1, 2.5, 1],
                  opacity: [0.4, 0.05, 0.4]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-lg"
              />
            </motion.div>
          </div>
        </motion.div>


      </div>
    </div>
  );
}