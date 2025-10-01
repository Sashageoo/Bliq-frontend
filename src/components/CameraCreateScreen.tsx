import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Camera, 
  Video, 
  Type, 
  Zap, 
  ZapOff,
  Search,
  Circle,
  Square,
  Send,
  Check,
  Image,
  RotateCcw,
  Plus,
  Sparkles
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

type ContentType = 'photo' | 'video' | 'text';
type CameraStep = 'camera' | 'text-input' | 'preview' | 'recipient' | 'superpower' | 'create-superpower';

interface Superpower {
  name: string;
  emoji: string;
  category?: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface CameraCreateScreenProps {
  superpowers: Superpower[];
  friends: Friend[];
  onBack: () => void;
  onCreateBlik: (data: {
    type: ContentType;
    content: string;
    recipientId: string;
    superpowerId: string;
    mediaUrl?: string;
  }) => void;
  onCreateSuperpower?: (data: {
    name: string;
    emoji: string;
    category: string;
  }) => string; // Возвращает название созданной суперсилы
}

export function CameraCreateScreen({
  superpowers,
  friends,
  onBack,
  onCreateBlik,
  onCreateSuperpower
}: CameraCreateScreenProps) {
  // Категории суперсил
  const superpowerCategoriesFilter = [
    { id: 'all', name: 'Все', emoji: '⭐', color: 'from-purple-500 to-pink-500' },
    { id: 'mind', name: 'Mind', emoji: '🧠', color: 'from-blue-500 to-cyan-500' },
    { id: 'soul', name: 'Soul', emoji: '💜', color: 'from-purple-500 to-violet-500' },
    { id: 'body', name: 'Body', emoji: '💪', color: 'from-green-500 to-emerald-500' },
    { id: 'flow', name: 'Flow', emoji: '🌊', color: 'from-cyan-500 to-teal-500' },
    { id: 'crew', name: 'Crew', emoji: '👥', color: 'from-orange-500 to-red-500' },
    { id: 'style', name: 'Style', emoji: '🎨', color: 'from-pink-500 to-rose-500' },
    { id: 'drive', name: 'Drive', emoji: '⚡', color: 'from-yellow-500 to-orange-500' }
  ];

  // Часто используемые суперсилы (топ-5 по популярности)
  const frequentlyUsedSuperpowers = [
    { name: 'Креативность', emoji: '🧠', category: 'mind', uses: 156 },
    { name: 'Харизма', emoji: '👑', category: 'soul', uses: 142 },
    { name: 'Лидерство', emoji: '⭐', category: 'soul', uses: 128 },
    { name: 'Крутой стиль', emoji: '❄️', category: 'style', uses: 119 },
    { name: 'Программирование', emoji: '💻', category: 'mind', uses: 103 }
  ];

  const [step, setStep] = useState<CameraStep>('camera');
  const [contentType, setContentType] = useState<ContentType>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string>('');
  const [content, setContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedSuperpower, setSelectedSuperpower] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [superpowerSearchQuery, setSuperpowerSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSuperpowerCategory, setSelectedSuperpowerCategory] = useState<string>(''); // Для экрана выбора суперсилы
  const [newSuperpowerName, setNewSuperpowerName] = useState('');
  const [newSuperpowerEmoji, setNewSuperpowerEmoji] = useState('');
  const [newSuperpowerCategory, setNewSuperpowerCategory] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // 7 категорий суперсил системы Bliq
  const superpowerCategories = [
    { id: 'Flow', name: 'Flow', emoji: '🌊', description: 'Поток, продуктивность, эффективность' },
    { id: 'Soul', name: 'Soul', emoji: '💜', description: 'Душа, эмоции, внутренний мир' },
    { id: 'Mind', name: 'Mind', emoji: '🧠', description: 'Интеллект, анализ, креативность' },
    { id: 'Crew', name: 'Crew', emoji: '👥', description: 'Команда, общение, лидерство' },
    { id: 'Body', name: 'Body', emoji: '💪', description: 'Тело, здоровье, физическая форма' },
    { id: 'Style', name: 'Style', emoji: '🎨', description: 'Стиль, эстетика, самовыражение' },
    { id: 'Drive', name: 'Drive', emoji: '⚡', description: 'Драйв, мотивация, энергия' }
  ];

  // Симуляция камеры (в реальном приложении здесь был бы доступ к камере)
  const [cameraStream, setCameraStream] = useState<string>('https://images.unsplash.com/photo-1610313898425-a5c637a940db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHNtaWxpbmclMjB0ZWVuYWdlciUyMGNvbG9yZnVsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4OTU4OTQwfDA&ixlib=rb-4.1.0&q=80&w=800&h=1200&fit=crop&crop=face');

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRandomMediaPreview = () => {
    const previews = [
      'https://images.unsplash.com/photo-1610313898425-a5c637a940db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHNtaWxpbmclMjB0ZWVuYWdlciUyMGNvbG9yZnVsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4OTU4OTQwfDA&ixlib=rb-4.1.0&q=80&w=800&h=1200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvbG9yZnVsJTIwcG9ydHJhaXQlMjB5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NTg5NTkxNDZ8MA&ixlib=rb-4.1.0&q=80&w=800&h=1200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHNtaWxpbmclMjB5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NTg5NTkxNTR8MA&ixlib=rb-4.1.0&q=80&w=800&h=1200&fit=crop&crop=face'
    ];
    return previews[Math.floor(Math.random() * previews.length)];
  };

  const handleCapture = () => {
    if (contentType === 'photo') {
      const preview = getRandomMediaPreview();
      setCapturedMedia(preview);
      setStep('preview');
    } else if (contentType === 'video') {
      if (isRecording) {
        // Останавливаем запись
        const preview = getRandomMediaPreview();
        setCapturedMedia(preview);
        setIsRecording(false);
        setStep('preview');
      } else {
        // Начинаем запись
        setIsRecording(true);
      }
    }
  };

  const handleRetake = () => {
    setCapturedMedia('');
    setStep('camera');
  };

  const handleNext = () => {
    if (!canProceed()) {
      return;
    }
    
    if (step === 'camera') {
      if (contentType === 'text') {
        setStep('text-input');
      } else {
        setStep('preview');
      }
    } else if (step === 'text-input' || step === 'preview') {
      setStep('recipient');
    } else if (step === 'recipient') {
      setStep('superpower');
    } else if (step === 'superpower') {
      // Отправляем блик
      onCreateBlik({
        type: contentType,
        content: content,
        recipientId: selectedRecipient,
        superpowerId: selectedSuperpower,
        mediaUrl: capturedMedia
      });
    }
  };

  const handleBack = () => {
    if (step === 'create-superpower') {
      setStep('superpower');
      // Сбрасываем данные создания новой суперсилы
      setNewSuperpowerName('');
      setNewSuperpowerEmoji('');
      setNewSuperpowerCategory('');
    } else if (step === 'superpower') {
      if (selectedSuperpowerCategory) {
        // Если выбрана категория, возвращаемся к выбору категорий
        setSelectedSuperpowerCategory('');
      } else {
        // Если мы на экране категорий, возвращаемся к получателю
        setStep('recipient');
      }
    } else if (step === 'recipient') {
      if (contentType === 'text') {
        setStep('text-input');
      } else {
        setStep('preview');
      }
    } else if (step === 'preview') {
      setStep('camera');
    } else if (step === 'text-input') {
      setStep('camera');
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    if (step === 'text-input') {
      return content.trim().length > 0;
    } else if (step === 'preview') {
      return capturedMedia.length > 0;
    } else if (step === 'recipient') {
      return selectedRecipient.length > 0;
    } else if (step === 'superpower') {
      return selectedSuperpower.length > 0;
    }
    return false; // По умолчанию блокируем переход
  };

  const handleCreateNewSuperpower = () => {
    if (newSuperpowerName.trim() && newSuperpowerEmoji && newSuperpowerCategory && onCreateSuperpower) {
      // Создаем новую суперсилу через переданную функцию
      const createdSuperpowerName = onCreateSuperpower({
        name: newSuperpowerName.trim(),
        emoji: newSuperpowerEmoji,
        category: newSuperpowerCategory
      });
      
      // Возвращаемся к выбору суперсил и сразу выбираем созданную
      setSelectedSuperpower(createdSuperpowerName);
      setStep('superpower');
      
      // Сбрасываем форму
      setNewSuperpowerName('');
      setNewSuperpowerEmoji('');
      setNewSuperpowerCategory('');
    }
  };

  // ЭКРАН КАМЕРЫ
  if (step === 'camera') {
    return (
      <div className="h-screen relative overflow-hidden bg-black">
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        {/* Предпросмотр камеры / селектор типа контента */}
        <div className="relative w-full h-full flex flex-col">
          {/* Фон камеры */}
          <div 
            className="flex-1 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${cameraStream})` }}
          >
            {/* Gradient overlay for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            
            {/* Кнопка назад */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="absolute top-20 left-6 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg"
            >
              <ArrowLeft size={20} />
            </motion.button>

            {/* Кнопка вспышки (только для фото/видео) */}
            {contentType !== 'text' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFlashOn(!isFlashOn)}
                className={`absolute top-20 right-6 z-30 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center border shadow-lg ${
                  isFlashOn 
                    ? 'bg-yellow-500/80 text-black border-yellow-400' 
                    : 'bg-black/60 text-white border-white/30'
                }`}
              >
                {isFlashOn ? <Zap size={20} /> : <ZapOff size={20} />}
              </motion.button>
            )}

            {/* Индикатор записи */}
            {isRecording && (
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30">
                <div className="flex items-center gap-2 bg-red-500/90 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">REC</span>
                </div>
              </div>
            )}
          </div>

          {/* Нижний UI */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="px-6 pt-8 pb-12">
              {/* Переключатель типа контента */}
              <div className="flex justify-center mb-8">
                <div className="flex bg-black/50 backdrop-blur-md rounded-2xl p-1 border border-white/20">
                  {[
                    { type: 'photo' as ContentType, icon: Camera, label: 'Фото' },
                    { type: 'video' as ContentType, icon: Video, label: 'Видео' },
                    { type: 'text' as ContentType, icon: Type, label: 'Текст' }
                  ].map(({ type, icon: Icon, label }) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setContentType(type);
                        setIsRecording(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        contentType === type
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Кнопка захвата */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={contentType === 'text' ? handleNext : handleCapture}
                  className={`relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 ${
                    contentType === 'text'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : isRecording
                      ? 'bg-red-500'
                      : 'bg-white'
                  }`}
                >
                  {contentType === 'text' ? (
                    <Type size={28} className="text-white" />
                  ) : contentType === 'video' ? (
                    isRecording ? (
                      <Square size={24} className="text-white" />
                    ) : (
                      <Circle size={32} className="text-black" />
                    )
                  ) : (
                    <Circle size={32} className="text-black" />
                  )}
                  
                  {/* Пульсирующий эффект при записи */}
                  {isRecording && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-red-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ЭКРАН ВВОДА ТЕКСТА
  if (step === 'text-input') {
    return (
      <div className="h-screen relative overflow-hidden">
        {/* Фоновый градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800" />
        
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-between px-6 py-4 pt-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 className="text-white font-semibold text-xl drop-shadow-lg">Текстовый блик</h1>
            <div className="w-10" />
          </div>

          {/* Текстовое поле */}
          <div className="flex-1 px-6 py-4">
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="О чем хотите рассказать? Поделитесь своими мыслями, впечатлениями или просто поддержите кого-то добрыми словами..."
                className="flex-1 min-h-[120px] bg-transparent border-none text-white placeholder-white/60 resize-none focus:outline-none text-base leading-relaxed font-normal"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '1.5',
                  letterSpacing: '0px',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased'
                }}
                maxLength={500}
                autoFocus
              />
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <div className="text-white/40 text-sm">
                  {content.length}/500
                </div>
                <motion.button
                  whileHover={{ scale: canProceed() ? 1.05 : 1 }}
                  whileTap={{ scale: canProceed() ? 0.95 : 1 }}
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg energy-glow'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Далее
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ЭКРАН ПРЕДПРОСМОТРА
  if (step === 'preview') {
    return (
      <div className="h-screen relative overflow-hidden bg-black">
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        {/* Предпросмотр медиа */}
        {capturedMedia && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${capturedMedia})` }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(to bottom, 
                    rgba(0, 0, 0, 0.7) 0%, 
                    rgba(0, 0, 0, 0.3) 20%, 
                    rgba(0, 0, 0, 0.15) 40%, 
                    rgba(0, 0, 0, 0.15) 60%, 
                    rgba(0, 0, 0, 0.3) 80%, 
                    rgba(0, 0, 0, 0.8) 100%
                  )
                `
              }}
            />
          </>
        )}
        
        {/* Фон для текстового блика */}
        {contentType === 'text' && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800" />
        )}
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Верхняя панель */}
          <div className="flex items-center justify-between px-6 py-4 pt-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 className="text-white font-semibold text-xl drop-shadow-lg">Предпросмотр</h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRetake}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg"
            >
              <RotateCcw size={20} />
            </motion.button>
          </div>

          {/* Основной контент занимает всё доступное пространство */}
          <div className="flex-1 flex items-center justify-center px-6">
            {/* Контент для текстового блика */}
            {contentType === 'text' && content && (
              <div className="glass-card rounded-2xl p-8 max-w-md w-full">
                <p className="text-white text-lg leading-relaxed text-center">
                  {content}
                </p>
              </div>
            )}
            {/* Для фото/видео контент отображается как фон, поэтому здесь пустое пространство */}
          </div>

          {/* Кнопка зафиксирована внизу экрана */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-8 bg-gradient-to-t from-black via-black/90 to-transparent">
            <motion.button
              whileHover={{ scale: canProceed() ? 1.05 : 1 }}
              whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white energy-glow'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Продолжить</span>
                <ArrowRight size={20} />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ЭКРАН ВЫБОРА ПОЛУЧАТЕЛЯ (AirDrop стиль)
  if (step === 'recipient') {
    return (
      <div className="h-screen relative overflow-hidden">
        {/* Фоновое изображение с сильным размытием */}
        {capturedMedia && contentType !== 'text' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
              style={{ 
                backgroundImage: `url(${capturedMedia})`,
                filter: 'blur(40px)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/70" />
          </>
        )}
        
        {/* Фон для текстового блика */}
        {contentType === 'text' && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800" />
        )}
        
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-between px-6 py-4 pt-20 relative z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('🔙 Кнопка "Назад" (получатель) нажата!');
                handleBack();
              }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg relative z-50 cursor-pointer"
              style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="text-center">
              <h1 className="text-white font-semibold text-xl drop-shadow-lg">Кому отправить блик?</h1>
              <p className="text-white/70 text-sm mt-1 drop-shadow">
                Выбери друга для отправки энергии
              </p>
            </div>
            <div className="w-10" />
          </div>

          {/* Радиальный градиент в центре экрана */}
          <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent pointer-events-none" 
               style={{
                 background: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)',
                 zIndex: 1
               }} 
          />

          {/* Поиск */}
          <div className="px-6 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/50" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-200 h-12 text-base leading-tight font-normal"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '1.2',
                  letterSpacing: '0px',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased'
                }}
              />
            </div>
          </div>

          {/* СПИСОК ДРУЗЕЙ - ЧАСТЫЕ ПОЛУЧАТЕЛИ + РЕЗУЛЬТАТЫ ПОИСКА */}
          <div className="flex-1 px-6 min-h-0">
            <div className="h-full overflow-y-auto scrollbar-hide">
              {/* Сетка друзей 3x3 с крупными аватарами */}
              <div className="grid grid-cols-3 gap-6 justify-items-center max-w-sm mx-auto">
                {filteredFriends.slice(0, 9).map((friend) => (
                  <motion.button
                    key={friend.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRecipient(friend.id)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
                      selectedRecipient === friend.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-md border border-purple-400/50 shadow-lg'
                        : 'hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    {/* Аватар 64x64 */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Индикатор онлайн статуса */}
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-lg" />
                      )}
                      
                      {/* Индикатор выбора */}
                      {selectedRecipient === friend.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Имя друга */}
                    <span className="text-white text-xs font-medium text-center leading-tight line-clamp-2 max-w-[70px]">
                      {friend.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Сообщение если друзья не найдены */}
              {filteredFriends.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/60 text-sm mb-2">Друзья не найдены</div>
                  <div className="text-white/40 text-xs">Попробуй изменить поисковый запрос</div>
                </div>
              )}
            </div>
          </div>

          {/* Кнопка продолжить - фиксированная внизу */}
          <div className="px-6 pb-6 pt-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent relative z-50">
            <motion.button
              whileHover={{ scale: canProceed() ? 1.02 : 1 }}
              whileTap={{ scale: canProceed() ? 0.98 : 1 }}
              onClick={() => {
                console.log('➡️ Кнопка "Продолжить" (получатель) нажата!', { 
                  canProceed: canProceed(),
                  selectedRecipient: `"${selectedRecipient}"`,
                  disabled: !canProceed()
                });
                handleNext();
              }}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 relative z-50 cursor-pointer ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl energy-glow'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Send size={18} />
                <span>
                  {selectedRecipient && friends.find(f => f.id === selectedRecipient) 
                    ? `Блик для ${friends.find(f => f.id === selectedRecipient)?.name}` 
                    : 'Продолжить'
                  }
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ЭКРАН ВЫБОРА СУПЕРСИЛЫ (ДВУХЭТАПНЫЙ)
  if (step === 'superpower') {
    return (
      <div className="h-screen relative overflow-hidden">
        {/* Фоновое изображение с градиентным затемнением */}
        {capturedMedia && contentType !== 'text' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${capturedMedia})` }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(to bottom, 
                    rgba(0, 0, 0, 0.7) 0%, 
                    rgba(0, 0, 0, 0.3) 20%, 
                    rgba(0, 0, 0, 0.15) 40%, 
                    rgba(0, 0, 0, 0.15) 60%, 
                    rgba(0, 0, 0, 0.3) 80%, 
                    rgba(0, 0, 0, 0.8) 100%
                  )
                `
              }}
            />
          </>
        )}
        
        {/* Фон для текстового блика */}
        {contentType === 'text' && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800" />
        )}
        
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-between px-6 py-4 pt-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('🔙 Кнопка "Назад" (суперсила) нажата!');
                handleBack();
              }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg relative z-50 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="text-center">
              <h1 className="text-white font-semibold text-xl drop-shadow-lg">
                {selectedSuperpowerCategory ? 
                  `${superpowerCategories.find(c => c.id === selectedSuperpowerCategory)?.name} суперсилы` : 
                  'За какую суперсилу'
                }
              </h1>
              {selectedRecipient && friends.find(f => f.id === selectedRecipient) && (
                <p className="text-white/80 text-sm mt-1 drop-shadow">
                  для {friends.find(f => f.id === selectedRecipient)?.name}
                </p>
              )}
            </div>
            <div className="w-10" />
          </div>

