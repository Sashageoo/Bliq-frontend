import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, List, Grid3X3 } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { CompactSuperpowerCard } from './CompactSuperpowerCard';

interface MegapowerLibraryItem {
  name: string;
  emoji: string;
  category: string;
  description: string;
  totalUsers: number;
  averageBliks: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  tags: string[];
  isOwn?: boolean;
  ownerName?: string;
}

interface MegapowersLibraryScreenProps {
  superpowers?: Array<{
    name: string;
    emoji: string;
    bliks: number;
    energy: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
    isOwn?: boolean;
    ownerName?: string;
    ownerAvatar?: string;
  }>;
  onSuperpowerDetail: (superpowerName: string) => void;
}

// УБРАЛИ МЕГАСИЛЫ - теперь показываем только персональные суперсилы пользователя
const globalMegapowersLibrary: MegapowerLibraryItem[] = [
  // Массив временно закомментирован, так как мегасилы удалены из системы
  /*
  // 🌊 Flow категория - поток, продуктивность, эффективность
  {
    name: 'Тайм-менеджмент',
    emoji: '⏰',
    category: 'Flow',
    description: 'Эффективное управление временем и способность к максимальной продуктивности.',
    totalUsers: 3456,
    averageBliks: 89,
    trend: 'up',
    trendPercentage: 19,
    difficulty: 'Средне',
    tags: ['время', 'продуктивность', 'планирование', 'эффективность']
  },
  {
    name: 'Адаптивность',
    emoji: '🌊',
    category: 'Flow',
    description: 'Гибкость мышления и способность быстро приспосабливаться к изменениям.',
    totalUsers: 2103,
    averageBliks: 73,
    trend: 'up',
    trendPercentage: 11,
    difficulty: 'Средне',
    tags: ['гибкость', 'изменения', 'адаптация', 'быстрота']
  },
  {
    name: 'Решение проблем',
    emoji: '💪',
    category: 'Flow',
    description: 'Аналитический склад ума и способность находить эффективные решения сложных задач.',
    totalUsers: 1876,
    averageBliks: 87,
    trend: 'down',
    trendPercentage: -8,
    difficulty: 'Средне',
    tags: ['анализ', 'логика', 'решения', 'эффективность']
  },
  {
    name: 'Концентрация',
    emoji: '🎯',
    category: 'Flow',
    description: 'Способность глубоко сосредотачиваться на задачах и достигать состояния потока.',
    totalUsers: 2892,
    averageBliks: 94,
    trend: 'up',
    trendPercentage: 22,
    difficulty: 'Сложно',
    tags: ['фокус', 'внимание', 'поток', 'медитация']
  },

  // 💜 Soul категория - эмоции, отношения, харизма
  {
    name: 'Харизма',
    emoji: '👑',
    category: 'Soul',
    description: 'Магнетическая привлекательность личности, способность вдохновлять и влиять на других.',
    totalUsers: 1923,
    averageBliks: 142,
    trend: 'up',
    trendPercentage: 18,
    difficulty: 'Сложно',
    tags: ['лидерство', 'влияние', 'общение', 'вдохновение']
  },
  {
    name: 'Эмпатия',
    emoji: '💖',
    category: 'Soul',
    description: 'Глубокое понимание эмоций других людей и способность к эмоциональной поддержке.',
    totalUsers: 2634,
    averageBliks: 76,
    trend: 'stable',
    trendPercentage: 1,
    difficulty: 'Средне',
    tags: ['эмоции', 'поддержка', 'понимание', 'сочувствие']
  },
  {
    name: 'Публичные выступления',
    emoji: '🎤',
    category: 'Soul',
    description: 'Мастерство презентации идей и комфортное выступление перед аудиторией.',
    totalUsers: 1234,
    averageBliks: 134,
    trend: 'up',
    trendPercentage: 28,
    difficulty: 'Сложно',
    tags: ['презентации', 'публика', 'речь', 'уверенность']
  },
  {
    name: 'Эмоциональный интеллект',
    emoji: '🧘‍♀️',
    category: 'Soul',
    description: 'Умение управлять своими эмоциями и понимать эмоциональные состояния других.',
    totalUsers: 3021,
    averageBliks: 118,
    trend: 'up',
    trendPercentage: 35,
    difficulty: 'Сложно',
    tags: ['эмоции', 'интеллект', 'самоконтроль', 'осознанность']
  },

  // 🧠 Mind категория - интеллект, креативность, знания
  {
    name: 'Креативность',
    emoji: '💡',
    category: 'Mind',
    description: 'Способность генерировать оригинальные идеи и находить нестандартные решения в любых ситуациях.',
    totalUsers: 2847,
    averageBliks: 156,
    trend: 'up',
    trendPercentage: 23,
    difficulty: 'Средне',
    tags: ['дизайн', 'инновации', 'идеи', 'творчество']
  },
  {
    name: 'Программирование',
    emoji: '💻',
    category: 'Mind',
    description: 'Уникальная суперсила, которая делает вас особенными и помогает достигать новых высот.',
    totalUsers: 3589,
    averageBliks: 156,
    trend: 'up',
    trendPercentage: 10,
    difficulty: 'Сложно',
    tags: ['развитие', 'навык']
  },
  {
    name: 'Аналитическое мышление',
    emoji: '📊',
    category: 'Mind',
    description: 'Способность структурированно анализировать информацию и выявлять закономерности.',
    totalUsers: 2345,
    averageBliks: 132,
    trend: 'up',
    trendPercentage: 14,
    difficulty: 'Сложно',
    tags: ['анализ', 'данные', 'логика', 'исследования']
  },
  {
    name: 'Изучение языков',
    emoji: '🗣️',
    category: 'Mind',
    description: 'Талант к освоению новых языков и культурному взаимопониманию.',
    totalUsers: 1876,
    averageBliks: 98,
    trend: 'stable',
    trendPercentage: 3,
    difficulty: 'Средне',
    tags: ['языки', 'культура', 'общение', 'полиглот']
  },

  // 👥 Crew категория - командная работа, сотрудничество
  {
    name: 'Командная работа',
    emoji: '🤝',
    category: 'Crew',
    description: 'Умение эффективно работать в команде и создавать синергию с коллегами.',
    totalUsers: 1987,
    averageBliks: 68,
    trend: 'up',
    trendPercentage: 15,
    difficulty: 'Легко',
    tags: ['команда', 'сотрудничество', 'синергия', 'коллектив']
  },
  {
    name: 'Лидерство',
    emoji: '⭐',
    category: 'Crew',
    description: 'Умение направлять команду к общей цели, принимать решения и брать ответственность.',
    totalUsers: 1654,
    averageBliks: 128,
    trend: 'stable',
    trendPercentage: 2,
    difficulty: 'Сложно',
    tags: ['команда', 'управление', 'ответственность', 'решения']
  },
  {
    name: 'Наставничество',
    emoji: '👨‍🏫',
    category: 'Crew',
    description: 'Способность обучать других, передавать знания и развивать потенциал команды.',
    totalUsers: 1432,
    averageBliks: 105,
    trend: 'up',
    trendPercentage: 17,
    difficulty: 'Средне',
    tags: ['обучение', 'развитие', 'менторство', 'рост']
  },

  // 💪 Body категория - физические способности, здоровье
  {
    name: 'Спортивная форма',
    emoji: '🏃‍♀️',
    category: 'Body',
    description: 'Отличная физическая подготовка и здоровый образ жизни.',
    totalUsers: 4567,
    averageBliks: 112,
    trend: 'stable',
    trendPercentage: 3,
    difficulty: 'Средне',
    tags: ['спорт', 'здоровье', 'фитнес', 'выносливость']
  },
  {
    name: 'Энергичность',
    emoji: '⚡',
    category: 'Body',
    description: 'Высокий уровень энергии и способность заряжать позитивом окружающих.',
    totalUsers: 2156,
    averageBliks: 95,
    trend: 'up',
    trendPercentage: 12,
    difficulty: 'Легко',
    tags: ['энергия', 'позитив', 'активность', 'мотивация']
  },
  {
    name: 'Танцы',
    emoji: '💃',
    category: 'Body',
    description: 'Способность выражать эмоции через движение и ритм.',
    totalUsers: 1923,
    averageBliks: 134,
    trend: 'up',
    trendPercentage: 25,
    difficulty: 'Средне',
    tags: ['ритм', 'движение', 'координация', 'выражение']
  },

  // 🎨 Style категория - эстетика, мода, визуальное восприятие
  {
    name: 'Крутой стиль',
    emoji: '❄️',
    category: 'Style',
    description: 'Безупречное чувство стиля и эстетики, умение создавать запоминающиеся образы.',
    totalUsers: 3245,
    averageBliks: 119,
    trend: 'down',
    trendPercentage: -5,
    difficulty: 'Легко',
    tags: ['мода', 'эстетика', 'образ', 'стиль']
  },
  {
    name: 'Фотография',
    emoji: '📸',
    category: 'Style',
    description: 'Умение запечатлевать красоту мгновений и создавать визуальные истории.',
    totalUsers: 2756,
    averageBliks: 145,
    trend: 'up',
    trendPercentage: 21,
    difficulty: 'Средне',
    tags: ['искусство', 'кадр', 'композиция', 'творчество']
  },
  {
    name: 'Дизайн',
    emoji: '🎨',
    category: 'Style',
    description: 'Создание функциональных и красивых решений для различных задач.',
    totalUsers: 2134,
    averageBliks: 167,
    trend: 'up',
    trendPercentage: 31,
    difficulty: 'Сложно',
    tags: ['графика', 'UX/UI', 'визуал', 'эстетика']
  },

  // ⚡ Drive категория - мотивация, целеустремленность, достижения
  {
    name: 'Целеустремленность',
    emoji: '🚀',
    category: 'Drive',
    description: 'Непоколебимая воля к достижению поставленных целей любой ценой.',
    totalUsers: 2567,
    averageBliks: 189,
    trend: 'up',
    trendPercentage: 27,
    difficulty: 'Сложно',
    tags: ['цели', 'достижения', 'воля', 'упорство']
  },
  {
    name: 'Мотивация других',
    emoji: '🔥',
    category: 'Drive',
    description: 'Способность вдохновлять окружающих на достижение больших результатов.',
    totalUsers: 1789,
    averageBliks: 156,
    trend: 'up',
    trendPercentage: 33,
    difficulty: 'Сложно',
    tags: ['вдохновение', 'мотивация', 'команда', 'результат']
  },
  {
    name: 'Преодоление препятствий',
    emoji: '🏔️',
    category: 'Drive',
    description: 'Умение не сдаваться перед трудностями и находить способы их преодоления.',
    totalUsers: 2234,
    averageBliks: 143,
    trend: 'stable',
    trendPercentage: 1,
    difficulty: 'Сложно',
    tags: ['препятствия', 'настойчивость', 'решимость', 'стойкость']
  }
  */
];

