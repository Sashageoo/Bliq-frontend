import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Users, Zap, Heart, Star, Target, Palette } from 'lucide-react';
import bliqLogo from 'figma:asset/dfaa2504ed049b2c972e2411a44f16a47943aa64.png';

interface AboutBliqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutBliqModal({ isOpen, onClose }: AboutBliqModalProps) {
  if (!isOpen) return null;

  const superpowerCategories = [
    { emoji: '🌊', name: 'Flow', description: 'Гармония и поток состояний' },
    { emoji: '💜', name: 'Soul', description: 'Душевная связь и эмпатия' },
    { emoji: '🧠', name: 'Mind', description: 'Интеллект и креативность' },
    { emoji: '👥', name: 'Crew', description: 'Командная работа и лидерство' },
    { emoji: '💪', name: 'Body', description: 'Физическая сила и энергия' },
    { emoji: '🎨', name: 'Style', description: 'Стиль и эстетика' },
    { emoji: '⚡', name: 'Drive', description: 'Драйв и мотивация' }
  ];

  const features = [
    {
      icon: <Sparkles className="text-purple-400" size={24} />,
      title: 'Блики суперсил',
      description: 'Отправляйте фото, видео или текст, чтобы отметить уникальные способности друзей'
    },
    {
      icon: <Zap className="text-yellow-400" size={24} />,
      title: 'Живая энергия',
      description: 'Ваши суперсилы живут и развиваются благодаря активности сообщества'
    },
    {
      icon: <Users className="text-blue-400" size={24} />,
      title: 'Взаимное влияние',
      description: 'Каждый блик усиливает суперсилу получателя и создает связи между людьми'
    },
    {
      icon: <Target className="text-green-400" size={24} />,
      title: 'Персональная карта',
      description: 'Визуализируйте свои сильные стороны и следите за их развитием'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-6 energy-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Закрытие */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-card hover:energy-glow transition-all duration-300"
        >
          <X size={20} className="text-foreground" />
        </button>

        {/* Заголовок с логотипом */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            {/* Логотип */}
            <div className="flex justify-center mb-6">
              <div className="p-2 glass-card rounded-xl energy-glow">
                <img 
                  src={bliqLogo} 
                  alt="Bliq Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-lg text-foreground/80">
              Социальная сеть суперсил
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-foreground/70 leading-relaxed"
          >
            Откройте и развивайте уникальные способности друг друга через блики — 
            моменты признания, которые делают нас сильнее
          </motion.div>
        </div>

        {/* Как это работает */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="text-pink-400" size={20} />
            Как это работает
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl glass-card border border-primary/20 hover:energy-glow transition-all duration-300"
              >
                <div className="flex-shrink-0 p-2 rounded-lg glass-card">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Категории суперсил */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            7 категорий суперсил
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {superpowerCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl glass-card border border-primary/20 hover:energy-glow transition-all duration-300"
              >
                <div className="text-2xl">{category.emoji}</div>
                <div>
                  <div className="font-medium text-foreground">{category.name}</div>
                  <div className="text-xs text-foreground/60">{category.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Уникальные особенности */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="text-purple-400" size={20} />
            Почему Bliq особенный
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2 flex-shrink-0"></div>
              <div className="text-foreground/80 text-sm">
                <strong className="text-foreground">Блики как валюта:</strong> Каждый блик увеличивает массу (влиятельность) суперсилы
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 mt-2 flex-shrink-0"></div>
              <div className="text-foreground/80 text-sm">
                <strong className="text-foreground">Живая энергия:</strong> Суперсилы угасают без активности, стимулируя развитие
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mt-2 flex-shrink-0"></div>
              <div className="text-foreground/80 text-sm">
                <strong className="text-foreground">Визуальная магия:</strong> Энергетические фоны, неоновые эффекты и живые градиенты
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 mt-2 flex-shrink-0"></div>
              <div className="text-foreground/80 text-sm">
                <strong className="text-foreground">Взаимное развитие:</strong> Помогая другим расти, вы развиваетесь сами
              </div>
            </div>
          </div>
        </motion.div>

        {/* Призыв к действию */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="text-center"
        >
          <div className="p-6 rounded-2xl glass-card border border-primary/30 energy-glow">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Готовы открыть свои суперсилы?
            </h3>
            <p className="text-foreground/70 text-sm mb-4">
              Начните с создания своего первого блика для друга
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 energy-glow"
            >
              Начать путешествие ✨
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}