          {/* Краткая информация о блике */}
          <div className="px-6 mb-6">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {friends.find(f => f.id === selectedRecipient)?.avatar ? (
                    <img
                      src={friends.find(f => f.id === selectedRecipient)?.avatar}
                      alt={friends.find(f => f.id === selectedRecipient)?.name || 'Получатель'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-400/50"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">
                        {friends.find(f => f.id === selectedRecipient)?.name.charAt(0) || 'R'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[8px]">🎁</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">
                    Блик для {friends.find(f => f.id === selectedRecipient)?.name}
                  </div>
                  <div className="text-white/60 text-xs line-clamp-2">
                    {contentType === 'text' ? (
                      content.length > 0 ? content : 'Текстовый блик'
                    ) : contentType === 'photo' ? (
                      'Фото блик 📸'
                    ) : contentType === 'video' ? (
                      'Видео блик 🎥'
                    ) : (
                      'Медиа блик'
                    )}
                  </div>
                  {selectedSuperpower && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs">
                        {superpowers.find(sp => sp.name === selectedSuperpower)?.emoji || '⚡'}
                      </span>
                      <span className="text-white/50 text-xs">
                        {selectedSuperpower}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ПОИСК СУПЕРСИЛ - ГЛАВНЫЙ СПОСОБ ВЫБОРА */}
          <div className="px-6 mb-6">
            <div className="relative">
              <Input
                ref={(input) => {
                  // Автофокус при открытии экрана
                  if (input && step === 'superpower') {
                    setTimeout(() => input.focus(), 100);
                  }
                }}
                type="text"
                placeholder="🔍 Какая у тебя суперсила?"
                value={superpowerSearchQuery}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setSuperpowerSearchQuery(newQuery);
                  
                  // Сбрасываем выбранную суперсилу при начале поиска
                  if (newQuery.trim() && selectedSuperpower) {
                    setSelectedSuperpower('');
                  }
                }}
                className="bg-black/40 border-white/30 text-white placeholder-white/60 focus:border-purple-400 focus:ring-purple-400 h-12 py-3 px-4 text-base leading-tight font-normal"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '1.2',
                  letterSpacing: '0px',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased'
                }}
              />
            </div>
          </div>

