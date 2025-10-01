import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface ValueMapPromoCardProps {
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
  onViewMap: () => void;
}

export function ValueMapPromoCard({ topSuperpowers, onViewMap }: ValueMapPromoCardProps) {
  // Берем топ-6 суперсил для более информативного превью
  const displaySuperpowers = topSuperpowers.slice(0, 6);
  
  // Функция для получения мягкого глассморфизм-стиля на основе энергии
  const getSuperpowerStyle = (energy: number) => {
    if (energy >= 80) return {
      bg: 'bg-white/8',
      border: 'border-white/20',
      glow: 'shadow-sm'
    };
    if (energy >= 60) return {
      bg: 'bg-white/6',
      border: 'border-white/15',
      glow: 'shadow-sm'
    };
    if (energy >= 40) return {
      bg: 'bg-white/5',
      border: 'border-white/12',
      glow: ''
    };
    return {
      bg: 'bg-white/3',
      border: 'border-white/10',
      glow: ''
    };
  };

  // Функция для получения размера элемента на основе значения
  const getElementSize = (value: number) => {
    if (value >= 90) return 'w-12 h-12 text-xl';
    if (value >= 75) return 'w-11 h-11 text-lg';
    if (value >= 60) return 'w-10 h-10 text-lg';
    return 'w-9 h-9 text-base';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-10"
    >
      {/* Заголовок с мини-статистикой */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-lg text-white mb-1">
            🗺️ Карта ценности
          </h2>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>{topSuperpowers.length} суперсил</span>
            <span>•</span>
            <span>Общая сила: {Math.round(topSuperpowers.reduce((sum, sp) => sum + sp.value, 0) / topSuperpowers.length)}%</span>
          </div>
        </div>
      </div>

      {/* Интерактивная промо-карточка */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onViewMap}
        className="
          backdrop-blur-xl glass-card
          rounded-2xl p-5 cursor-pointer
          hover:bg-accent
          transition-all duration-300
          relative overflow-hidden group
          shadow-lg hover:shadow-xl
        "
      >
        {/* Энергетическое свечение */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

        {/* Сетка суперсил 3x2 с читаемыми названиями */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {displaySuperpowers.map((superpower, index) => (
              <motion.div
                key={superpower.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex flex-col items-center group/item"
              >
                {/* Эмодзи с глассморфизм-стилем */}
                <div className={`
                  ${getElementSize(superpower.value)}
                  relative backdrop-blur-xl rounded-xl flex items-center justify-center mb-2
                  ${getSuperpowerStyle(superpower.energy).bg}
                  border ${getSuperpowerStyle(superpower.energy).border}
                  ${getSuperpowerStyle(superpower.energy).glow}
                  group-hover/item:bg-white/12 group-hover/item:border-white/30
                  transition-all duration-300
                `}>
                  <span className="text-center">{superpower.emoji}</span>
                  
                  {/* Мини-индикатор энергии в виде точки */}
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white/40 overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`w-full h-full ${
                        superpower.energy >= 80 ? 'bg-white/80' :
                        superpower.energy >= 60 ? 'bg-white/60' :
                        superpower.energy >= 40 ? 'bg-white/40' : 'bg-white/20'
                      } transition-all duration-300`}
                    />
                  </div>
                </div>
                
                {/* Название суперсилы (читаемое!) */}
                <div className="text-center w-full">
                  <div className="text-xs font-medium text-white/95 leading-tight line-clamp-2 mb-1">
                    {superpower.name}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-xs font-medium text-white/70">
                      {superpower.value}%
                    </div>
                    {/* Визуальный индикатор силы */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1 h-2 rounded-full ${
                            superpower.value >= bar * 25 ? 'bg-white/60' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Индикатор скрытых суперсил */}
          {topSuperpowers.length > 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="text-center mb-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs text-white/70">ещё {topSuperpowers.length - 6} суперсил</span>
              </div>
            </motion.div>
          )}

          {/* Мягкие соединительные линии */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Горизонтальные связи между элементами */}
            <div className="absolute top-1/3 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-1/3 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            
            {/* Вертикальные связи */}
            <div className="absolute left-1/3 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
            <div className="absolute right-1/3 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
          </div>

          {/* Информативная сводка и призыв к действию */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-white/90">
                Интерактивная карта связей
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <span>Анализ взаимодействий</span>
                <span>•</span>
                <span>Зоны роста</span>
                <span>•</span>
                <span>Тренды</span>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 text-white/70 group-hover:text-white/90 transition-colors duration-300"
            >
              <span className="text-sm font-medium">Открыть</span>
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl bg-gradient-to-br from-purple-500/15 to-transparent" />
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full blur-lg bg-gradient-to-tr from-pink-500/15 to-transparent" />
      </motion.div>
    </motion.div>
  );
}