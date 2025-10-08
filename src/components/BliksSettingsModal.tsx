import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Zap, Users, Check } from 'lucide-react';

interface BliksSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BliksAutoSettings;
  onSave: (settings: BliksAutoSettings) => void;
  friends: Array<{ id: string; name: string; avatar: string }>;
  userSuperpowers: Array<{ name: string; emoji: string }>;
}

export interface BliksAutoSettings {
  autoAcceptFromFriends: string[]; // ID избранных друзей
  autoDeclineFromBlocked: string[]; // ID заблокированных
  autoAcceptSuperpowers: string[]; // Названия суперсил для автопринятия
  requireApproval: boolean; // Требовать подтверждение для всех
}

export function BliksSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  friends,
  userSuperpowers
}: BliksSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<BliksAutoSettings>(settings);
  const [activeTab, setActiveTab] = useState<'friends' | 'superpowers' | 'privacy'>('friends');

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const toggleFriend = (friendId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      autoAcceptFromFriends: prev.autoAcceptFromFriends.includes(friendId)
        ? prev.autoAcceptFromFriends.filter(id => id !== friendId)
        : [...prev.autoAcceptFromFriends, friendId]
    }));
  };

  const toggleSuperpower = (superpowerName: string) => {
    setLocalSettings(prev => ({
      ...prev,
      autoAcceptSuperpowers: prev.autoAcceptSuperpowers.includes(superpowerName)
        ? prev.autoAcceptSuperpowers.filter(name => name !== superpowerName)
        : [...prev.autoAcceptSuperpowers, superpowerName]
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="relative w-full max-w-2xl max-h-[90vh] m-4 rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col"
        >
          {/* Шапка */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center energy-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Настройки бликов</h2>
                <p className="text-sm text-white/60">Автоматические правила и приватность</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Вкладки */}
          <div className="px-6 pt-4 flex gap-2 border-b border-white/10">
            {[
              { id: 'friends' as const, label: 'Друзья', icon: Users },
              { id: 'superpowers' as const, label: 'Суперсилы', icon: Zap },
              { id: 'privacy' as const, label: 'Приватность', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-t-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-b-2 border-purple-500'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Контент */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Вкладка: Друзья */}
            {activeTab === 'friends' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Автоматически принимать от избранных
                  </h3>
                  <p className="text-sm text-white/60">
                    Блики от этих друзей будут приниматься автоматически без подтверждения
                  </p>
                </div>

                <div className="space-y-2">
                  {friends.map((friend) => {
                    const isSelected = localSettings.autoAcceptFromFriends.includes(friend.id);
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleFriend(friend.id)}
                        className={`w-full p-4 rounded-xl transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="flex-1 text-left font-medium text-white">
                          {friend.name}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Вкладка: Суперсилы */}
            {activeTab === 'superpowers' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Автоматически принимать по суперсилам
                  </h3>
                  <p className="text-sm text-white/60">
                    Всегда принимать блики, связанные с этими суперсилами
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {userSuperpowers.map((superpower) => {
                    const isSelected = localSettings.autoAcceptSuperpowers.includes(superpower.name);
                    return (
                      <button
                        key={superpower.name}
                        onClick={() => toggleSuperpower(superpower.name)}
                        className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <span className="text-3xl">{superpower.emoji}</span>
                        <span className="text-sm font-medium text-white text-center">
                          {superpower.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Вкладка: Приватность */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Контроль приватности
                  </h3>
                  <p className="text-sm text-white/60">
                    Управляй тем, кто может отправлять тебе блики
                  </p>
                </div>

                <button
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    requireApproval: !prev.requireApproval
                  }))}
                  className={`w-full p-4 rounded-xl transition-all flex items-center gap-3 ${
                    localSettings.requireApproval
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    localSettings.requireApproval
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-white/20'
                  }`}>
                    {localSettings.requireApproval && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">Требовать подтверждение для всех</p>
                    <p className="text-sm text-white/60">
                      Даже от избранных друзей и по выбранным суперсилам
                    </p>
                  </div>
                </button>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-200">
                    💡 Совет: Автоматическое принятие помогает быстрее наращивать энергию суперсил, 
                    но ты всегда можешь вручную управлять бликами в разделе "Отклоненные"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-6 border-t border-white/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
            >
              Отменить
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold energy-glow"
            >
              Сохранить
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
