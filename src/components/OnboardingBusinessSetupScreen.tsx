import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BusinessInfo {
  companyName: string;
  industry: string;
  description: string;
  selectedSuperpowers: string[];
}

interface OnboardingBusinessSetupScreenProps {
  onNext: (businessInfo: any) => void;
  onBack: () => void;
  onSkip: () => void;
}

const INDUSTRIES = [
  { name: 'Технологии и IT', emoji: '💻' },
  { name: 'Финансы', emoji: '💰' },
  { name: 'Здравоохранение', emoji: '🏥' },
  { name: 'Образование', emoji: '🎓' },
  { name: 'Розничная торговля', emoji: '🛒' },
  { name: 'Производство', emoji: '🏭' },
  { name: 'Строительство', emoji: '🏗️' },
  { name: 'Маркетинг и реклама', emoji: '📢' },
  { name: 'Консалтинг', emoji: '💼' },
  { name: 'Недвижимость', emoji: '🏠' },
  { name: 'Медиа и развлечения', emoji: '🎬' },
  { name: 'Другое', emoji: '🏢' }
];

// Бизнес-суперсилы (интерпретация 7 категорий для бизнеса)
const BUSINESS_SUPERPOWERS = [
  { name: 'Инновации', emoji: '🧠', category: 'Mind' },
  { name: 'Корпоративная культура', emoji: '💜', category: 'Soul' },
  { name: 'Эффективность процессов', emoji: '🌊', category: 'Flow' },
  { name: 'Команда и HR', emoji: '👥', category: 'Crew' },
  { name: 'Финансовая мощь', emoji: '💪', category: 'Body' },
  { name: 'Дизайн и UX', emoji: '🎨', category: 'Style' },
  { name: 'Продажи и маркетинг', emoji: '⚡', category: 'Drive' },
  { name: 'Клиентский сервис', emoji: '🤝', category: 'Soul' },
  { name: 'Технологическое превосходство', emoji: '🚀', category: 'Mind' },
  { name: 'Устойчивое развитие', emoji: '🌱', category: 'Soul' },
  { name: 'Масштабирование', emoji: '📈', category: 'Drive' },
  { name: 'Качество продукта', emoji: '⭐', category: 'Body' }
];

