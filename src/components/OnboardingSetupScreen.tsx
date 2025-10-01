import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, User, Sparkles } from 'lucide-react';

interface OnboardingSetupScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function OnboardingSetupScreen({ onNext, onBack, onSkip }: OnboardingSetupScreenProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [selectedSuperpowers, setSelectedSuperpowers] = useState<string[]>([]);

  const availableSuperpowers = [
    { name: 'Креативность', emoji: '🧠', category: 'Mind' },
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

  const toggleSuperpower = (superpowerName: string) => {
    setSelectedSuperpowers(prev => 
      prev.includes(superpowerName)
        ? prev.filter(name => name !== superpowerName)
        : [...prev, superpowerName]
    );
  };

  const canContinue = name.trim().length > 0 && status.trim().length > 0 && selectedSuperpowers.length >= 3;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bliq-energy-gradient opacity-10" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              scale: 0
            }}
            animate={{ 
              y: -100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Хедер */}
        <div className="flex items-center justify-between p-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Настройка профиля</h1>
            <p className="text-sm text-purple-200">5 из 6</p>
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
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Аватар */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center mx-auto relative">
                <User size={32} className="text-white" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg"
                >
                  <Camera size={16} />
                </motion.button>
              </div>
              <p className="text-muted-foreground text-sm mt-2">Добавить фото</p>
            </motion.div>

            {/* Форма */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Имя */}
              <div>
                <label className="block text-white font-medium mb-2">Как тебя зовут?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Твое имя"
                  className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Статус */}
              <div>
                <label className="block text-white font-medium mb-2">Кто ты по профессии?</label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="UX/UI Designer, Разработчик..."
                  className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Выбор суперсил */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Выбери свои топ суперсилы 
                  <span className="text-purple-200 text-sm font-normal ml-1">(мин. 3)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableSuperpowers.map((superpower) => (
                    <motion.button
                      key={superpower.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSuperpower(superpower.name)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        selectedSuperpowers.includes(superpower.name)
                          ? 'bg-purple-500/30 border-purple-400 text-white'
                          : 'bg-white/5 border-white/20 text-purple-200 hover:border-purple-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{superpower.emoji}</span>
                        <span className="text-sm font-medium">{superpower.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {selectedSuperpowers.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-purple-200 text-sm mt-2"
                  >
                    Выбрано: {selectedSuperpowers.length} из {availableSuperpowers.length}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Навигация */}
        <div className="p-6">
          <motion.button
            whileHover={canContinue ? { scale: 1.02, y: -2 } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            onClick={canContinue ? onNext : undefined}
            disabled={!canContinue}
            className={`w-full px-8 py-4 font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              canContinue
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-500/25'
                : 'bg-white/10 text-purple-300 cursor-not-allowed'
            }`}
          >
            {canContinue ? (
              <>
                <Sparkles size={20} />
                Создать профиль
                <ArrowRight size={20} />
              </>
            ) : (
              <>
                Заполни все поля
              </>
            )}
          </motion.button>
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