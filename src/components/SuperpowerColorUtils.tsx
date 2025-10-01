// Единые цветовые утилиты для всех компонентов суперсил

/**
 * Получает цвет прогресса на основе уровня энергии
 * Логика: изумрудно-зеленый → зеленый → желто-оранжевый → оранжево-красный → буро-красный
 * Более точная градация для реалистичного отображения энергии
 * Используем простые цвета для лучшей видимости в узких прогресс-барах
 */
export const getProgressColor = (energyLevel: number): string => {
  if (energyLevel >= 95) return 'bg-emerald-400'; // Пиковая энергия - изумрудный
  if (energyLevel >= 85) return 'bg-green-500'; // Высокая энергия - зелёный
  if (energyLevel >= 70) return 'bg-lime-400'; // Хорошая энергия - лайм
  if (energyLevel >= 55) return 'bg-yellow-400'; // Средняя энергия - жёлтый
  if (energyLevel >= 40) return 'bg-orange-400'; // Пониженная энергия - оранжевый  
  if (energyLevel >= 25) return 'bg-red-400'; // Низкая энергия - красный
  return 'bg-red-700'; // Критически низкая энергия - тёмно-красный (буро-красный)
};

/**
 * Получает текстовый цвет на основе уровня энергии
 * Соответствует цветам прогресса, но для текста
 */
export const getProgressTextColor = (energyLevel: number): string => {
  if (energyLevel >= 95) return 'text-emerald-400'; // Пиковая энергия - изумрудный
  if (energyLevel >= 85) return 'text-green-500'; // Высокая энергия - зелёный
  if (energyLevel >= 70) return 'text-lime-400'; // Хорошая энергия - лайм
  if (energyLevel >= 55) return 'text-yellow-400'; // Средняя энергия - жёлтый
  if (energyLevel >= 40) return 'text-orange-400'; // Пониженная энергия - оранжевый  
  if (energyLevel >= 25) return 'text-red-400'; // Низкая энергия - красный
  return 'text-red-700'; // Критически низкая энергия - тёмно-красный (буро-красный)
};

/**
 * Получает фоновый градиент карточки на основе индекса
 */
export const getBackgroundGradient = (index: number): string => {
  const gradients = [
    'bg-gradient-to-br from-orange-500/10 to-red-500/5',  // Креативность
    'bg-gradient-to-br from-pink-500/10 to-purple-500/5', // Контент-маркетинг
    'bg-gradient-to-br from-cyan-400/10 to-blue-500/5',   // Общение
    'bg-gradient-to-br from-emerald-400/10 to-green-500/5', // Дополнительный
    'bg-gradient-to-br from-purple-500/10 to-pink-500/5',   // Дополнительный
    'bg-gradient-to-br from-yellow-400/10 to-orange-400/5', // Дополнительный
  ];
  return gradients[index % gradients.length] || 'bg-gradient-to-br from-green-400/10 to-emerald-500/5';
};

/**
 * Получает цветовую индикацию для тренда суперсилы
 */
export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return 'text-emerald-400';
    case 'down': return 'text-red-400'; 
    case 'stable': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

/**
 * Получает иконку для тренда суперсилы
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up': return '📈';
    case 'down': return '📉';
    case 'stable': return '➖';
    default: return '➖';
  }
};