export function OnboardingBusinessSetupScreen({
  onNext,
  onBack,
  onSkip
}: OnboardingBusinessSetupScreenProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    industry: '',
    description: '',
    selectedSuperpowers: []
  });

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSuperpower = (superpowerName: string) => {
    setBusinessInfo(prev => {
      const current = prev.selectedSuperpowers;
      // Если уже выбрано - убрать
      if (current.includes(superpowerName)) {
        return {
          ...prev,
          selectedSuperpowers: current.filter(name => name !== superpowerName)
        };
      }
      // Если выбрано менее 3 - добавить
      if (current.length < 3) {
        return {
          ...prev,
          selectedSuperpowers: [...current, superpowerName]
        };
      }
      // Если уже 3 - заменить последнее
      return {
        ...prev,
        selectedSuperpowers: [...current.slice(0, 2), superpowerName]
      };
    });
  };

  const handleComplete = () => {
    if (!businessInfo.companyName) {
      toast.error('Укажи название компании');
      return;
    }
    if (!businessInfo.industry) {
      toast.error('Выбери отрасль');
      return;
    }
    if (businessInfo.selectedSuperpowers.length !== 3) {
      toast.error('Выбери 3 ключевые силы компании');
      return;
    }

    // Передаем упрощенную бизнес-информацию
    onNext({
      companyName: businessInfo.companyName,
      industry: businessInfo.industry,
      description: businessInfo.description || `Компания в сфере: ${businessInfo.industry}`,
      founded: new Date().getFullYear().toString(),
      employees: '11-50 сотрудников',
      revenue: 'Не указывать',
      website: '',
      phone: '',
      email: ''
    });
  };

  const canContinue = 
    businessInfo.companyName.trim().length > 0 && 
    businessInfo.industry.length > 0 &&
    businessInfo.selectedSuperpowers.length === 3;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bliq-energy-gradient opacity-10" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
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
            <h1 className="font-semibold text-white">Бизнес-профиль</h1>
            <p className="text-sm text-blue-200">шаг 5 из 6</p>
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
            {/* Иконка компании */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 flex items-center justify-center mx-auto">
                <Building2 size={32} className="text-white" />
              </div>
              <p className="text-muted-foreground text-sm mt-2">Логотип (позже)</p>
            </motion.div>

            {/* Форма */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Название компании */}
              <div>
                <label className="block text-white font-medium mb-2">Название компании</label>
                <input
                  type="text"
                  value={businessInfo.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="ООО «Моя компания»"
                  className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Отрасль */}
              <div>
                <label className="block text-white font-medium mb-2">Отрасль</label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRIES.map((industry) => (
                    <motion.button
                      key={industry.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('industry', industry.name)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        businessInfo.industry === industry.name
                          ? 'bg-blue-500/30 border-blue-400 text-white'
                          : 'bg-white/5 border-white/20 text-blue-200 hover:border-blue-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{industry.emoji}</span>
                        <span className="text-sm font-medium">{industry.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Краткое описание (опционально) */}
              <div>
                <label className="block text-white font-medium mb-2">
                  О компании <span className="text-muted-foreground text-sm">(опционально)</span>
                </label>
                <textarea
                  value={businessInfo.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Чем занимается ваша компания..."
                  rows={3}
                  className="w-full px-4 py-3 glass-card rounded-xl text-white placeholder-muted-foreground neon-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Выбор 3 ключевых сил */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Выбери 3 ключевые силы компании
                </label>
                <p className="text-blue-200 text-sm mb-4">
                  Эти силы клиенты будут оценивать через отзывы ✨
                </p>
                
                {/* Индикатор выбора */}
                <div className="flex gap-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        index < businessInfo.selectedSuperpowers.length
                          ? 'bg-gradient-to-r from-blue-400 to-orange-400'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {BUSINESS_SUPERPOWERS.map((superpower) => {
                    const isSelected = businessInfo.selectedSuperpowers.includes(superpower.name);
                    const selectionIndex = businessInfo.selectedSuperpowers.indexOf(superpower.name);
                    
                    return (
                      <motion.button
                        key={superpower.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSuperpower(superpower.name)}
                        className={`p-3 rounded-xl border transition-all duration-300 relative ${
                          isSelected
                            ? 'bg-blue-500/30 border-blue-400 text-white'
                            : 'bg-white/5 border-white/20 text-blue-200 hover:border-blue-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{superpower.emoji}</span>
                          <span className="text-sm font-medium">{superpower.name}</span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 flex items-center justify-center text-white shadow-lg"
                          >
                            <span className="text-xs font-bold">{selectionIndex + 1}</span>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {businessInfo.selectedSuperpowers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 glass-card rounded-xl"
                  >
                    <p className="text-blue-200 text-sm mb-2">Ключевые силы компании:</p>
                    <div className="flex flex-wrap gap-2">
                      {businessInfo.selectedSuperpowers.map((name, index) => {
                        const sp = BUSINESS_SUPERPOWERS.find(s => s.name === name);
                        return (
                          <div
                            key={name}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center gap-2"
                          >
                            <span className="text-sm">{sp?.emoji}</span>
                            <span className="text-sm text-white">{name}</span>
                            <span className="text-xs text-blue-200">#{index + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
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
            onClick={canContinue ? handleComplete : undefined}
            disabled={!canContinue}
            className={`w-full px-8 py-4 font-semibold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              canContinue
                ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-blue-500/25'
                : 'bg-white/10 text-blue-300 cursor-not-allowed'
            }`}
          >
            {canContinue ? (
              <>
                <Sparkles size={20} />
                Бизнес-профиль готов!
                <ArrowRight size={20} />
              </>
            ) : (
              <>
                {!businessInfo.companyName ? 'Укажи название' : 
                 !businessInfo.industry ? 'Выбери отрасль' :
                 `Выбери ${3 - businessInfo.selectedSuperpowers.length} силы`}
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
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/60 to-orange-400/60"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400/40 to-orange-400/40 blur-[1px]"></div>
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
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-orange-400"></div>
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
                className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 blur-sm"
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
