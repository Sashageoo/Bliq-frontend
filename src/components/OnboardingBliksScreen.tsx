import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, MessageSquare, Image, Heart, MessageCircle, Share2 } from 'lucide-react';

interface OnboardingBliksScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingBliksScreen({ onNext, onBack, onSkip }: OnboardingBliksScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const blikSteps = [
    {
      title: 'Что такое блики?',
      description: 'Блики — это особый вид контента, который усиливает суперсилы людей',
      visual: 'concept'
    },
    {
      title: 'Типы бликов',
      description: 'Создавай фото, видео или текстовые блики для разных ситуаций',
      visual: 'types'
    },
    {
      title: 'Как это работает',
      description: 'Твои блики влияют на силу и энергию суперспособностей получателя',
      visual: 'effect'
    }
  ];

  const nextStep = () => {
    if (currentStep < blikSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderVisual = () => {
    switch (blikSteps[currentStep].visual) {
      case 'concept':
        return (
          <div className="relative">
            {/* Центральная аватарка */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto relative z-10"
            >
              <span className="text-2xl">👩‍💻</span>
            </motion.div>

            {/* Блики вокруг */}
            {[
              { emoji: '📸', angle: 0, delay: 0.4 },
              { emoji: '💬', angle: 120, delay: 0.6 },
              { emoji: '🎥', angle: 240, delay: 0.8 }
            ].map((blik, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: blik.delay, type: "spring", bounce: 0.6 }}
                className="absolute w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${blik.angle}deg) translateY(-60px) rotate(-${blik.angle}deg)`
                }}
              >
                <span className="text-lg">{blik.emoji}</span>
              </motion.div>
            ))}

            {/* Энергетические волны */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-purple-400/30"
              style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%', width: '160px', height: '160px' }}
            />
          </div>
        );

      case 'types':
        return (
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Camera, label: 'Фото', color: 'from-blue-500 to-cyan-500', delay: 0.2 },
              { icon: MessageSquare, label: 'Текст', color: 'from-green-500 to-teal-500', delay: 0.4 },
              { icon: Image, label: 'Видео', color: 'from-purple-500 to-pink-500', delay: 0.6 }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: type.delay, type: "spring", bounce: 0.4 }}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${type.color} flex flex-col items-center justify-center text-white shadow-xl`}
              >
                <type.icon size={32} className="mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </motion.div>
            ))}
          </div>
        );

      case 'effect':
        return (
          <div className="relative">
            {/* Блик карточка */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-4 neon-border mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                  <span className="text-sm">👨‍💼</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Алексей К.</p>
                  <p className="text-muted-foreground text-xs">для твоей Креативности 🧠</p>
                </div>
              </div>
              <p className="text-white text-sm">Потрясающий дизайн! Твоя креативность просто зашкаливает ✨</p>
              
              <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                <button className="flex items-center gap-1 text-xs">
                  <Heart size={14} />
                  <span>24</span>
                </button>
                <button className="flex items-center gap-1 text-xs">
                  <MessageCircle size={14} />
                  <span>8</span>
                </button>
                <button className="flex items-center gap-1 text-xs">
                  <Share2 size={14} />
                </button>
              </div>
            </motion.div>

            {/* Эффект усиления */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 glass-card rounded-full neon-border">
                <span className="text-2xl">🧠</span>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Креативность</p>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '60%' }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-full bliq-energy-gradient"
                      />
                    </div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-green-400 text-xs font-medium"
                    >
                      +15 энергии!
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
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
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)
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
            onClick={prevStep}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Блики</h1>
            <p className="text-sm text-purple-200">
              {currentStep + 1} из {blikSteps.length}
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
              key={currentStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-md w-full"
            >
              {/* Заголовок */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-white mb-4"
              >
                {blikSteps[currentStep].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mb-12 leading-relaxed"
              >
                {blikSteps[currentStep].description}
              </motion.p>

              {/* Визуализация */}
              <div className="mb-12 min-h-[200px] flex items-center justify-center">
                {renderVisual()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Навигация */}
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            className="w-full px-8 py-4 bliq-energy-gradient text-white font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 energy-glow"
          >
            {currentStep < blikSteps.length - 1 ? 'Далее' : 'Понял!'}
            <ArrowRight size={20} />
          </motion.button>
        </div>

        {/* Индикатор прогресса */}
        <div className="pb-8">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
            <div className="w-3 h-3 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}