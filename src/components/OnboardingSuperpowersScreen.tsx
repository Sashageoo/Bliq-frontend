import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingSuperpowersScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingSuperpowersScreen({ onNext, onBack, onSkip }: OnboardingSuperpowersScreenProps) {
  const [currentCategory, setCurrentCategory] = useState(0);

  const superpowerCategories = [
    {
      emoji: '🌊',
      name: 'Flow',
      title: 'Поток состояния',
      description: 'Способность входить в состояние глубокой концентрации и достигать пиковой производительности',
      color: 'from-blue-500 to-cyan-500',
      examples: ['Решение проблем', 'Командная работа', 'Адаптивность', 'Стратегическое мышление']
    },
    {
      emoji: '💜',
      name: 'Soul',
      title: 'Сила души',
      description: 'Эмоциональная глубина, харизма и способность влиять на других через подлинность',
      color: 'from-purple-500 to-pink-500',
      examples: ['Харизма', 'Эмпатия', 'Лидерство', 'Вдохновение']
    },
    {
      emoji: '🧠',
      name: 'Mind',
      title: 'Сила разума',
      description: 'Интеллектуальные способности, креативность и умение генерировать инновационные идеи',
      color: 'from-indigo-500 to-purple-500',
      examples: ['Креативность', 'Аналитика', 'Память', 'Обучаемость']
    },
    {
      emoji: '👥',
      name: 'Crew',
      title: 'Сила команды',
      description: 'Навыки работы с людьми, построения отношений и создания сильных сообществ',
      color: 'from-green-500 to-teal-500',
      examples: ['Нетворкинг', 'Менторство', 'Сотрудничество', 'Дипломатия']
    },
    {
      emoji: '💪',
      name: 'Body',
      title: 'Сила тела',
      description: 'Физические способности, здоровье и энергия, которые поддерживают все остальные суперсилы',
      color: 'from-orange-500 to-red-500',
      examples: ['Выносливость', 'Координация', 'Здоровье', 'Энергичность']
    },
    {
      emoji: '🎨',
      name: 'Style',
      title: 'Сила стиля',
      description: 'Эстетическое чутье, умение создавать красоту и выражать себя через внешние формы',
      color: 'from-pink-500 to-rose-500',
      examples: ['Дизайн', 'Мода', 'Искусство', 'Презентация']
    },
    {
      emoji: '⚡',
      name: 'Drive',
      title: 'Движущая сила',
      description: 'Мотивация, амбиции и неиссякаемое стремление к достижению целей',
      color: 'from-yellow-500 to-orange-500',
      examples: ['Мотивация', 'Целеустремленность', 'Настойчивость', 'Амбиции']
    }
  ];

  const nextCategory = () => {
    if (currentCategory < superpowerCategories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const prevCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bliq-energy-gradient opacity-15" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Хедер */}
        <div className="flex items-center justify-between p-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevCategory}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Суперсилы</h1>
            <p className="text-sm text-purple-200">
              {currentCategory + 1} из {superpowerCategories.length}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Пропустить
          </motion.button>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-md"
            >
              {/* Иконка категории */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${superpowerCategories[currentCategory].color} flex items-center justify-center mb-6 mx-auto shadow-2xl`}
              >
                <span className="text-6xl">{superpowerCategories[currentCategory].emoji}</span>
              </motion.div>

              {/* Название */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {superpowerCategories[currentCategory].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                {superpowerCategories[currentCategory].description}
              </motion.p>

              {/* Примеры суперсил */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-8"
              >
                {superpowerCategories[currentCategory].examples.map((example, index) => (
                  <motion.div
                    key={example}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-4 py-3 glass-card rounded-xl text-white text-sm font-medium neon-border"
                  >
                    {example}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Навигация */}
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextCategory}
            className="w-full px-8 py-4 bliq-energy-gradient text-white font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 energy-glow"
          >
            {currentCategory < superpowerCategories.length - 1 ? 'Следующая категория' : 'Понятно!'}
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* Индикатор прогресса */}
        <div className="pb-8">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}