function MegapowerLibraryCard({ 
  superpower, 
  index, 
  onDetail,
  isUserSuperpower = false,
  ownerName
}: { 
  superpower: MegapowerLibraryItem; 
  index: number;
  onDetail: (name: string) => void;
  isUserSuperpower?: boolean;
  ownerName?: string;
}) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Flow': return 'from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-cyan-400/30';
      case 'Soul': return 'from-purple-500/10 via-pink-500/10 to-rose-500/10 border-purple-400/30';
      case 'Mind': return 'from-blue-500/10 via-purple-500/10 to-violet-500/10 border-blue-400/30';
      case 'Crew': return 'from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-400/30';
      case 'Body': return 'from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-400/30';
      case 'Style': return 'from-pink-500/10 via-rose-500/10 to-orange-500/10 border-pink-400/30';
      case 'Drive': return 'from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-yellow-400/30';
      default: return 'from-gray-500/10 to-gray-600/10 border-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onDetail(superpower.name)}
      className={`
        relative backdrop-blur-xl bg-gradient-to-br ${getCategoryColor(superpower.category)}
        border rounded-lg p-1
        transition-all duration-300
        group cursor-pointer
        overflow-hidden flex flex-col
      `}
      style={{ 
        margin: 0,
        padding: '4px'
      }}
    >
      {/* Glow effect на hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col justify-between" style={{ height: '100%' }}>
        {/* Заголовок с названием */}
        <div className="flex items-center gap-1 flex-1 min-w-0 mb-1">
          <span className="flex-shrink-0">{superpower.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-medium line-clamp-2" style={{ lineHeight: '1.2' }}>
              {superpower.name.replace(' - Ваша', '').replace('Ваша ', '')}
            </h3>
            {/* Имя владельца (если это чужая суперсила) */}
            {isUserSuperpower && ownerName && (
              <div className="text-muted-foreground truncate mt-0.5" style={{ lineHeight: '1.2' }}>
                {ownerName}
              </div>
            )}
          </div>
        </div>

        {/* Только статистика пользователей и бликов */}
        <div className="flex items-center justify-center mt-auto pt-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Users size={8} className="text-blue-400" />
              <span className="text-foreground" style={{ lineHeight: '1' }}>
                {superpower.name === 'Программирование' ? '3.6k' : (superpower.totalUsers > 1000 ? `${Math.round(superpower.totalUsers/1000*10)/10}k` : superpower.totalUsers.toString())}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-yellow-400">⚡</span>
              <span className="text-foreground" style={{ lineHeight: '1' }}>
                {superpower.name === 'Программирование' ? '156' : superpower.averageBliks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type ViewMode = 'галерея' | 'список';

export function MegapowersLibraryScreen({
  superpowers = [],
  onSuperpowerDetail
}: MegapowersLibraryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('Все');
  const [viewMode, setViewMode] = useState<ViewMode>('галерея');

  // Преобразуем переданные суперсилы в формат для отображения
  const convertedSuperpowers: MegapowerLibraryItem[] = superpowers.map(sp => ({
    name: sp.name.replace(' - Ваша', '').replace('Ваша ', ''),
    emoji: sp.emoji,
    category: sp.category,
    description: 'Уникальная суперсила, которая делает вас особенным и помогает достигать новых высот.',
    totalUsers: Math.floor(Math.random() * 3000) + 1000,
    averageBliks: sp.bliks,
    trend: sp.trend,
    trendPercentage: sp.trend === 'up' ? Math.floor(Math.random() * 30) + 5 : 
                    sp.trend === 'down' ? -(Math.floor(Math.random() * 20) + 5) : 
                    Math.floor(Math.random() * 6) - 3,
    difficulty: 'Средне' as 'Легко' | 'Средне' | 'Сложно', // Не используется, но оставляем для совместимости
    tags: ['развитие', 'навык', 'личность', 'рост'],
    isOwn: sp.isOwn,
    ownerName: sp.ownerName
  }));

  // Отображаем только переданные суперсилы пользователя
  const allSuperpowers = [...convertedSuperpowers];

  // Получаем категории с эмодзи согласно дизайну
  const categories = [
    { name: 'Все', emoji: '' },
    { name: 'Mind', emoji: '🧠' },
    { name: 'Soul', emoji: '💜' }, 
    { name: 'Flow', emoji: '🌊' },
    { name: 'Body', emoji: '💪' },
    { name: 'Style', emoji: '🎨' },
    { name: 'Crew', emoji: '👥' },
    { name: 'Drive', emoji: '⚡' }
  ];
  const ownerships = ['Все', 'Мои', 'Других пользователей'];

  // Функции для подсчета друзей с суперсилами
  const getFriendsWithSuperpowerCount = (superpowerName: string) => {
    // Моковые данные о том, у скольких друзей есть каждая суперсила
    const friendsData: Record<string, number> = {
      // Популярные суперсилы среди друзей
      'Программирование': 8,
      'Креативность': 12,
      'Фотография': 6,
      'Лидерство': 5,
      'Харизма': 7,
      'Командная работа': 9,
      'Решение проблем': 11,
      'Энергичность': 14,
      'Эмоциональный интеллект': 4,
      'Публичные выступления': 3,
      'Тайм-менеджмент': 10,
      'Адаптивность': 8,
      'Концентрация': 6,
      'Эмпатия': 9,
      'Аналитическое мышление': 7,
      'Изучение языков': 5,
      'Наставничество': 4,
      'Спортивная форма': 13,
      'Танцы': 7,
      'Крутой стиль': 11,
      'Дизайн': 8,
      'Целеустремленность': 6,
      'Мотивация других': 5,
      'Преодоление препятствий': 7,
      'Кулинария': 9,
      'Музыка': 6,
      // Для остальных суперсил случайные значения от 2 до 15
      default: Math.floor(Math.random() * 14) + 2
    };
    
    return friendsData[superpowerName] || friendsData.default;
  };

  const getFriendsCountColor = (count: number) => {
    if (count >= 10) return 'text-green-400 bg-green-500/20'; // Много друзей
    if (count >= 6) return 'text-blue-400 bg-blue-500/20';    // Средне популярно
    if (count >= 3) return 'text-yellow-400 bg-yellow-500/20'; // Мало друзей
    return 'text-gray-400 bg-gray-500/20';                     // Очень редко
  };

  // Функция для получения цветов категорий
  const getCategoryColors = (category: string) => {
    const categoryStyles: Record<string, { 
      gradient: string; 
      border: string; 
      badge: string;
      icon: string;
    }> = {
      'Flow': {
        gradient: 'from-cyan-500/10 via-blue-500/10 to-indigo-500/10',
        border: 'border-cyan-400/30',
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40',
        icon: '🌊'
      },
      'Soul': {
        gradient: 'from-purple-500/10 via-pink-500/10 to-rose-500/10',
        border: 'border-purple-400/30',
        badge: 'bg-purple-500/20 text-purple-400 border-purple-400/40',
        icon: '💜'
      },
      'Mind': {
        gradient: 'from-blue-500/10 via-purple-500/10 to-violet-500/10',
        border: 'border-blue-400/30',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-400/40',
        icon: '🧠'
      },
      'Crew': {
        gradient: 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
        border: 'border-green-400/30',
        badge: 'bg-green-500/20 text-green-400 border-green-400/40',
        icon: '👭'
      },
      'Body': {
        gradient: 'from-orange-500/10 via-red-500/10 to-pink-500/10',
        border: 'border-orange-400/30',
        badge: 'bg-orange-500/20 text-orange-400 border-orange-400/40',
        icon: '💪'
      },
      'Style': {
        gradient: 'from-pink-500/10 via-rose-500/10 to-orange-500/10',
        border: 'border-pink-400/30',
        badge: 'bg-pink-500/20 text-pink-400 border-pink-400/40',
        icon: '🎨'
      },
      'Drive': {
        gradient: 'from-yellow-500/10 via-amber-500/10 to-orange-500/10',
        border: 'border-yellow-400/30',
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/40',
        icon: '⚡'
      }
    };

    return categoryStyles[category] || {
      gradient: 'from-gray-500/10 to-gray-600/10',
      border: 'border-gray-400/30',
      badge: 'bg-gray-500/20 text-gray-400 border-gray-400/40',
      icon: '🔸'
    };
  };

  // Фильтруем суперсилы
  const filteredSuperpowers = allSuperpowers.filter(sp => {
    const matchesSearch = sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (sp.tags && sp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'Все' || sp.category === selectedCategory;
    
    let matchesOwnership = true;
    if (selectedOwnership === 'Мои') {
      matchesOwnership = (sp as any).isOwn !== false;
    } else if (selectedOwnership === 'Других пользователей') {
      matchesOwnership = (sp as any).isOwn === false;
    }
    
    return matchesSearch && matchesCategory && matchesOwnership;
  });

  // Функция для отображения суперсил в разных режимах
  const renderSuperpowersView = () => {
    const superpowersData = filteredSuperpowers.map((superpower, index) => {
      const isOwn = (superpower as any).isOwn;
      const ownerName = (superpower as any).ownerName;
      const uniqueKey = isOwn 
        ? `personal-${superpower.name}-${ownerName || 'unknown'}` 
        : `mega-${superpower.name}-${index}`;
      
      return { superpower, index, uniqueKey, isOwn, ownerName };
    });

    switch (viewMode) {
      case 'галерея':
        return (
          <div className="superpowers-grid mb-16 min-h-[800px]">
            {superpowersData.map(({ superpower, index, uniqueKey, ownerName }) => (
              <CompactSuperpowerCard
                key={uniqueKey}
                name={superpower.name}
                emoji={superpower.emoji}
                value={superpower.averageBliks}
                index={index}
                trend={superpower.trend}
                onClick={() => onSuperpowerDetail(superpower.name)}
                // 🎯 РЕЖИМ БИБЛИОТЕКИ - показываем статистику
                mode="library"
                totalUsers={superpower.totalUsers}
                totalBliks={superpower.averageBliks * superpower.totalUsers}
              />
            ))}
          </div>
        );

      case 'список':
        return (
          <div className="space-y-2 mb-16 min-h-[800px]">
            {superpowersData.map(({ superpower, uniqueKey }) => {
              const categoryColors = getCategoryColors(superpower.category);
              return (
                <motion.div
                  key={uniqueKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onSuperpowerDetail(superpower.name)}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 bg-gradient-to-r ${categoryColors.gradient} ${categoryColors.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>{superpower.emoji}</span>
                      <div>
                        <h3 className="text-foreground font-medium" style={{ lineHeight: '1.2' }}>{superpower.name}</h3>
                        <p className="text-muted-foreground" style={{ lineHeight: '1.3' }}>{superpower.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-foreground font-medium" style={{ lineHeight: '1.2' }}>👭 {getFriendsWithSuperpowerCount(superpower.name)}</div>
                        <div className="text-muted-foreground" style={{ lineHeight: '1.2' }}>у друзей</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-foreground font-bold" style={{ lineHeight: '1.2' }}>
                          <span className="text-yellow-400">⚡</span>
                          {superpower.averageBliks}
                        </div>
                        <div className="text-muted-foreground" style={{ lineHeight: '1.2' }}>блики</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Статус-бар (фиксированный) */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl">
        <StatusBar />
      </div>

      {/* Прокручиваемый контент */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-24 max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="pt-8 pb-4 mb-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-foreground font-semibold mb-1 flex items-center gap-2"
              style={{ lineHeight: '1.2' }}
            >
              <BookOpen size={24} />
              Суперсилы
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
              style={{ lineHeight: '1.3' }}
            >
              Коллективные силы сообщества
            </motion.p>
          </div>

          {/* Компактная статистика */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between p-3 glass-card rounded-xl mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-bold text-foreground" style={{ lineHeight: '1.2' }}>
                  {Math.round(allSuperpowers.reduce((sum, sp) => sum + sp.totalUsers, 0) / 1000)}k
                </div>
                <div className="text-muted-foreground" style={{ lineHeight: '1.2' }}>активных</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground" style={{ lineHeight: '1.2' }}>{filteredSuperpowers.length}</div>
                <div className="text-muted-foreground" style={{ lineHeight: '1.2' }}>найдено</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Компактный селектор владения */}
              <select
                value={selectedOwnership}
                onChange={(e) => setSelectedOwnership(e.target.value)}
                className="bg-input border border-border rounded-lg px-3 py-1.5 text-foreground focus:border-primary focus:outline-none"
              >
                {ownerships.map((ownership) => (
                  <option key={ownership} value={ownership}>
                    {ownership}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Поиск */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-4"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск суперсил..."
                className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Горизонтальные чипсы категорий */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-4"
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5
                    transition-all duration-300
                    ${selectedCategory === category.name
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                    }
                  `}
                >
                  {category.emoji && <span>{category.emoji}</span>}
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Компактные настройки вида (только иконки) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="flex items-center justify-end mb-6"
          >
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {[
                { mode: 'галерея' as ViewMode, icon: Grid3X3, label: 'Галерея - компактные карточки' },
                { mode: 'список' as ViewMode, icon: List, label: 'Список - построчно' }
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  title={label}
                  className={`
                    p-2 rounded-md transition-all duration-300
                    ${viewMode === mode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white energy-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Адаптивное отображение суперсил в зависимости от режима */}
          {renderSuperpowersView()}
          
          <div className="mb-16"></div>

          {/* Пустое состояние */}
          {filteredSuperpowers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-32 min-h-[400px]"
            >
              <div className="mb-4">🔍</div>
              <h3 className="text-foreground font-semibold mb-2">
                Суперсилы не найдены
              </h3>  
              <p className="text-muted-foreground max-w-sm mx-auto">
                Попробуйте изменить поисковый запрос или фильтры
              </p>
            </motion.div>
          )}
          
          {/* Дополнительный контент для обеспечения прокрутки */}
          <div className="h-32"></div>
        </div>
      </div>
    </div>
  );
}