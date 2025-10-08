import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, User, Sparkles, Search, X } from 'lucide-react';

interface OnboardingSetupScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingSetupScreen({ onNext, onBack, onSkip }: OnboardingSetupScreenProps) {
  // Два шага: имя и качества
  const [step, setStep] = useState<'name' | 'qualities'>('name');
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuperpowers, setSelectedSuperpowers] = useState<string[]>([]);

  // Упрощенный список главных качеств
  const availableSuperpowers = [
    { name: 'Креативность', emoji: '💡', category: 'Mind' },
    { name: 'Лидерство', emoji: '⭐', category: 'Soul' },
    { name: 'Программирование', emoji: '💻', category: 'Mind' },
    { name: 'Дизайн', emoji: '🎨', category: 'Style' },
    { name: 'Фотография', emoji: '📸', category: 'Style' },
    { name: 'Спорт', emoji: '🏃‍♀️', category: 'Body' },
    { name: 'Музыка', emoji: '🎵', category: 'Soul' },
    { name: 'Кулинария', emoji: '👨‍🍳', category: 'Body' },
    { name: 'Танцы', emoji: '💃', category: 'Body' },
    { name: 'Командная работа', emoji: '🤝', category: 'Crew' },
    { name: 'Публичные выступления', emoji: '🎤', category: 'Soul' },
    { name: 'Решение проблем', emoji: '💪', category: 'Flow' }
  ];

  // Фильтруем качества по поисковому запросу
  const filteredSuperpowers = availableSuperpowers.filter(sp =>
    sp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addSuperpower = (superpowerName: string) => {
    if (selectedSuperpowers.length < 3 && !selectedSuperpowers.includes(superpowerName)) {
      setSelectedSuperpowers(prev => [...prev, superpowerName]);
      setSearchQuery(''); // Очищаем поиск после добавления
      
      // Автоматически переходим к следующему шагу если выбрано 3
      if (selectedSuperpowers.length === 2) {
        setTimeout(() => {
          onNext();
        }, 500);
      }
    }
  };

  const removeSuperpower = (superpowerName: string) => {
    setSelectedSuperpowers(prev => prev.filter(name => name !== superpowerName));
  };

  // Условия для кнопки "Далее"
  const canContinueName = name.trim().length > 0;
  const canContinueQualities = selectedSuperpowers.length === 3;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Простой энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bliq-energy-gradient opacity-5" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Хедер */}
        <div className="flex items-center justify-between p-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (step === 'qualities') {
                setStep('name');
              } else {
                onBack();
              }
            }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="text-center">
            <h1 className="font-semibold text-white">
              {step === 'name' ? 'Знакомство' : 'Твои суперсилы'}
            </h1>
            <p className="text-sm text-purple-200">
              {step === 'name' ? 'шаг 5 из 6' : 'шаг 6 из 6'}
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
        <div className="flex-1 px-6 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
              {/* ШАГ 1: ИМЯ */}
              {step === 'name' && (
                <motion.div
                  key="name-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Большой эмодзи */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
                    className="mb-8"
                  >
                    <span className="text-8xl">👋</span>
                  </motion.div>

                  {/* Вопрос */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white mb-2"
                  >
                    Как тебя зовут?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-purple-200 mb-8"
                  >
                    Давай познакомимся поближе
                  </motion.p>

                  {/* Поле ввода */}
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && canContinueName) {
                        setStep('qualities');
                      }
                    }}
                    placeholder="Введи свое имя"
                    autoFocus
                    className="w-full px-6 py-4 glass-card rounded-2xl text-white text-center placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-all"
                  />
                </motion.div>
              )}

              {/* ШАГ 2: КАЧЕСТВА */}
              {step === 'qualities' && (
                <motion.div
                  key="qualities-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Вопрос */}
                  <div className="text-center mb-8">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white mb-2"
                    >
                      В чем твои сильные стороны?
                    </motion.h2>
                  </div>

                  {/* Индикатор прогресса */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2"
                  >
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          index < selectedSuperpowers.length
                            ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </motion.div>

                  {/* Поле поиска */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Начни вводить качество..."
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 glass-card rounded-2xl text-white placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-all"
                    />
                  </motion.div>

                  {/* Выбранные качества */}
                  <AnimatePresence>
                    {selectedSuperpowers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        {selectedSuperpowers.map((name, index) => {
                          const sp = availableSuperpowers.find(s => s.name === name);
                          return (
                            <motion.div
                              key={name}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full flex items-center gap-2"
                            >
                              <span>{sp?.emoji}</span>
                              <span className="text-white font-medium">{name}</span>
                              <span className="text-purple-200 text-sm">#{index + 1}</span>
                              <button
                                onClick={() => removeSuperpower(name)}
                                className="ml-1 hover:text-white transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Список предложений или кнопка создания */}
                  {selectedSuperpowers.length < 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      {filteredSuperpowers.filter(sp => !selectedSuperpowers.includes(sp.name)).length > 0 ? (
                        // Показываем отфильтрованные варианты
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {filteredSuperpowers
                            .filter(sp => !selectedSuperpowers.includes(sp.name))
                            .slice(0, 6)
                            .map((superpower) => (
                              <motion.button
                                key={superpower.name}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addSuperpower(superpower.name)}
                                className="w-full p-4 glass-card rounded-xl border border-white/10 hover:border-purple-400/50 text-left transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{superpower.emoji}</span>
                                  <span className="text-white font-medium group-hover:text-purple-200 transition-colors">
                                    {superpower.name}
                                  </span>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      ) : searchQuery.trim().length > 0 ? (
                        // Если есть поиск, но ничего не найдено - предлагаем создать
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <p className="text-purple-200 mb-4">
                            Не нашли "{searchQuery}"?
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (searchQuery.trim()) {
                                addSuperpower(searchQuery.trim());
                              }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles size={20} />
                              <span>Создать "{searchQuery}"</span>
                            </div>
                          </motion.button>
                        </motion.div>
                      ) : (
                        // Если поиск пустой - показываем подсказку
                        <div className="text-center py-8 text-purple-200/60">
                          Начни вводить качество...
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Навигация */}
        <div className="p-6">
          {step === 'name' ? (
            <motion.button
              whileHover={canContinueName ? { scale: 1.02, y: -2 } : {}}
              whileTap={canContinueName ? { scale: 0.98 } : {}}
              onClick={canContinueName ? () => setStep('qualities') : undefined}
              disabled={!canContinueName}
              className={`w-full px-8 py-4 font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                canContinueName
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/25'
                  : 'bg-white/10 text-purple-300 cursor-not-allowed'
              }`}
            >
              {canContinueName ? (
                <>
                  Продолжить
                  <ArrowRight size={20} />
                </>
              ) : (
                'Введи свое имя'
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={canContinueQualities ? { scale: 1.02, y: -2 } : {}}
              whileTap={canContinueQualities ? { scale: 0.98 } : {}}
              onClick={canContinueQualities ? onNext : undefined}
              disabled={!canContinueQualities}
              className={`w-full px-8 py-4 font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                canContinueQualities
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/25'
                  : 'bg-white/10 text-purple-300 cursor-not-allowed'
              }`}
            >
              {canContinueQualities ? (
                <>
                  <Sparkles size={20} />
                  Создать профиль!
                  <ArrowRight size={20} />
                </>
              ) : (
                `Выбери еще ${3 - selectedSuperpowers.length}`
              )}
            </motion.button>
          )}
        </div>

        {/* Неоновые точки прогресса */}
        <div className="pb-8">
          <div className="flex justify-center gap-3 items-center mx-auto w-fit">
            {/* Пройденные точки */}
            {[...Array(4)].map((_, index) => (
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
        </div>
      </div>
    </div>
  );
}
