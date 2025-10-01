import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Palette } from 'lucide-react';

interface CustomizableSuperpowerLogoProps {
  emoji: string;
  name: string;
  customImage?: string;
  ownerAvatar?: string; // Аватарка владельца суперсилы
  onImageUpload?: (imageUrl: string) => void;
  onEmojiChange?: (emoji: string) => void;
  isOwner?: boolean; // Показывать ли возможность редактирования
}

export function CustomizableSuperpowerLogo({
  emoji,
  name,
  customImage,
  ownerAvatar,
  onImageUpload,
  onEmojiChange,
  isOwner = false
}: CustomizableSuperpowerLogoProps) {
  const [showCustomization, setShowCustomization] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Популярные эмодзи для суперсил
  const popularEmojis = ['💡', '👑', '⭐', '❄️', '⚡', '💪', '🤝', '💖', '🏃‍♀️', '🎨', '🧠', '🔥', '✨', '🚀', '💎', '🌟'];

  const handleCustomImageUpload = () => {
    // В реальном приложении здесь был бы file picker
    const imageUrl = prompt('Введите URL изображения для обложки:');
    if (imageUrl && onImageUpload) {
      onImageUpload(imageUrl);
      setShowCustomization(false);
    }
  };

  const handleEmojiSelect = (selectedEmoji: string) => {
    if (onEmojiChange) {
      onEmojiChange(selectedEmoji);
    }
    setShowCustomization(false);
  };

  return (
    <div className="relative">
      {/* Основная обложка */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        onClick={() => isOwner && setShowCustomization(!showCustomization)}
      >
        <div className="w-12 h-12 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
          {ownerAvatar ? (
            <img 
              src={ownerAvatar} 
              alt={`Владелец суперсилы ${name}`}
              className="w-full h-full object-cover"
            />
          ) : customImage ? (
            <img 
              src={customImage} 
              alt={`${name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">{emoji}</span>
          )}
        </div>

        {/* Индикатор возможности кастомизации */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered || showCustomization ? 1 : 0,
              scale: isHovered || showCustomization ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-black rounded-full flex items-center justify-center"
          >
            <Palette size={8} className="text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Панель кастомизации */}
      {showCustomization && isOwner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 z-50 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[280px]"
        >
          {/* Заголовок */}
          <div className="text-white font-medium text-sm mb-3 flex items-center gap-2">
            <Palette size={14} />
            Настроить обложку
          </div>

          {/* Опции кастомизации */}
          <div className="space-y-3">
            {/* Загрузить изображение */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCustomImageUpload}
              className="w-full flex items-center gap-2 p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all duration-300"
            >
              <Upload size={14} />
              Загрузить изображение
            </motion.button>

            {/* Выбор эмодзи */}
            <div>
              <div className="text-white/70 text-xs mb-2">Популярные эмодзи:</div>
              <div className="grid grid-cols-8 gap-1">
                {popularEmojis.map((emojiOption, index) => (
                  <motion.button
                    key={emojiOption}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEmojiSelect(emojiOption)}
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-300
                      ${emoji === emojiOption 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    {emojiOption}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Сброс */}
            {customImage && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onImageUpload) onImageUpload('');
                  setShowCustomization(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg backdrop-blur-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/20 transition-all duration-300"
              >
                <Camera size={14} />
                Сбросить до эмодзи
              </motion.button>
            )}
          </div>

          {/* Закрыть */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCustomization(false)}
            className="w-full mt-3 p-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all duration-300"
          >
            Закрыть
          </motion.button>
        </motion.div>
      )}

      {/* Backdrop для закрытия панели */}
      {showCustomization && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowCustomization(false)}
        />
      )}
    </div>
  );
}