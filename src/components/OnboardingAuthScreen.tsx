import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OnboardingAuthScreenProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

type AuthMethod = 'email' | 'telegram' | null;
type AuthStep = 'method' | 'input' | 'verify';

export const OnboardingAuthScreen: React.FC<OnboardingAuthScreenProps> = ({
  onNext,
  onBack,
  onSkip
}) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [currentStep, setCurrentStep] = useState<AuthStep>('method');
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // Симуляция отправки кода
  const handleSendCode = async () => {
    if (!contact) {
      toast.error('Введи контакт для регистрации');
      return;
    }

    // Валидация email
    if (authMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        toast.error('Введи корректный email');
        return;
      }
    }

    // Валидация Telegram (начинается с @ или просто username)
    if (authMethod === 'telegram') {
      const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
      if (!telegramRegex.test(contact)) {
        toast.error('Введи корректный Telegram username (минимум 5 символов)');
        return;
      }
    }

    setIsLoading(true);
    
    // Симуляция задержки отправки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setCodeSent(true);
    setCurrentStep('verify');
    
    toast.success(`Код отправлен на ${authMethod === 'email' ? 'твою почту' : 'твой Telegram'} ✨`);
  };

  // Симуляция проверки кода
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Введи 6-значный код');
      return;
    }

    setIsLoading(true);
    
    // Симуляция проверки кода
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Для демо принимаем любой 6-значный код
    setIsLoading(false);
    toast.success('Отлично! Ты зарегистрирован 🎉');
    
    // Небольшая задержка перед переходом для показа success состояния
    setTimeout(() => {
      onNext();
    }, 800);
  };

  const handleMethodSelect = (method: AuthMethod) => {
    setAuthMethod(method);
    setCurrentStep('input');
  };

  const handleBackClick = () => {
    if (currentStep === 'verify') {
      setCurrentStep('input');
      setVerificationCode('');
      setCodeSent(false);
    } else if (currentStep === 'input') {
      setCurrentStep('method');
      setContact('');
      setAuthMethod(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Энергетический фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Прогресс */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className={`h-2 w-16 rounded-full ${currentStep !== 'method' ? 'bg-primary' : 'bg-white/20'}`} />
            <div className={`h-2 w-2 rounded-full ${currentStep === 'verify' ? 'bg-primary' : 'bg-white/20'}`} />
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ШАГ 1: Выбор метода */}
            {currentStep === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Заголовок */}
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    ✨
                  </motion.div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Добро пожаловать!
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Начнем с регистрации. Выбери удобный способ:
                  </p>
                </div>

                {/* Карточки выбора метода */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMethodSelect('email')}
                    className="w-full bliq-glass-button p-5 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="icon-gradient-blue w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground mb-0.5">
                          Email
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Отправим код подтверждения на твою почту
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMethodSelect('telegram')}
                    className="w-full bliq-glass-button p-5 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="icon-gradient-blue w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground mb-0.5">
                          Telegram
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Отправим код в Telegram бот
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground/60 flex-shrink-0" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ШАГ 2: Ввод контакта */}
            {currentStep === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Заголовок */}
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center"
                  >
                    {authMethod === 'email' ? (
                      <Mail className="w-8 h-8 text-primary" />
                    ) : (
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                    )}
                  </motion.div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {authMethod === 'email' ? 'Твой email' : 'Твой Telegram'}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {authMethod === 'email' 
                      ? 'Введи свою почту для получения кода'
                      : 'Введи свой Telegram username'}
                  </p>
                </div>

                {/* Инпут */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type={authMethod === 'email' ? 'email' : 'text'}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={authMethod === 'email' ? 'example@email.com' : '@username'}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendCode();
                        }
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        Отправить код
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Подсказка */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  {authMethod === 'email' ? (
                    <p>
                      Мы отправим 6-значный код на указанную почту.
                      <br />
                      Проверь папку "Спам", если не получишь письмо.
                    </p>
                  ) : (
                    <p>
                      Убедись, что ты подписан на наш Telegram бот.
                      <br />
                      Код придет в личные сообщения.
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ШАГ 3: Ввод кода подтверждения */}
            {currentStep === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Заголовок */}
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Проверь код
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Мы отправили код на{' '}
                    <span className="text-foreground font-semibold">
                      {contact}
                    </span>
                  </p>
                </div>

                {/* Инпут кода */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-foreground text-center text-2xl tracking-widest placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && verificationCode.length === 6) {
                          handleVerifyCode();
                        }
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Проверяем...
                      </>
                    ) : (
                      <>
                        Подтвердить
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Повторная отправка */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <button
                    onClick={() => {
                      setCurrentStep('input');
                      setVerificationCode('');
                      setCodeSent(false);
                      toast.success('Можешь отправить код заново');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Не пришел код? Отправить заново
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Кнопки навигации */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex items-center justify-between border-t border-white/10"
      >
        <button
          onClick={handleBackClick}
          className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          Назад
        </button>
        
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          Пропустить
        </button>
      </motion.div>
    </div>
  );
};