          {/* ЧАСТО ИСПОЛЬЗУЕМЫЕ СУПЕРСИЛЫ - показываем только если поиск пустой */}
          {!superpowerSearchQuery && (
            <div className="mb-6">
              <div className="px-6 mb-3">
                <h3 className="text-white/80 font-medium text-sm">Часто используемые вами</h3>
              </div>
              <div className="px-6">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {frequentlyUsedSuperpowers.slice(0, 4).map((superpower) => (
                    <motion.button
                      key={superpower.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSuperpower(superpower.name)}
                      className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 backdrop-blur-md flex flex-col items-center gap-2 min-w-[90px] ${
                        selectedSuperpower === superpower.name
                          ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 border border-purple-400/60 shadow-lg energy-glow'
                          : 'bg-black/30 border border-white/30 hover:bg-black/40 hover:border-white/50 shadow-lg'
                      }`}
                    >
                      <div className="relative">
                        <span className="text-2xl">{superpower.emoji}</span>
                        {/* Иконка частоты использования */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-orange-500/80 rounded-full flex items-center justify-center">
                          <span className="text-[8px]">⭐</span>
                        </div>
                        {selectedSuperpower === superpower.name && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-white font-medium text-xs leading-tight line-clamp-2">{superpower.name}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ПОДСКАЗКА ДЛЯ ПОИСКА - показываем только если поиск пустой и нет выбранной суперсилы */}
          {!superpowerSearchQuery && !selectedSuperpower && (
            <div className="px-6 mb-6">
              <div className="text-center text-white/50 text-sm">
                <span>👆 Начни вводить название суперсилы в поиске</span>
                <br />
                <span className="text-xs text-white/40 mt-1">Например: "креативность", "лидерство", "программирование"</span>
              </div>
            </div>
          )}



          {/* РЕЗУЛЬТАТЫ ПОИСКА */}
          {superpowerSearchQuery && superpowerSearchQuery.trim() && (
            <div className="flex-1 px-6 min-h-0 pb-24">
              <div className="mb-3">
                <h3 className="text-white/80 font-medium text-sm">
                  Результаты поиска "{superpowerSearchQuery.trim()}"
                </h3>
              </div>
              <div className="h-full overflow-y-auto scrollbar-hide pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {superpowers
                    .filter(superpower => {
                      // Фильтруем по поиску
                      const matchesSearch = superpower.name.toLowerCase().includes(superpowerSearchQuery.toLowerCase()) ||
                                          superpower.emoji.includes(superpowerSearchQuery);
                      return matchesSearch;
                    })
                    .map((superpower) => (
                    <motion.button
                      key={superpower.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSuperpower(superpower.name)}
                      className={`w-full p-4 rounded-xl transition-all duration-300 backdrop-blur-md flex flex-col items-center gap-3 min-h-[100px] ${
                        selectedSuperpower === superpower.name
                          ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 border border-purple-400/60 shadow-lg energy-glow'
                          : 'bg-black/30 border border-white/30 hover:bg-black/40 hover:border-white/50 shadow-lg'
                      }`}
                    >
                      <div className="relative">
                        <span className="text-3xl">{superpower.emoji}</span>
                        {selectedSuperpower === superpower.name && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-white font-medium text-sm leading-tight">{superpower.name}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {/* Показываем возможность создать новую суперсилу если ничего не найдено */}
                {superpowers.filter(superpower => {
                  const matchesSearch = superpower.name.toLowerCase().includes(superpowerSearchQuery.toLowerCase()) ||
                                      superpower.emoji.includes(superpowerSearchQuery);
                  return matchesSearch;
                }).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-white/60 text-sm mb-4">
                      Суперсила "{superpowerSearchQuery}" не найдена
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Устанавливаем название новой суперсилы из поискового запроса
                        setNewSuperpowerName(superpowerSearchQuery.trim());
                        setNewSuperpowerEmoji(''); // Пользователь выберет эмодзи
                        setNewSuperpowerCategory(''); // Пользователь выберет категорию
                        setStep('create-superpower');
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all duration-300 energy-glow flex items-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Создать "{superpowerSearchQuery}"</span>
                    </motion.button>
                    <div className="text-white/40 text-xs mt-3">
                      Или попробуйте другой запрос
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Кнопка отправить блик - абсолютно зафиксирована внизу экрана */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-8 bg-gradient-to-t from-black via-black/90 to-transparent">
            <motion.button
              whileHover={{ scale: canProceed() ? 1.05 : 1 }}
              whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              onClick={() => {
                console.log('➡️ Кнопка "Отправить блик" (суперсила) нажата!', { 
                  canProceed: canProceed(),
                  selectedSuperpower: `"${selectedSuperpower}"`,
                  disabled: !canProceed()
                });
                handleNext();
              }}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white energy-glow'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Send size={20} />
                <span>Отправить блик</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ЭКРАН СОЗДАНИЯ НОВОЙ СУПЕРСИЛЫ
  if (step === 'create-superpower') {
    return (
      <div className="h-screen relative overflow-hidden">
        {/* Фоновое изображение с градиентным затемнением */}
        {capturedMedia && contentType !== 'text' && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${capturedMedia})` }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(to bottom, 
                    rgba(0, 0, 0, 0.7) 0%, 
                    rgba(0, 0, 0, 0.3) 20%, 
                    rgba(0, 0, 0, 0.15) 40%, 
                    rgba(0, 0, 0, 0.15) 60%, 
                    rgba(0, 0, 0, 0.3) 80%, 
                    rgba(0, 0, 0, 0.8) 100%
                  )
                `
              }}
            />
          </>
        )}
        
        {/* Фон для текстового блика */}
        {contentType === 'text' && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-800" />
        )}
        
        {/* StatusBar на самом верху */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
          <StatusBar />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-between px-6 py-4 pt-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-lg"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 className="text-white font-semibold text-xl drop-shadow-lg">Создать суперсилу</h1>
            <div className="w-10" />
          </div>

          {/* Форма создания суперсилы */}
          <div className="flex-1 px-6 py-6">
            <div className="glass-card rounded-xl p-6">
              <div className="space-y-6">
                {/* Название суперсилы */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Название суперсилы
                  </label>
                  <Input
                    type="text"
                    placeholder="Например: Креативность, Лидерство..."
                    value={newSuperpowerName}
                    onChange={(e) => setNewSuperpowerName(e.target.value)}
                    className="bg-black/40 border-white/30 text-white placeholder-white/60 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>

                {/* Эмодзи суперсилы */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Эмодзи
                  </label>
                  
                  {/* Легкая строка эмодзи - компактно и воздушно */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-3 p-2">
                      {[
                        '🚀', '💡', '🎨', '⚡', '🧠', '💪', '🌟', '🔥',
                        '🎯', '💎', '👑', '🌈', '✨', '🎭', '🎵', '💫'
                      ].map((emoji) => (
                        <motion.div
                          key={emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewSuperpowerEmoji(emoji)}
                          className={`relative w-10 h-10 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 rounded-lg ${
                            newSuperpowerEmoji === emoji
                              ? 'bg-purple-500/25'
                              : 'hover:bg-white/10'
                          }`}
                        >
                          {emoji}
                          {newSuperpowerEmoji === emoji && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
                            >
                              <Check size={10} className="text-white" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Кнопка "Ещё эмодзи" */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Показываем расширенный набор эмодзи
                        const expandedEmojis = [
                          '🎪', '🎬', '🎸', '🎹', '🎤', '🖌️', '🖼️', '🎊', '🎉', '🎁', '🎀',
                          '🛸', '🦄', '🔮', '🎰', '🎲', '🃏', '🤯', '💭', '💬', '💯', '🔝', '📈',
                          '🏆', '🥇', '🏅', '🎖️', '👊', '✊', '🤝', '👥', '👫', '👪', '💝', '💖', '💕', '💗',
                          '🔬', '⚙️', '🔧', '🛠️', '🔍', '📚', '✏️', '📝', '🎪', '🌊', '🏔️', '🌸', '🦋', '🎺', '🎻'
                        ];
                        const randomEmoji = expandedEmojis[Math.floor(Math.random() * expandedEmojis.length)];
                        setNewSuperpowerEmoji(randomEmoji);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/15 text-white/70 text-sm font-medium hover:bg-black/30 hover:border-white/25 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      Ещё эмодзи
                    </motion.button>
                  </div>
                  
                  {/* Кастомный ввод эмодзи */}
                  <div>
                    <div className="text-white/60 text-xs mb-2">Или введите свой эмодзи:</div>
                    <Input
                      type="text"
                      placeholder="🎭"
                      value={newSuperpowerEmoji}
                      onChange={(e) => setNewSuperpowerEmoji(e.target.value)}
                      className="bg-black/30 border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:ring-purple-400 text-2xl text-center"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Категория - компактный блок */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Категория
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {superpowerCategories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewSuperpowerCategory(category.id)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-200 text-xs font-medium ${
                          newSuperpowerCategory === category.id
                            ? 'bg-purple-500/30 border border-purple-400/60 text-white'
                            : 'bg-black/30 border border-white/20 text-white/80 hover:bg-black/40 hover:border-white/30'
                        }`}
                      >
                        <span className="text-sm">{category.emoji}</span>
                        <span>{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка создать - фиксированная внизу */}
          <div className="px-6 pb-6 pt-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
            <motion.button
              whileHover={{ scale: (newSuperpowerName && newSuperpowerEmoji && newSuperpowerCategory) ? 1.02 : 1 }}
              whileTap={{ scale: (newSuperpowerName && newSuperpowerEmoji && newSuperpowerCategory) ? 0.98 : 1 }}
              onClick={handleCreateNewSuperpower}
              disabled={!(newSuperpowerName && newSuperpowerEmoji && newSuperpowerCategory)}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                (newSuperpowerName && newSuperpowerEmoji && newSuperpowerCategory)
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl energy-glow'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus size={18} />
                <span>Создать суперсилу</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}