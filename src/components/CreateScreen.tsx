import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Video, Type, User, Zap, Send, Search } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

type ContentType = 'text' | 'photo' | 'video';

interface Superpower {
  name: string;
  emoji: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface CreateScreenProps {
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
}

export function CreateScreen({
  superpowers,
  friends,
  onBack,
  onCreateBlik
}: CreateScreenProps) {
  const [contentType, setContentType] = useState<ContentType>('photo');
  const [content, setContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedSuperpower, setSelectedSuperpower] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [step, setStep] = useState<'content' | 'recipient' | 'superpower'>('content');
  const [searchQuery, setSearchQuery] = useState('');

  const contentTypes = [
    { id: 'photo' as const, icon: Camera, label: 'Фото', color: 'from-green-500 to-blue-500' },
    { id: 'video' as const, icon: Video, label: 'Видео', color: 'from-purple-500 to-pink-500' },
    { id: 'text' as const, icon: Type, label: 'Текст', color: 'from-blue-500 to-purple-500' }
  ];

  const handleCreate = () => {
    if (!content.trim() || !selectedRecipient || !selectedSuperpower) return;

    onCreateBlik({
      type: contentType,
      content: content.trim(),
      recipientId: selectedRecipient,
      superpowerId: selectedSuperpower,
      mediaUrl: mediaUrl || undefined
    });
  };

  const handleNext = () => {
    if (step === 'content' && content.trim()) {
      setStep('recipient');
    } else if (step === 'recipient' && selectedRecipient) {
      setStep('superpower');
    }
  };

  const handleBack = () => {
    if (step === 'superpower') {
      setStep('recipient');
    } else if (step === 'recipient') {
      setStep('content');
    } else {
      onBack();
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isStepValid = () => {
    switch (step) {
      case 'content':
        return content.trim();
      case 'recipient':
        return selectedRecipient;
      case 'superpower':
        return selectedSuperpower;
      default:
        return false;
    }
  };

  const isFormValid = content.trim() && selectedRecipient && selectedSuperpower;

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Контент с прокруткой */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Статус-бар */}
        <StatusBar />

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-6 pt-8">
            {/* Заголовок с кнопкой назад */}
            <div className="flex items-center justify-between py-3 mb-6">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className="text-white p-1"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <h1 className="text-white font-semibold text-xl">Создать блик</h1>
              </div>
              
              {/* Индикатор прогресса */}
              <div className="flex gap-1">
                {['content', 'recipient', 'superpower'].map((stepName, index) => (
                  <div
                    key={stepName}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step === stepName
                        ? 'bg-purple-500'
                        : ['content', 'recipient', 'superpower'].indexOf(step) > index
                        ? 'bg-purple-400'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Основной контейнер */}
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl mb-6 overflow-hidden"
            >
              {step === 'content' && (
                <div className="p-6 space-y-6">
                  {/* Выбор типа контента */}
                  <div>
                    <h3 className="text-white font-medium mb-4 text-center">Тип контента</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {contentTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setContentType(type.id)}
                          className={`p-6 rounded-xl border transition-all duration-300 ${
                            contentType === type.id
                              ? `bg-gradient-to-r ${type.color} border-white/30 shadow-lg`
                              : 'bg-gray-900/60 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <type.icon size={32} className="text-white mx-auto mb-3" />
                          <div className="text-white text-sm font-medium">{type.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Контент */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Ваше сообщение</h3>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`Напишите ${contentType === 'text' ? 'текст' : 'описание'} блика...`}
                      className="min-h-[120px] bg-gray-900/60 border-white/10 text-white placeholder-white/50 resize-none"
                      maxLength={500}
                    />
                    <div className="text-right text-white/50 text-xs mt-2">
                      {content.length}/500
                    </div>
                  </div>

                  {/* Медиа URL для фото/видео */}
                  {(contentType === 'photo' || contentType === 'video') && (
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        URL {contentType === 'photo' ? 'изображения' : 'видео'} (опционально)
                      </h3>
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder={`https://example.com/${contentType === 'photo' ? 'image.jpg' : 'video.mp4'}`}
                        className="w-full p-3 bg-gray-900/60 border border-white/10 rounded-xl text-white placeholder-white/50 focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Кнопка Далее */}
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      isStepValid()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Далее: Выбрать получателя
                  </Button>
                </div>
              )}

              {step === 'recipient' && (
                <div className="p-6 space-y-6">
                  {/* Поиск */}
                  <div>
                    <h3 className="text-white font-medium mb-4 text-center">Кому отправляем</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по имени..."
                        className="pl-10 bg-gray-900/60 border-white/10 text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  {/* Список друзей с крупными аватарками */}
                  <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                    {filteredFriends.map((friend) => (
                      <motion.button
                        key={friend.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRecipient(friend.id)}
                        className={`
                          flex flex-col items-center gap-3 p-4 rounded-xl border 
                          transition-all duration-300
                          group relative
                          ${selectedRecipient === friend.id
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                          }
                        `}
                      >
                        {/* Glow effect на hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                              <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                            </div>
                            {/* Индикатор онлайн */}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                              friend.isOnline ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                          </div>
                          <div className="text-center">
                            <div className="text-white text-sm font-medium truncate max-w-full">{friend.name}</div>
                            <div className="text-white/60 text-xs">{friend.isOnline ? 'онлайн' : 'офлайн'}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Кнопка Далее */}
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      isStepValid()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Далее: Выбрать суперсилу
                  </Button>
                </div>
              )}

              {step === 'superpower' && (
                <div className="p-6 space-y-6">
                  {/* Суперсила */}
                  <div>
                    <h3 className="text-white font-medium mb-4 text-center">За какую суперсилу</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {superpowers.map((superpower, index) => (
                        <motion.button
                          key={superpower.name}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSuperpower(superpower.name)}
                          className={`
                            flex items-center gap-3 p-4 rounded-xl border 
                            transition-all duration-300
                            group relative
                            ${selectedSuperpower === superpower.name
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-lg shadow-purple-500/20'
                              : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                            }
                          `}
                        >
                          {/* Glow effect на hover */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="relative z-10 flex items-center gap-3 w-full">
                            <span className="text-2xl">{superpower.emoji}</span>
                            <div className="flex-1 text-left">
                              <div className="text-white text-sm font-medium">{superpower.name}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Кнопка Отправить */}
                  <Button
                    onClick={handleCreate}
                    disabled={!isStepValid()}
                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                      isStepValid()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} className="mr-2" />
                    Отправить блик
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}