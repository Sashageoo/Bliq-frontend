import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Mail, MessageCircle, Plus, X, Sparkles, Share2, Copy, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CreateValueMapScreenProps {
  onBack: () => void;
  availableSuperpowers?: Array<{
    name: string;
    emoji: string;
  }>;
}

interface NewUserData {
  name: string;
  contact: string;
  contactType: 'telegram' | 'email';
  avatar: string;
  selectedSuperpowers: Array<{
    name: string;
    emoji: string;
    estimatedValue: number;
    reason: string;
  }>;
}

export function CreateValueMapScreen({ onBack }: CreateValueMapScreenProps) {
  const [step, setStep] = useState<'basic' | 'superpowers' | 'preview'>('basic');
  const [newUser, setNewUser] = useState<NewUserData>({
    name: '',
    contact: '',
    contactType: 'telegram',
    avatar: '',
    selectedSuperpowers: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showCustomSuperpowerForm, setShowCustomSuperpowerForm] = useState(false);
  const [customSuperpower, setCustomSuperpower] = useState({ name: '', emoji: '' });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Группируем суперсилы по категориям Bliq с описаниями
  const categorizedSuperpowers = {
    '🧠 Mind': {
      description: 'Интеллект, мышление',
      superpowers: [
        { name: 'Креативность', emoji: '🧠' },
        { name: 'Программирование', emoji: '💻' },
        { name: 'Стратегическое мышление', emoji: '🎯' },
        { name: 'Решение проблем', emoji: '💪' },
        { name: 'Инновации', emoji: '💡' },
        { name: 'Аналитическое мышление', emoji: '📊' },
      ]
    },
    '💜 Soul': {
      description: 'Чувства, эмпатия, ценности',
      superpowers: [
        { name: 'Эмпатия', emoji: '💖' },
        { name: 'Эмоциональная поддержка', emoji: '💖' },
        { name: 'Харизма', emoji: '👑' },
        { name: 'Наставничество', emoji: '🧭' },
        { name: 'Публичные выступления', emoji: '🎤' },
        { name: 'Вдохновение других', emoji: '✨' },
      ]
    },
    '🎨 Style': {
      description: 'Эстетика, самовыражение, вкус',
      superpowers: [
        { name: 'Дизайн', emoji: '🎨' },
        { name: 'Фотография', emoji: '📸' },
        { name: 'Крутой стиль', emoji: '❄️' },
        { name: 'Музыка', emoji: '🎵' },
        { name: 'Мода', emoji: '👗' },
        { name: 'Визуальное искусство', emoji: '🖼️' },
      ]
    },
    '⚡ Drive': {
      description: 'Инициатива, лидерство, движение вперёд',
      superpowers: [
        { name: 'Лидерство', emoji: '⭐' },
        { name: 'Энергичность', emoji: '⚡' },
        { name: 'Маркетинг', emoji: '📊' },
        { name: 'Продажи', emoji: '🎯' },
        { name: 'Предпринимательство', emoji: '🚀' },
        { name: 'Мотивация', emoji: '🔥' },
      ]
    },
    '👥 Crew': {
      description: 'Команда, связи, влияние',
      superpowers: [
        { name: 'Командная работа', emoji: '🤝' },
        { name: 'Коммуникации', emoji: '💬' },
        { name: 'Организация', emoji: '📋' },
        { name: 'Нетворкинг', emoji: '🌐' },
        { name: 'Управление людьми', emoji: '👥' },
      ]
    },
    '💪 Body': {
      description: 'Энергия, здоровье, динамика',
      superpowers: [
        { name: 'Спорт', emoji: '🏃‍♀️' },
        { name: 'Танцы', emoji: '💃' },
        { name: 'Кулинария', emoji: '👨‍🍳' },
        { name: 'Фитнес', emoji: '💪' },
        { name: 'Йога', emoji: '🧘‍♀️' },
      ]
    },
    '🌊 Flow': {
      description: 'Энергия, стиль, вайб',
      superpowers: [
        { name: 'Межличностное общение', emoji: '💬' },
        { name: 'Контент-маркетинг', emoji: '📱' },
        { name: 'Креативный вайб', emoji: '🌊' },
        { name: 'Гибкость мышления', emoji: '🌀' },
      ]
    }
  };

  const handleBasicInfoNext = () => {
    if (!newUser.name.trim() || !newUser.contact.trim()) {
      toast.error('Пожалуйста, заполните имя и контакт');
      return;
    }
    
    // Валидация контакта
    if (newUser.contactType === 'telegram') {
      // Telegram username должен начинаться с @ и содержать только буквы, цифры и _
      const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
      const cleanedUsername = newUser.contact.startsWith('@') ? newUser.contact : `@${newUser.contact}`;
      if (!telegramRegex.test(cleanedUsername)) {
        toast.error('Введите корректный Telegram username (5-32 символа, буквы, цифры, _)');
        return;
      }
      // Обновляем контакт с @ если его не было
      setNewUser(prev => ({ ...prev, contact: cleanedUsername }));
    } else if (newUser.contactType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.contact)) {
        toast.error('Пожалуйста, введите корректный email');
        return;
      }
    }
    
    setStep('superpowers');
  };

  const handleAddSuperpower = (superpower: { name: string; emoji: string }) => {
    if (newUser.selectedSuperpowers.find(sp => sp.name === superpower.name)) {
      toast.error('Эта суперсила уже добавлена');
      return;
    }
    
    setNewUser(prev => ({
      ...prev,
      selectedSuperpowers: [...prev.selectedSuperpowers, {
        ...superpower,
        estimatedValue: 70,
        reason: ''
      }]
    }));
  };

  const handleRemoveSuperpower = (name: string) => {
    setNewUser(prev => ({
      ...prev,
      selectedSuperpowers: prev.selectedSuperpowers.filter(sp => sp.name !== name)
    }));
  };

  const handleUpdateSuperpower = (name: string, field: 'estimatedValue' | 'reason', value: number | string) => {
    setNewUser(prev => ({
      ...prev,
      selectedSuperpowers: prev.selectedSuperpowers.map(sp => 
        sp.name === name ? { ...sp, [field]: value } : sp
      )
    }));
  };

  const handleCreateInvite = async () => {
    if (newUser.selectedSuperpowers.length === 0) {
      toast.error('Добавьте хотя бы одну суперсилу');
      return;
    }

    setIsCreatingLink(true);
    
    // Имитируем создание инвайт-ссылки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const inviteId = Math.random().toString(36).substring(2, 15);
    const link = `https://bliq.app/invite/${inviteId}`;
    setCreatedLink(link);
    setIsCreatingLink(false);
    
    toast.success('Карта ценности создана! 🎉');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        // Сбрасываем input даже при ошибке
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        // Сбрасываем input даже при ошибке
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Освобождаем память от предыдущего URL если он был
      if (newUser.avatar && newUser.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(newUser.avatar);
      }

      // Создаем URL для предпросмотра
      const imageUrl = URL.createObjectURL(file);
      setNewUser(prev => ({ ...prev, avatar: imageUrl }));
      toast.success('Фото загружено! 📸');
    }
  };

  const handleSelectPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleAddCustomSuperpower = () => {
    if (!customSuperpower.name.trim()) {
      toast.error('Введите название суперсилы');
      return;
    }
    
    if (!customSuperpower.emoji.trim()) {
      toast.error('Выберите эмодзи для суперсилы');
      return;
    }

    if (newUser.selectedSuperpowers.find(sp => sp.name === customSuperpower.name)) {
      toast.error('Эта суперсила уже добавлена');
      return;
    }

    setNewUser(prev => ({
      ...prev,
      selectedSuperpowers: [...prev.selectedSuperpowers, {
        ...customSuperpower,
        estimatedValue: 70,
        reason: ''
      }]
    }));

    setCustomSuperpower({ name: '', emoji: '' });
    setShowCustomSuperpowerForm(false);
    toast.success('Кастомная суперсила добавлена! ✨');
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCopyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast.success('Ссылка скопирована в буфер обмена! 🔗');
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-white">Создай инвайт карту</h1>
        <p className="text-white/70 text-base leading-relaxed max-w-sm mx-auto">
          Твои оценки создадут основу карты ценности твоего друга
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="flex flex-col items-center space-y-5">
        <div className="relative">
          {newUser.avatar ? (
            <div className="relative">
              <img
                src={newUser.avatar}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-3 border-purple-400/50 shadow-lg"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  // Освобождаем память от URL объекта
                  if (newUser.avatar.startsWith('blob:')) {
                    URL.revokeObjectURL(newUser.avatar);
                  }
                  setNewUser(prev => ({ ...prev, avatar: '' }));
                  // КРИТИЧЕСКИ ВАЖНО: Сбрасываем input, чтобы можно было выбрать тот же файл снова
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md"
              >
                <X size={14} />
              </Button>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/15 border-3 border-purple-400/30 flex items-center justify-center shadow-lg">
              <Camera className="h-9 w-9 text-purple-300" />
            </div>
          )}
        </div>
        
        {/* Скрытый input для загрузки файлов */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <Button
          variant="outline"
          onClick={handleSelectPhoto}
          className="border-purple-400/30 hover:border-purple-400/50 text-white hover:text-white bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl"
        >
          <Camera className="h-4 w-4 mr-2" />
          {newUser.avatar ? 'Изменить фото' : 'Выбрать фото'}
        </Button>
      </div>

      {/* Basic Info Form */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-white font-medium">Как зовут? *</Label>
          <Input
            id="name"
            placeholder="Имя Фамилия"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="contact" className="text-white font-medium">Контакт для подтверждения *</Label>
          <div className="flex gap-3">
            <div className="flex rounded-xl overflow-hidden border border-white/20">
              <Button
                type="button"
                variant={newUser.contactType === 'telegram' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setNewUser(prev => ({ ...prev, contactType: 'telegram' }))}
                className={`h-12 px-4 rounded-none border-0 ${
                  newUser.contactType === 'telegram' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                <svg className="w-7 h-7" viewBox="0 0 240 240" fill="currentColor">
                  <path d="M93.832 128.544c-3.84-1.536-7.68-3.072-11.52-4.608 27.648-11.52 55.296-23.04 82.944-34.56 9.216-3.84 18.432-7.68 27.648-11.52.768-.768.768-2.304 0-3.072-1.536 0-3.072.768-4.608 1.536-30.72 12.288-61.44 24.576-92.16 36.864-4.608 1.536-9.216 3.072-13.824 4.608-.768.768-.768 2.304 0 3.072 3.84 1.536 7.68 3.072 11.52 4.608z"/>
                  <path d="M32.064 96c1.536-1.536 3.84-2.304 6.144-2.304 66.048-27.648 132.096-55.296 198.144-82.944C242.496 8.448 248.64 8.448 254.784 10.752c2.304 0 4.608 1.536 6.144 3.072 1.536 1.536 2.304 3.84 2.304 6.144-.768 3.84-1.536 7.68-2.304 11.52L240 192c-1.536 11.52-6.144 22.272-13.824 30.72-3.84 4.608-9.216 7.68-15.36 9.216-6.144 1.536-12.288.768-17.664-2.304-12.288-6.912-24.576-13.824-36.864-20.736-23.04-12.288-46.08-24.576-69.12-36.864-3.84-1.536-6.912-4.608-8.448-8.448-.768-3.072 0-6.144 2.304-8.448 15.36-16.128 30.72-32.256 46.08-48.384 3.072-3.072 6.144-6.144 9.216-9.216 1.536-1.536 1.536-3.84 0-5.376-1.536-1.536-3.84-1.536-5.376 0-2.304 2.304-4.608 4.608-6.912 6.912-20.736 20.736-41.472 41.472-62.208 62.208-3.84 3.84-8.448 6.912-13.824 8.448-5.376 1.536-11.52 1.536-16.896-.768-18.432-6.144-36.864-12.288-55.296-18.432-3.84-1.536-6.912-4.608-8.448-8.448C21.312 103.68 25.152 98.304 32.064 96z"/>
                </svg>
              </Button>
              <Button
                type="button"
                variant={newUser.contactType === 'email' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setNewUser(prev => ({ ...prev, contactType: 'email' }))}
                className={`h-12 px-4 rounded-none border-0 ${
                  newUser.contactType === 'email' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                <Mail className="h-6 w-6" />
              </Button>
            </div>
            <Input
              id="contact"
              placeholder={newUser.contactType === 'telegram' ? '@username или username' : 'email@example.com'}
              value={newUser.contact}
              onChange={(e) => setNewUser(prev => ({ ...prev, contact: e.target.value }))}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl"
            />
          </div>
          <p className="text-sm text-white/60 mt-2 leading-relaxed">
            {newUser.contactType === 'telegram' 
              ? 'Telegram username для отправки ссылки (автоматически добавится @)' 
              : 'Email для отправки ссылки на карту ценности'
            }
          </p>
        </div>
      </div>

      <Button 
        onClick={handleBasicInfoNext}
        className="w-full bg-purple-600 hover:bg-purple-700 h-12 rounded-xl font-medium text-base mt-8"
        disabled={!newUser.name.trim() || !newUser.contact.trim()}
      >
        Далее: Выбрать суперсилы
        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
      </Button>
    </div>
  );

  const renderSuperpowers = () => {
    // Рекомендуемое количество суперсил для хорошей карты
    const minSuperpowers = 3;
    const recommendedSuperpowers = 5;
    const selectedCount = newUser.selectedSuperpowers.length;
    
    // Определяем цвет и сообщение прогресса
    const getProgressColor = () => {
      if (selectedCount === 0) return 'text-white/50';
      if (selectedCount < minSuperpowers) return 'text-orange-400';
      if (selectedCount < recommendedSuperpowers) return 'text-yellow-400';
      return 'text-emerald-400';
    };
    
    const getProgressMessage = () => {
      if (selectedCount === 0) return 'Выбери хотя бы 3 суперсилы';
      if (selectedCount < minSuperpowers) return `Ещё ${minSuperpowers - selectedCount} до минимума`;
      if (selectedCount < recommendedSuperpowers) return `Супер! Можешь добавить ещё ${recommendedSuperpowers - selectedCount}`;
      return 'Отлично! Карта готова 🎉';
    };
    
    return (
      <div className="relative">
        {/* STICKY HEADER с прогрессом - ВСЕГДА ВИДИМ СВЕРХУ */}
        <div className="sticky top-0 z-40 -mx-4 px-4 pt-4 pb-4 mb-6 bg-gradient-to-b from-[#1a1b23] via-[#1a1b23] to-[#1a1b23]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-white mb-2">Какие суперсилы у {newUser.name}?</h1>
            
            {/* Индикатор прогресса */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 shadow-lg shadow-purple-500/20">
              <div className="flex items-center gap-2">
                {[...Array(recommendedSuperpowers)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i < selectedCount 
                        ? 'bg-purple-400 scale-125 shadow-lg shadow-purple-400/50' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="h-5 w-px bg-white/30" />
              <span className={`text-base font-bold ${getProgressColor()}`}>
                {selectedCount}/{recommendedSuperpowers}
              </span>
            </div>
            
            {/* Сообщение о прогрессе */}
            <p className={`text-base font-medium ${getProgressColor()} transition-colors duration-300`}>
              {getProgressMessage()}
            </p>
          </div>
        </div>
        
        {/* Контент с отступом для sticky header */}
        <div className="space-y-6">

      {/* Selected Superpowers */}
      {newUser.selectedSuperpowers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Выбранные суперсилы ({newUser.selectedSuperpowers.length})</h3>
          <div className="space-y-3">
            {newUser.selectedSuperpowers.map((sp, index) => (
              <motion.div
                key={sp.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-4 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sp.emoji}</span>
                    <div>
                      <h4 className="font-medium text-white">{sp.name}</h4>
                      <p className="text-sm text-white/60">Оценка: {sp.estimatedValue}%</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveSuperpower(sp.name)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Estimated Value Slider */}
                <div className="mb-3">
                  <Label className="text-sm text-white/80">Уровень (по вашему мнению)</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={sp.estimatedValue}
                      onChange={(e) => handleUpdateSuperpower(sp.name, 'estimatedValue', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-white font-medium w-10">{sp.estimatedValue}%</span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <Label className="text-sm text-white/80">Почему ты так считаешь? (необязательно)</Label>
                  <Textarea
                    placeholder="Например: 'Всегда находит креативные решения в сложных ситуациях'"
                    value={sp.reason}
                    onChange={(e) => handleUpdateSuperpower(sp.name, 'reason', e.target.value)}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none h-16"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Superpowers by Categories */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Доступные суперсилы</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const allCategories = Object.keys(categorizedSuperpowers);
              const allExpanded = allCategories.every(cat => expandedCategories[cat]);
              const newState = allCategories.reduce((acc, cat) => ({
                ...acc,
                [cat]: !allExpanded
              }), {});
              setExpandedCategories(newState);
            }}
            className="text-white/60 hover:text-white text-xs"
          >
            {Object.values(expandedCategories).some(Boolean) ? 'Свернуть все' : 'Раскрыть все'}
          </Button>
        </div>

        {/* Custom Superpower Form */}
        {showCustomSuperpowerForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">Создать свою суперсилу</h4>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowCustomSuperpowerForm(false);
                  setCustomSuperpower({ name: '', emoji: '' });
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-sm text-white/80">Название суперсилы</Label>
                <Input
                  placeholder="Например: Графический дизайн"
                  value={customSuperpower.name}
                  onChange={(e) => setCustomSuperpower(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div>
                <Label className="text-sm text-white/80">Эмодзи</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="🎨"
                    value={customSuperpower.emoji}
                    onChange={(e) => setCustomSuperpower(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-16 bg-white/10 border-white/20 text-white text-center"
                    maxLength={2}
                  />
                  <div className="flex gap-1 flex-wrap">
                    {['🎨', '💡', '🚀', '💎', '🔥', '⚡', '🌟', '✨'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCustomSuperpower(prev => ({ ...prev, emoji }))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomSuperpowerForm(false);
                  setCustomSuperpower({ name: '', emoji: '' });
                }}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Отмена
              </Button>
              <Button
                size="sm"
                onClick={handleAddCustomSuperpower}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!customSuperpower.name.trim() || !customSuperpower.emoji.trim()}
              >
                Добавить
              </Button>
            </div>
          </motion.div>
        )}

        {/* Categorized Superpowers - Accordion Style */}
        <div className="space-y-3">
          {Object.entries(categorizedSuperpowers).map(([category, categoryData]) => {
            const availableInCategory = categoryData.superpowers.filter(
              sp => !newUser.selectedSuperpowers.find(selected => selected.name === sp.name)
            );
            
            if (availableInCategory.length === 0) return null;
            
            const isExpanded = expandedCategories[category];
            
            return (
              <div key={category} className="glass-card rounded-xl overflow-hidden">
                {/* Category Header */}
                <motion.button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-center justify-between group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.split(' ')[0]}</span>
                    <div>
                      <h4 className="font-medium text-white group-hover:text-purple-200 transition-colors">
                        {categoryData.description}
                      </h4>
                      <p className="text-sm text-white/60 mt-0.5">
                        {category.split(' ').slice(1).join(' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                      {availableInCategory.length}
                    </Badge>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.button>

                {/* Category Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {availableInCategory.map((sp) => (
                            <motion.button
                              key={sp.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddSuperpower(sp)}
                              className="bg-white/10 p-3 rounded-lg text-left hover:bg-white/15 transition-all duration-200 group border border-transparent hover:border-purple-400/30"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg group-hover:scale-110 transition-transform">{sp.emoji}</span>
                                <span className="text-white text-sm font-medium truncate">{sp.name}</span>
                                <Plus className="h-3 w-3 text-purple-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        
        {/* Кнопка добавить свою суперсилу - ЯРКАЯ И ЗАМЕТНАЯ */}
        <div className="pt-4">
          <Button
            size="default"
            onClick={() => setShowCustomSuperpowerForm(true)}
            className="w-full relative overflow-hidden group transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white border-none shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-pink-500/60 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="h-5 w-5 mr-2 relative z-10 drop-shadow-glow" />
            <span className="relative z-10 font-semibold">Добавить свою суперсилу</span>
          </Button>
        </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={() => setStep('basic')}
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          Назад
        </Button>
        <Button 
          onClick={() => setStep('preview')}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          disabled={newUser.selectedSuperpowers.length < 3}
        >
          Предпросмотр карты
        </Button>
      </div>
    </div>
  );
};

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Предпросмотр карты ценности</h1>
        <p className="text-white/70">Так увидит свою карту {newUser.name}</p>
      </div>

      {/* Value Map Preview */}
      <Card className="glass-card p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            {newUser.avatar ? (
              <img
                src={newUser.avatar}
                alt={newUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-400/50 mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/15 border-2 border-purple-400/30 flex items-center justify-center mx-auto">
                <span className="text-2xl">👤</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white">{newUser.name}</h2>
            <p className="text-purple-300">Карта ценности от вашего друга</p>
          </div>
        </div>

        {/* Superpowers */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white text-center">Ваши суперсилы</h3>
          <div className="space-y-3">
            {newUser.selectedSuperpowers.map((sp) => (
              <div key={sp.name} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sp.emoji}</span>
                    <span className="font-medium text-white">{sp.name}</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    {sp.estimatedValue}%
                  </Badge>
                </div>
                {sp.reason && (
                  <p className="text-sm text-white/70 italic ml-8">"{sp.reason}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Примечание для создателя карты */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm italic">
            💡 {newUser.name} увидит кнопку "Присоединиться к Bliq" после получения ссылки
          </p>
        </div>
      </Card>

      {/* Invite Link */}
      {createdLink ? (
        <Card className="glass-card p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="font-medium text-white">Ссылка на карту ценности</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={createdLink}
                readOnly
                className="bg-white/10 border-white/20 text-white"
              />
              <Button
                size="icon"
                onClick={handleCopyLink}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-white/60">
              Отправьте эту ссылку по контакту: <span className="text-purple-300">{newUser.contact}</span>
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setStep('superpowers')}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Редактировать
          </Button>
          <Button 
            onClick={handleCreateInvite}
            disabled={isCreatingLink}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isCreatingLink ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Создаём карту...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Создать инвайт
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-5 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10 -ml-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step === 'basic' ? 'bg-purple-400 ring-2 ring-purple-400/30' : 'bg-white/30'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step === 'superpowers' ? 'bg-purple-400 ring-2 ring-purple-400/30' : 'bg-white/30'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step === 'preview' ? 'bg-purple-400 ring-2 ring-purple-400/30' : 'bg-white/30'
            }`} />
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {step === 'basic' && renderBasicInfo()}
            {step === 'superpowers' && renderSuperpowers()}
            {step === 'preview' && renderPreview()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}