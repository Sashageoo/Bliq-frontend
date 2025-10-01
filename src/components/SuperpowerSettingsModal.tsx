import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, EyeOff, Users, Lock, Globe, Shield, UserCheck, Ban } from 'lucide-react';

interface SuperpowerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  superpowerName: string;
  superpowerEmoji: string;
  currentSettings?: {
    isVisible: boolean;
    whoCanBlik: 'everyone' | 'friends' | 'nobody';
    blockedUsers: string[];
  };
  onSave: (settings: {
    isVisible: boolean;
    whoCanBlik: 'everyone' | 'friends' | 'nobody';
    blockedUsers: string[];
  }) => void;
}

export function SuperpowerSettingsModal({
  isOpen,
  onClose,
  superpowerName,
  superpowerEmoji,
  currentSettings,
  onSave
}: SuperpowerSettingsModalProps) {
  // Добавляем значения по умолчанию на случай, если currentSettings приходит как undefined
  const defaultSettings = {
    isVisible: true,
    whoCanBlik: 'everyone' as 'everyone' | 'friends' | 'nobody',
    blockedUsers: [] as string[]
  };
  
  const settings = currentSettings || defaultSettings;
  
  const [isVisible, setIsVisible] = useState(settings.isVisible);
  const [whoCanBlik, setWhoCanBlik] = useState(settings.whoCanBlik);
  const [blockedUsers, setBlockedUsers] = useState(settings.blockedUsers);
  const [newBlockedUser, setNewBlockedUser] = useState('');

  // Список пользователей для примера
  const suggestedUsers = [
    { id: '1', name: 'Иван Петров', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: '2', name: 'Анна Сидорова', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { id: '3', name: 'Михаил Кузнецов', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  ];

  const handleSave = () => {
    onSave({
      isVisible,
      whoCanBlik,
      blockedUsers
    });
    onClose();
  };

  const addBlockedUser = (userId: string) => {
    if (!blockedUsers.includes(userId)) {
      setBlockedUsers([...blockedUsers, userId]);
    }
  };

  const removeBlockedUser = (userId: string) => {
    setBlockedUsers(blockedUsers.filter(id => id !== userId));
  };

  const whoCanBlikOptions = [
    {
      value: 'everyone' as const,
      label: 'Все пользователи',
      description: 'Любой может бликовать эту суперсилу',
      icon: Globe
    },
    {
      value: 'friends' as const,
      label: 'Только друзья',
      description: 'Только ваши друзья могут бликовать',
      icon: UserCheck
    },
    {
      value: 'nobody' as const,
      label: 'Никто',
      description: 'Отключить возможность бликования',
      icon: Lock
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50"
          >
            <div className="relative">
              {/* Внешний градиент */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-2xl blur-sm" />
              
              <div className="relative backdrop-blur-2xl glass-card rounded-2xl p-6 max-h-[80vh] overflow-y-auto scrollbar-hide">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 flex items-center justify-center text-2xl">
                      {superpowerEmoji}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Настройки суперсилы</h2>
                      <p className="text-white/60 text-sm">{superpowerName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Настройка видимости */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <EyeOff size={20} className="text-purple-400" />
                    <h3 className="text-lg font-medium text-white">Видимость суперсилы</h3>
                  </div>
                  
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 rounded-xl glass-card hover:scale-[1.02] cursor-pointer transition-all duration-200"
                  >
                    <div>
                      <div className="text-white font-medium">Скрыть суперсилу</div>
                      <div className="text-white/60 text-sm">Суперсила будет видна только вам</div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={!isVisible}
                        onChange={(e) => setIsVisible(!e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        !isVisible 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-white/20'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-200 transform ${
                          !isVisible ? 'translate-x-6' : 'translate-x-0.5'
                        } translate-y-0.5`} />
                      </div>
                    </div>
                  </motion.label>
                </div>

                {/* Настройка доступа */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Users size={20} className="text-orange-400" />
                    <h3 className="text-lg font-medium text-white">Кто может бликовать</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {whoCanBlikOptions.map((option) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          whoCanBlik === option.value
                            ? 'glass-card energy-glow border-purple-500/50'
                            : 'glass-card hover:scale-[1.02]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="whoCanBlik"
                          value={option.value}
                          checked={whoCanBlik === option.value}
                          onChange={(e) => setWhoCanBlik(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          whoCanBlik === option.value
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-white/40'
                        }`}>
                          {whoCanBlik === option.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <option.icon size={20} className="text-white/60" />
                        <div className="flex-1">
                          <div className="text-white font-medium">{option.label}</div>
                          <div className="text-white/60 text-sm">{option.description}</div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Заблокированные пользователи */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Ban size={20} className="text-red-400" />
                    <h3 className="text-lg font-medium text-white">Заблокированные пользователи</h3>
                  </div>
                  
                  {/* Добавление пользователя в чёрный список */}
                  <div className="mb-4">
                    <div className="text-white/80 text-sm mb-2">Добавить в чёрный список:</div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedUsers
                        .filter(user => !blockedUsers.includes(user.id))
                        .map((user) => (
                          <motion.button
                            key={user.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addBlockedUser(user.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-white/80 hover:text-white text-sm hover:scale-105 transition-all duration-200"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full"
                            />
                            {user.name}
                          </motion.button>
                        ))}
                    </div>
                  </div>

                  {/* Список заблокированных */}
                  {blockedUsers.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-white/80 text-sm">Заблокированные пользователи:</div>
                      {blockedUsers.map((userId) => {
                        const user = suggestedUsers.find(u => u.id === userId);
                        if (!user) return null;
                        
                        return (
                          <motion.div
                            key={userId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 rounded-lg backdrop-blur-xl bg-red-500/10 border border-red-500/30"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="text-white font-medium">{user.name}</div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeBlockedUser(userId)}
                              className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300"
                            >
                              <X size={16} />
                            </motion.button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white font-medium"
                  >
                    Отменить
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg"
                  >
                    Сохранить
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}