import React, { useState, useMemo, useCallback } from 'react';
import { OnboardingWelcomeScreen } from './components/OnboardingWelcomeScreen';
import { OnboardingAuthScreen } from './components/OnboardingAuthScreen';
import { OnboardingProfileTypeScreen } from './components/OnboardingProfileTypeScreen';
import { OnboardingSuperpowersExplainScreen } from './components/OnboardingSuperpowersExplainScreen';
import { OnboardingBliksExplainScreen } from './components/OnboardingBliksExplainScreen';
import { OnboardingValueMapExplainScreen } from './components/OnboardingValueMapExplainScreen';
import { OnboardingSetupScreen } from './components/OnboardingSetupScreen';
import { OnboardingBusinessSetupScreen } from './components/OnboardingBusinessSetupScreen';
import { OnboardingCompleteScreen } from './components/OnboardingCompleteScreen';
import { OnboardingDebugPanel } from './components/OnboardingDebugPanel';
import { ProfileScreen } from './components/ProfileScreen';
import { MegapowersLibraryScreen } from './components/SuperpowersLibraryScreen';
import { SuperpowerHubScreen } from './components/SuperpowerHubScreen';
import { TopScreen } from './components/TopScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BliksScreen } from './components/BliksScreen';
import { FeedScreen } from './components/FeedScreen';
import { CameraCreateScreen } from './components/CameraCreateScreen';
import { IncomingBliksScreen } from './components/IncomingBliksScreen';
import { BliksSettingsModal } from './components/BliksSettingsModal';
import { BlikDetailScreen } from './components/BlikDetailScreen';
import { OtherUserProfileScreen } from './components/OtherUserProfileScreen';
import { FriendsScreen } from './components/FriendsScreen';
import { ValueMapScreen } from './components/ValueMapScreen';
import { BusinessValueMapScreen } from './components/BusinessValueMapScreen';
import { PersonalSiteScreen } from './components/PersonalSiteScreen';
import { CreateValueMapScreen } from './components/CreateValueMapScreen';
import { NotificationsScreen, Notification } from './components/NotificationsScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { AppBackground } from './components/AppBackground';
import { Sidebar } from './components/Sidebar';
import { AboutBliqModal } from './components/AboutBliqModal';
import { SearchModal } from './components/SearchModal';
// ThemeProvider больше не нужен - только темная тема
import { BlikData } from './components/BlikCard';
import { toast } from 'sonner@2.0.3';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';
import tsekh85Logo from 'figma:asset/f264197d0dfa11757e4a661e9aace4fad7102f83.png';

// Объявляем unsplash_tool как доступную функцию
declare function unsplash_tool(query: string): Promise<string>;

// Профессиональные аватарки для целевой аудитории
const mariaAvatarImage = 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvbWFuJTIwcGhvdG9ncmFwaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTg5fDA&ixlib=rb-4.1.0&q=80&w=400';
const alexeyAvatarImage = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA0MDE2Nnww&ixlib=rb-4.1.0&q=80&w=400';

// Типы профилей
type ProfileType = 'personal' | 'business';

// Бизнес-интерпретация 7 категорий суперсил
const BUSINESS_SUPERPOWER_CATEGORIES = {
  'Flow': { 
    name: 'Flow', 
    emoji: '🌊', 
    businessName: 'Операционная эффективность',
    description: 'Процессы, операционное управление, оптимизация workflow'
  },
  'Soul': { 
    name: 'Soul', 
    emoji: '💜', 
    businessName: 'Брендинг и ценности',
    description: 'Корпоративная культура, миссия, ценности, ESR'
  },
  'Mind': { 
    name: 'Mind', 
    emoji: '🧠', 
    businessName: 'Инновации и стратегия',
    description: 'R&D, стратегическое планирование, технологические решения'
  },
  'Crew': { 
    name: 'Crew', 
    emoji: '👥', 
    businessName: 'Команда и культура',
    description: 'HR, корпоративная культура, teambuilding, управление персоналом'
  },
  'Body': { 
    name: 'Body', 
    emoji: '💪', 
    businessName: 'Финансовая мощь',
    description: 'Финансовые показатели, рост, масштабирование, устойчивость'
  },
  'Style': { 
    name: 'Style', 
    emoji: '🎨', 
    businessName: 'Дизайн и UX',
    description: 'Продуктовый дизайн, пользовательский опыт, визуальная айдентика'
  },
  'Drive': { 
    name: 'Drive', 
    emoji: '⚡', 
    businessName: 'Маркетинг и продажи',
    description: 'Продвижение, продажи, клиентская база, экспансия'
  }
};

// Функция для маппинга персональных суперсил на бизнес-категории
const mapPersonalSuperpowerToBusiness = (personalName: string, emoji: string): { category: string; businessName: string; businessDescription: string } => {
  // Маппинг на основе смысла и контекста суперсилы
  const businessMapping: Record<string, { category: string; businessName: string; businessDescription: string }> = {
    // Flow - Операционная эффективность
    'Программирование': { category: 'Flow', businessName: 'Технологическая экспертиза', businessDescription: 'Разработка и внедрение передовых технологических решений' },
    'Решение проблем': { category: 'Flow', businessName: 'Операционная оптимизация', businessDescription: 'Эффективное решение бизнес-задач и процессная оптимизация' },
    'Тайм-менеджмент': { category: 'Flow', businessName: 'Процессное управление', businessDescription: 'Оптимизация рабочих процессов и управление временными ресурсами' },
    'Концентрация': { category: 'Flow', businessName: 'Фокус на результатах', businessDescription: 'Концентрация на ключевых бизнес-целях и их достижении' },
    
    // Soul - Брендинг и ценности
    'Харизма': { category: 'Soul', businessName: 'Корпоративная харизма', businessDescription: 'Привлекательность бренда и способность вдохновлять аудиторию' },
    'Эмоциональная поддержка': { category: 'Soul', businessName: 'Забота о клиентах', businessDescription: 'Глубокое понимание потребностей клиентов и эмоциональная связь' },
    'Межличностное общение': { category: 'Soul', businessName: 'Коммуникационная культура', businessDescription: 'Открытое и честное общение со всеми стейкхолдерами' },
    
    // Mind - Инновации и стратегия  
    'Креативность': { category: 'Mind', businessName: 'Инновационное мышление', businessDescription: 'Создание прорывных продуктов и нестандартных решений' },
    'Аналитическое мышление': { category: 'Mind', businessName: 'Стратегическая аналитика', businessDescription: 'Глубокий анализ рынка и принятие обоснованных решений' },
    'Планирование': { category: 'Mind', businessName: 'Стратегическое планирование', businessDescription: 'Долгосрочное видение и построение стратегии развития' },
    
    // Crew - Команда и культура
    'Лидерство': { category: 'Crew', businessName: 'Командное лидерство', businessDescription: 'Создание высокоэффективных команд и мотивация сотрудников' },
    'Командная работа': { category: 'Crew', businessName: 'Корпоративная культура', businessDescription: 'Формирование сплоченного коллектива и здоровой рабочей атмосферы' },
    'Наставничество': { category: 'Crew', businessName: 'Развитие персонала', businessDescription: 'Обучение и профессиональное развитие команды' },
    'Публичные выступления': { category: 'Crew', businessName: 'Внутренние коммуникации', businessDescription: 'Эффективное общение с командой и презентация идей' },
    
    // Body - Финансовая мощь
    'Энергичность': { category: 'Body', businessName: 'Рост и масштабирование', businessDescription: 'Динамичное развитие бизнеса и экспансия на новые рынки' },
    'Выносливость': { category: 'Body', businessName: 'Устойчивость бизнеса', businessDescription: 'Способность преодолевать кризисы и поддерживать стабильность' },
    'Занятия спортом': { category: 'Body', businessName: 'Корпоративное здоровье', businessDescription: 'Здоровая корпоративная культура и забота о команде' },
    
    // Style - Дизайн и UX
    'Крутой стиль': { category: 'Style', businessName: 'Визуальная айдентика', businessDescription: 'Узнаваемый фирменный стиль и эстетика бренда' },
    'Дизайн': { category: 'Style', businessName: 'Продуктовый дизайн', businessDescription: 'Создание интуитивно понятных и красивых продуктов' },
    'Фотография': { category: 'Style', businessName: 'Визуальный контент', businessDescription: 'Создание качественного визуального контента для маркетинга' },
    'UX/UI дизайн': { category: 'Style', businessName: 'Пользовательский опыт', businessDescription: 'Проектирование превосходного опыта взаимодействия с продуктом' },
    
    // Drive - Маркетинг и продажи
    'Контент-маркетинг': { category: 'Drive', businessName: 'Маркетинговая стратегия', businessDescription: 'Привлечение и удержание клиентов через качественный контент' },
    'Продажи': { category: 'Drive', businessName: 'Продажи и конверсия', businessDescription: 'Эффективные продажи и увеличение прибыли' },
    'Сетевое общение': { category: 'Drive', businessName: 'Деловые связи', businessDescription: 'Построение партнерских отношений и расширение сети контактов' },
    'Маркетинг': { category: 'Drive', businessName: 'Продвижение бренда', businessDescription: 'Эффективное продвижение продукта и увеличение узнаваемости' }
  };

  // Если есть прямое соответствие, используем его
  if (businessMapping[personalName]) {
    return businessMapping[personalName];
  }

  // Иначе определяем категорию по ключевым словам
  const lowercaseName = personalName.toLowerCase();
  
  if (lowercaseName.includes('программ') || lowercaseName.includes('технич') || lowercaseName.includes('код') || lowercaseName.includes('разработ')) {
    return { category: 'Flow', businessName: 'Технологическая экспертиза', businessDescription: 'Внедрение инновационных технологических решений в бизнес-процессы' };
  }
  
  if (lowercaseName.includes('харизм') || lowercaseName.includes('общен') || lowercaseName.includes('коммуникац')) {
    return { category: 'Soul', businessName: 'Коммуникационная сила', businessDescription: 'Способность вдохновлять и выстраивать крепкие отношения с клиентами' };
  }
  
  if (lowercaseName.includes('креатив') || lowercaseName.includes('иннова') || lowercaseName.includes('стратег')) {
    return { category: 'Mind', businessName: 'Инновационное мышление', businessDescription: 'Разработка креативных решений и стратегическое планирование' };
  }
  
  if (lowercaseName.includes('лидер') || lowercaseName.includes('команд') || lowercaseName.includes('управлен')) {
    return { category: 'Crew', businessName: 'Командное лидерство', businessDescription: 'Создание эффективных команд и управление человеческими ресурсами' };
  }
  
  if (lowercaseName.includes('энерг') || lowercaseName.includes('выносл') || lowercaseName.includes('сил')) {
    return { category: 'Body', businessName: 'Энергия роста', businessDescription: 'Динамичное развитие и устойчивость к нагрузкам' };
  }
  
  if (lowercaseName.includes('дизайн') || lowercaseName.includes('стиль') || lowercaseName.includes('красот') || lowercaseName.includes('эстетик')) {
    return { category: 'Style', businessName: 'Эстетика бренда', businessDescription: 'Создание привлекательного образа компании и продукта' };
  }
  
  if (lowercaseName.includes('маркетинг') || lowercaseName.includes('продаж') || lowercaseName.includes('промо') || lowercaseName.includes('реклам')) {
    return { category: 'Drive', businessName: 'Рыночная экспансия', businessDescription: 'Агрессивное продвижение и ��ахват новых рынков' };
  }

  // По умолчанию относим к Flow
  return { 
    category: 'Flow', 
    businessName: personalName, 
    businessDescription: `Применение навыка "${personalName}" для оптимизации бизнес-процессов` 
  };
};

// Move large static data outside component to prevent recreation
const INITIAL_USER_DATA = {
  name: 'Risha Bliq',
  profileType: 'personal' as ProfileType,
  status: 'Creative Designer & Digital Innovator',
  location: 'Москва, Россия',
  email: 'risha@bliq.app',
  phone: '+7 (999) 123-45-67',
  bio: 'Создаю вдохновляющие продукты и помогаю людям раскрывать свои суперсилы. Верю в силу креативнос��и и ��ехнологий для позитивных изменений.',
  website: 'https://risha.bliq.app',
  birthDate: '1995-06-15',
  occupation: 'Creative Designer & Product Manager',
  interests: ['Дизайн', 'Технологии', 'Креативность', 'Саморазвитие', 'Фотография'],
  socialLinks: {
    instagram: '@risha.bliq',
    twitter: '@rishabliq',
    linkedin: 'https://linkedin.com/in/rishabliq',
    github: 'https://github.com/rishabliq'
  },
  privacy: {
    showEmail: true,
    showPhone: false,
    showBirthDate: false,
    allowFriendRequests: true,
    showOnlineStatus: true
  },
  backgroundImage: 'https://images.unsplash.com/photo-1646038572815-43fe759e459b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080', // 💜 Чистый фиолетовый градиент как в ленте
  avatarImage: avatarImage,
  isOnline: true,
  metrics: {
    bliks: 234,
    friends: 67,
    superpowers: 9
  },
  topSuperpowers: [
    { name: 'Креативность', emoji: '💡', value: 85, energy: 89 },
    { name: 'Контент-маркетинг', emoji: '📱', value: 78, energy: 82 },
    { name: 'Межличностное общение', emoji: '💬', value: 72, energy: 75 },
    { name: 'Харизма', emoji: '👑', value: 69, energy: 78 },
    { name: 'Крутой стиль', emoji: '❄️', value: 76, energy: 71 },
    { name: 'Лидерство', emoji: '⭐', value: 65, energy: 68 },
    { name: 'Энергичность', emoji: '⚡', value: 82, energy: 85 },
    { name: 'Решение проблем', emoji: '💪', value: 74, energy: 77 },
    { name: 'Командная работа', emoji: '🤝', value: 68, energy: 72 }
  ]
};

type Screen = 'onboarding-welcome' | 'onboarding-auth' | 'onboarding-profile-type' | 'onboarding-superpowers-explain' | 'onboarding-bliks-explain' | 'onboarding-value-map-explain' | 'onboarding-setup' | 'onboarding-business-setup' | 'onboarding-complete' | 'profile' | 'value-map' | 'library' | 'top' | 'detail' | 'settings' | 'bliks' | 'feed' | 'create' | 'incoming-bliks' | 'blik-detail' | 'other-profile' | 'friends' | 'notifications' | 'personal-site' | 'create-value-map';
type NavigationTab = 'feed' | 'top' | 'create' | 'bliks' | 'profile';

// Тип для других пользователей
interface OtherUser {
  id: string;
  name: string;
  status: string;
  location: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  isOnline: boolean;
  profileType?: ProfileType; // Добавляем тип профиля
  businessInfo?: {
    companyName: string;
    industry: string;
    founded: string;
    employees: string;
    revenue: string;
    description: string;
    website?: string;
    phone?: string;
    email?: string;
    verified: boolean;
    verificationDate: string | null;
    verificationDocuments: any[];
    brandHeader?: string; // Брендированная шапка для бизнес-профилей
  };
  metrics: {
    bliks: number;
    friends: number;
    superpowers: number;
  };
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding-welcome');
  const [activeTab, setActiveTab] = useState<NavigationTab>('feed');
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [selectedSuperpower, setSelectedSuperpower] = useState<string | null>(null);
  const [selectedBlik, setSelectedBlik] = useState<BlikData | null>(null);
  const [selectedOtherUser, setSelectedOtherUser] = useState<OtherUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutBliqOpen, setIsAboutBliqOpen] = useState(false);
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType>('personal');

  // Функция для поиска изображений через Unsplash
  const searchUnsplashImage = async (query: string): Promise<string> => {
    try {
      console.log('App.tsx: Searching for image with query:', query);
      
      // Проверяем доступность функции unsplash_tool
      if (typeof unsplash_tool !== 'function') {
        throw new Error('unsplash_tool function is not available');
      }
      
      // Используем реальный unsplash_tool напрямую
      const result = await unsplash_tool(query);
      console.log('App.tsx: Image search result:', result);
      
      if (!result || !result.startsWith('http')) {
        throw new Error('Invalid image URL returned from unsplash_tool');
      }
      
      return result;
    } catch (error) {
      console.error('App.tsx: Error in searchUnsplashImage:', error);
      throw error;
    }
  };
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 🔔 СИСТЕМА УВЕДОМЛЕНИЙ
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: '1',
      type: 'blik',
      title: 'Новый блик от Алексей К.',
      message: 'Невероятный дизайн интерфейса! Твоя креативность просто зашкаливает 🎨✨',
      avatar: alexeyAvatarImage,
      timestamp: '2 часа назад',
      isRead: false,
      userId: 'alexey-korneev',
      blikId: '1',
      superpowerName: 'Креативность'
    },
    {
      id: '2',
      type: 'like',
      title: 'Мария С. оценила твой блик',
      message: 'Лайк за твой блик о лидерстве',
      avatar: mariaAvatarImage,
      timestamp: '5 часов назад',
      isRead: false,
      userId: 'maria-smirnova',
      blikId: '7'
    },
    {
      id: '3',
      type: 'comment',
      title: 'Новый комментарий от Игорь В.',
      message: 'Просто невероятно! 🔥',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      timestamp: '8 часов назад',
      isRead: true,
      userId: 'igor-volkov',
      blikId: '1'
    },
    {
      id: '4',
      type: 'superpower',
      title: 'Рост суперсилы!',
      message: 'Твоя суперсила "Креативность" выросла до 78 баллов! 🚀',
      avatar: INITIAL_USER_DATA.avatarImage,
      timestamp: '1 день назад',
      isRead: true,
      superpowerName: 'Креативность'
    },
    {
      id: '5',
      type: 'friend',
      title: 'Анна Петрова добавила тебя в друзья',
      message: 'Теперь вы можете обмениваться бликами!',
      avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?w=100&h=100&fit=crop&crop=face',
      timestamp: '2 дня назад',
      isRead: true,
      userId: 'anna-petrova'
    },
    {
      id: '6',
      type: 'achievement',
      title: 'Новое достижение разблокировано!',
      message: '🏆 "Вдохновитель" - Получено 50 лайков на блики',
      avatar: INITIAL_USER_DATA.avatarImage,
      timestamp: '3 дня назад',
      isRead: true
    }
  ]);

  // Глобальные горячие клавиши для поиска
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K для открытия поиска
      if ((event.ctrlKey || event.metaKey) && event.key === 'k' && isOnboardingCompleted) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingCompleted]);

  // Оптимизированные данные пользователя
  const [user, setUser] = useState(INITIAL_USER_DATA);

  // 🎯 ЧЕТКОЕ РАЗДЕЛЕНИЕ: Персональные суперсилы пользователей
  const [userSuperpowers, setUserSuperpowers] = useState(() => {
    const userName = INITIAL_USER_DATA.name;
    const userAvatar = INITIAL_USER_DATA.avatarImage;
    
    return INITIAL_USER_DATA.topSuperpowers.map(sp => ({
      id: `user-${sp.name}`,
      name: sp.name,
      emoji: sp.emoji,
      bliks: sp.value,
      energy: sp.energy,
      trend: sp.energy > 80 ? 'up' as const : sp.energy < 40 ? 'down' as const : 'stable' as const,
      category: sp.emoji === '🧠' || sp.emoji === '❄️' ? 'Mind' : 
                sp.emoji === '📱' ? 'Drive' : // Контент-маркетинг -> Drive категория
                sp.emoji === '👑' || sp.emoji === '💖' || sp.emoji === '💬' ? 'Soul' : 
                sp.emoji === '💪' || sp.emoji === '🏃‍♀️' || sp.emoji === '⚡' ? 'Body' : 
                sp.emoji === '🤝' || sp.emoji === '⭐' || sp.emoji === '🎤' ? 'Crew' : 'Flow',
      type: 'personal' as const,
      ownerName: userName,
      ownerAvatar: userAvatar
    }));
  });

  // УБИРАЕМ МЕГАСИЛЫ - они усложняют логику и создают путаницу

  // 🏢 БИЗНЕС-СУПЕРСИЛЫ: Для бизнес-профилей (отдельная система)
  const [businessSuperpowers, setBusinessSuperpowers] = useState(() => [
    {
      id: 'biz-ai-innovation',
      name: 'Искусственный интеллект',
      emoji: '🤖',
      bliks: 342,
      energy: 96,
      trend: 'up' as const,
      category: 'Mind',
      type: 'business' as const,
      businessCategory: 'Инновации и стратегия',
      description: 'Внедрение передовых AI-решений для автоматизации бизнес-процессов и создания инновационных продуктов.',
      companyId: 'neotech-solutions',
      companyName: 'NeoTech Solutions'
    },
    {
      id: 'biz-artisan-baking',
      name: 'Мастерство пекарей',
      emoji: '👨‍🍳',
      bliks: 287,
      energy: 98,
      trend: 'up' as const,
      category: 'Body',
      type: 'business' as const,
      businessCategory: 'Качество продукции',
      description: 'Традиционное мастерство выпечки, передаваемое из поколения в поколение, с использованием лучших ингредиентов.',
      companyId: 'tsekh85-bakery',
      companyName: 'Цех85'
    }
  ]);

  // Блики других пользователей для их профилей
  const otherUsersBliks: Record<string, BlikData[]> = {
    'dmitry-kozlov': [
      {
        id: 'dmitry-1',
        type: 'photo' as const,
        content: 'Потрясающий трек! Твоё чувство ритма и мелодии просто невероятно 🎵',
        mediaUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHByb2R1Y2VyfGVufDF8fHx8MTc1ODM1NjgzNXww&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Мария С.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Дмитрий Козлов',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Музыка',
          emoji: '🎵'
        },
        timestamp: '2 часа назад',
        likes: 18,
        comments: 5,
        isLiked: false
      },
      {
        id: 'dmitry-2',
        type: 'text' as const,
        content: 'Спасибо за поддержку и понимание! Твоя эмоциональная отзывчивость помогла мне пережить сложный период 💖',
        author: {
          name: 'Елена Р.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Дмитрий Козлов',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Эмоциональная поддержка',
          emoji: '💖'
        },
        timestamp: '5 часов назад',
        likes: 24,
        comments: 8,
        isLiked: true
      },
      {
        id: 'dmitry-sent-1',
        type: 'photo' as const,
        content: 'Твоя творческая энергия заразительна! Каждый проект с тобой - это новое вдохновение ✨',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY3JlYXRpdml0eXxlbnwxfHx8fDE3NTgzNTY4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Дмитрий Козлов',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Анна Петрова',
          avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Креативность',
          emoji: '💡'
        },
        timestamp: '1 день назад',
        likes: 15,
        comments: 3,
        isLiked: false
      }
    ],
    'alexey-korneev': [
      {
        id: 'alexey-1',
        type: 'video' as const,
        content: 'Невероятный код! Твоё мастерство программирования впечатляет всю команду 💻',
        mediaUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZ3xlbnwxfHx8fDE3NTgzNTY4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Игорь В.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Алексей Корнеев',
          avatar: alexeyAvatarImage
        },
        superpower: {
          name: 'Программирование',
          emoji: '💻'
        },
        timestamp: '3 часа назад',
        likes: 32,
        comments: 12,
        isLiked: true
      },
      {
        id: 'alexey-sent-1',
        type: 'text' as const,
        content: 'Восхищаюсь твоим подходом к решению сложных задач! Ты настоящий мастер своего дела 💪',
        author: {
          name: 'Алексей Корнеев',
          avatar: alexeyAvatarImage,
          isOnline: true
        },
        recipient: {
          name: 'Мария Смирнова',
          avatar: mariaAvatarImage
        },
        superpower: {
          name: 'Решение проблем',
          emoji: '💪'
        },
        timestamp: '6 часов назад',
        likes: 19,
        comments: 6,
        isLiked: false
      }
    ],
    'maria-smirnova': [
      {
        id: 'maria-1',
        type: 'photo' as const,
        content: 'Потрясающие кадры! Твой взгляд на мир через объектив просто волшебный 📸',
        mediaUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYXxlbnwxfHx8fDE3NTgzNTY4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Дмитрий К.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Мария Смирнова',
          avatar: mariaAvatarImage
        },
        superpower: {
          name: 'Фотография',
          emoji: '📸'
        },
        timestamp: '4 часа назад',
        likes: 28,
        comments: 9,
        isLiked: true
      },
      {
        id: 'maria-sent-1',
        type: 'video' as const,
        content: 'Твоя креатив��ость в каждом проекте просто завораживает! Продолжай ��дохновлять нас 🎨',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY3JlYXRpdml0eXxlbnwxfHx8fDE3NTgzNTY4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Мария Смирнова',
          avatar: mariaAvatarImage,
          isOnline: false
        },
        recipient: {
          name: 'Елена Рыбакова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Креативность',
          emoji: '🎨'
        },
        timestamp: '1 день назад',
        likes: 22,
        comments: 7,
        isLiked: false
      }
    ],
    'igor-volkov': [
      {
        id: 'igor-1',
        type: 'photo' as const,
        content: 'Невероятное блюдо! Твое мастерство на кухне превосходит все ожидания 👨‍🍳',
        mediaUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZ3xlbnwxfHx8fDE3NTgzNTY4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Ал���ксей К.',
          avatar: alexeyAvatarImage,
          isOnline: true
        },
        recipient: {
          name: 'Игорь Волков',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Кулинария',
          emoji: '👨‍🍳'
        },
        timestamp: '1 час назад',
        likes: 35,
        comments: 14,
        isLiked: true
      },
      {
        id: 'igor-sent-1',
        type: 'text' as const,
        content: 'Работать в команде с тобой - настоящее удовольствие! Твоя способность нахо��ить общий язык с каждым поражает 🤝',
        author: {
          name: 'Игорь Волков',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Дмитрий Козлов',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Команд��ая работа',
          emoji: '🤝'
        },
        timestamp: '8 часов назад',
        likes: 16,
        comments: 4,
        isLiked: false
      }
    ],
    'elena-rybakova': [
      {
        id: 'elena-1',
        type: 'video' as const,
        content: 'Твоя энергия на танцполе просто зашкаливает! Каждое движение - это искусство 💃',
        mediaUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHN0dWRpb3xlbnwxfHx8fDE3NTgzNTY4NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        author: {
          name: 'Мария С.',
          avatar: mariaAvatarImage,
          isOnline: false
        },
        recipient: {
          name: 'Елена Рыбакова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Танцы',
          emoji: '💃'
        },
        timestamp: '2 часа назад',
        likes: 42,
        comments: 18,
        isLiked: true
      },
      {
        id: 'elena-2',
        type: 'text' as const,
        content: 'Твоя харизма и обаяние покоряют всех вокруг! Ты настоящая звезда 👑',
        author: {
          name: 'Игорь В.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Елена Рыбакова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        },
        superpower: {
          name: 'Харизма',
          emoji: '👑'
        },
        timestamp: '6 часов назад',
        likes: 31,
        comments: 11,
        isLiked: false
      }
    ],

    // БЛИКИ ПЕКАРНИ ЦЕХ85 - О БУЛОЧКАХ И ВЫПЕЧКЕ
    'tsekh85-bakery': [
      {
        id: 'tsekh85-1',
        type: 'photo' as const,
        content: 'Невероятные круассаны с миндалем! Каждый слой теста создан с мастерством настоящих артизанов выпечки 🥐✨',
        mediaUrl: 'https://images.unsplash.com/photo-1654923064797-26af6b093027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNyb2lzc2FudHMlMjBwYXN0cnl8ZW58MXx8fHwxNzU5MTg2NzExfDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 5, // Оценка от автора (1-5 звезд)
        author: {
          name: 'Анна М.',
          avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRlc2lnbmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTAyMDEyfDA&ixlib=rb-4.1.0&q=80&w=400',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Мастерство пекарей',
          emoji: '👨‍🍳'
        },
        timestamp: '1 час назад',
        likes: 47,
        comments: 18,
        isLiked: true,
        likedBy: [
          { name: 'Maria Smirnova', avatar: mariaAvatarImage },
          { name: 'Alexey Korneev', avatar: alexeyAvatarImage },
          { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-2',
        type: 'photo' as const,
        content: 'Авторские булочки с корицей - это произведение искусства! Рецепт передается из поколения в поколение 🌟',
        mediaUrl: 'https://images.unsplash.com/photo-1650626105236-2e3b1f933fa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHJvbGxzJTIwYmFrZXJ5fGVufDF8fHx8MTc1OTEzMTIyMXww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 5,
        author: {
          name: 'Михаил П.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Семейные традиции',
          emoji: '💜'
        },
        timestamp: '2 часа назад',
        likes: 52,
        comments: 23,
        isLiked: false,
        likedBy: [
          { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
          { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-3',
        type: 'text' as const,
        content: 'Потрясающий сервис! Каждое утро покупаю свежий хлеб - качество всегда на высоте. Команда Цех85 действительно заботится о каждом клиенте! 💜',
        rating: 5,
        author: {
          name: 'Екатерина Л.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Клиентский сервис',
          emoji: '⚡'
        },
        timestamp: '3 часа назад',
        likes: 34,
        comments: 12,
        isLiked: true,
        likedBy: [
          { name: 'Dmitry Kozlov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
          { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-4',
        type: 'photo' as const,
        content: 'Свежесть этого хлеба просто невероятна! Чувствуется, что выпечен с душой и любовью. Цех85 - лучшая пекарня в городе! 🍞',
        mediaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        rating: 5,
        author: {
          name: 'Владимир С.',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Свежесть продукции',
          emoji: '🌟'
        },
        timestamp: '4 часа назад',
        likes: 41,
        comments: 16,
        isLiked: false,
        likedBy: [
          { name: 'Maria Smirnova', avatar: mariaAvatarImage },
          { name: 'Maxim Stellar', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-5',
        type: 'photo' as const,
        content: 'Эти пончики - настоящее произведение искусства! Визуальная подача на уровне лучших кондитерских Европы 🎨✨',
        mediaUrl: 'https://images.unsplash.com/photo-1581845446212-892ef36faec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBhc3RyaWVzJTIwZG9udXRzfGVufDF8fHx8MTc1OTEzMTIxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 5,
        author: {
          name: 'София К.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Авторская подача выпечки',
          emoji: '🎨'
        },
        timestamp: '5 часов назад',
        likes: 39,
        comments: 14,
        isLiked: true,
        likedBy: [
          { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' },
          { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-6',
        type: 'video' as const,
        content: 'Увидел процесс выпечки - это настоящее искусство! Каждый этап продуман до мелочей. Профессионализм команды восхищает! 🌊',
        mediaUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        author: {
          name: 'Дмитрий Р.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Производственный процесс',
          emoji: '🌊'
        },
        timestamp: '6 часов назад',
        likes: 28,
        comments: 9,
        isLiked: false,
        likedBy: [
          { name: 'Alexey Korneev', avatar: alexeyAvatarImage },
          { name: 'Sergey Volkov', avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-7',
        type: 'photo' as const,
        content: 'Шоколадные круассаны просто тают во рту! Качество ингредиентов чувствуется в каждом кусочке 💪✨',
        mediaUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        rating: 4,
        author: {
          name: 'Ирина Т.',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Качество ингредиентов',
          emoji: '💪'
        },
        timestamp: '1 день назад',
        likes: 45,
        comments: 19,
        isLiked: true,
        likedBy: [
          { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          { name: 'Maria Smirnova', avatar: mariaAvatarImage },
          { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-8',
        type: 'text' as const,
        content: 'Заказывали корпоративный кейтеринг - организация была безупречной! Команда учла все наши пожелания и превзошла ожидания 👥',
        author: {
          name: 'Алексей М.',
          avatar: alexeyAvatarImage,
          isOnline: false
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Профессиональная команда',
          emoji: '👥'
        },
        timestamp: '1 день назад',
        likes: 31,
        comments: 11,
        isLiked: false,
        likedBy: [
          { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
          { name: 'Dmitry Kozlov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-9',
        type: 'photo' as const,
        content: 'Артизанский хлеб на закваске - это шедев��! Чувствуется инновационный подход к традиционным рецептам 🧠💡',
        mediaUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        rating: 5,
        author: {
          name: 'Петр Н.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Авторские рецепты',
          emoji: '🧠'
        },
        timestamp: '2 дня назад',
        likes: 37,
        comments: 15,
        isLiked: true,
        likedBy: [
          { name: 'Maxim Stellar', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
          { name: 'Olga Marinova', avatar: 'https://images.unsplash.com/photo-1756588534346-e8899364757b?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-10',
        type: 'video' as const,
        content: 'Визуальная эстетика витрины просто завораживает! Каждый продукт выложен как в лучших европейских пекарнях 📸🎨',
        mediaUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        author: {
          name: 'Марина Ф.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          isOnline: false
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Визуальная эстетика',
          emoji: '📸'
        },
        timestamp: '2 дня назад',
        likes: 43,
        comments: 17,
        isLiked: false,
        likedBy: [
          { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' },
          { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          { name: 'Maria Smirnova', avatar: mariaAvatarImage }
        ]
      },
      {
        id: 'tsekh85-11',
        type: 'text' as const,
        content: 'Управление поставками здесь на высшем уровне! Всегда свежие ингредиенты, никогда не было проблем с качеством. Логистика работает как часы! 📦',
        author: {
          name: 'Станислав Г.',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Управление поставками',
          emoji: '📦'
        },
        timestamp: '3 дня назад',
        likes: 26,
        comments: 8,
        isLiked: true,
        likedBy: [
          { name: 'Sergey Volkov', avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?w=100&h=100&fit=crop&crop=face' },
          { name: 'Ruslan Kovalev', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face' }
        ]
      },
      {
        id: 'tsekh85-12',
        type: 'photo' as const,
        content: 'Забота о клиентах чувствуется в каждой детали! Даже упаковка сделана с любовью. Цех85 - это не просто пекарня, это семья! ❤️💜',
        mediaUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        rating: 5,
        author: {
          name: 'Наталья В.',
          avatar: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=100&h=100&fit=crop&crop=face',
          isOnline: true
        },
        recipient: {
          name: 'Цех85',
          avatar: tsekh85Logo
        },
        superpower: {
          name: 'Забота о клиентах',
          emoji: '❤️'
        },
        timestamp: '3 дня назад',
        likes: 58,
        comments: 24,
        isLiked: true,
        likedBy: [
          { name: 'Maria Smirnova', avatar: mariaAvatarImage },
          { name: 'Alexey Korneev', avatar: alexeyAvatarImage },
          { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' }
        ]
      }
    ]
  };

  // Оптимизированные данные для бликов - меньше для быстрой загрузки
  const [receivedBliks, setReceivedBliks] = useState(() => [
    {
      id: '1',
      type: 'photo' as const,
      content: 'Невероятный дизайн интерфейса! Твоя креативность просто зашкаливает 🎨✨',
      mediaUrl: 'https://images.unsplash.com/photo-1510832758362-af875829efcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTgzNDE5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Алексей К.',
        avatar: alexeyAvatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Креативность',
        emoji: '💡'
      },
      timestamp: '2 часа назад',
      likes: 24,
      comments: 8,
      isLiked: true,
      likedBy: [
        { name: 'Sean Martinez', avatar: alexeyAvatarImage },
        { name: 'John Cooper', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Anna Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '1',
          author: { name: 'Maria Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          content: 'Просто невероятно! 🔥',
          timestamp: '1h'
        },
        {
          id: '2',
          author: { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
          content: 'Да, согласен! Очень вдохновляет ✨',
          timestamp: '45m'
        }
      ]
    },
    {
      id: '2',
      type: 'video' as const,
      content: 'Потрясающая презентация! Твоя харизма и умение подавать материал - это просто магия 🌟',
      mediaUrl: 'https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4Mjg0MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Мария С.',
        avatar: mariaAvatarImage,
        isOnline: false
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Харизма',
        emoji: '👑'
      },
      timestamp: '5 часов назад',
      likes: 18,
      comments: 12,
      isLiked: false,
      likedBy: [
        { name: 'Maria Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'David Smith', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    {
      id: '3',
      type: 'text' as const,
      content: 'Спасибо за твою поддержку в сложный момент. Твоя эмоциональная чуткость и умение найти правильные слова помогли мне справиться с трудностями. Ты дей��твительно особенный человек! 💖',
      author: {
        name: 'Артем В.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Эмоциональная поддержка',
        emoji: '💖'
      },
      timestamp: '1 день назад',
      likes: 31,
      comments: 6,
      isLiked: true,
      likedBy: [
        { name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
        { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
        { name: 'Sofia Brown', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
        { name: 'Mike Davis', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '3',
          author: { name: 'Tom Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
          content: 'Спасибо за поддержку! 🙏💖',
          timestamp: '2h'
        }
      ]
    },
    {
      id: '4',
      type: 'photo' as const,
      content: 'Твой стиль всегда на высоте! Каждый образ продуман до мелочей ❄️',
      mediaUrl: 'https://images.unsplash.com/photo-1718964313270-d00053a7607b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgzNTY4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Елена Р.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Крутой стиль',
        emoji: '❄️'
      },
      timestamp: '2 дня назад',
      likes: 45,
      comments: 15,
      isLiked: false,
      likedBy: [
        { name: 'Jessica White', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'Ryan Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
        { name: 'Emma Taylor', avatar: 'https://images.unsplash.com/photo-1592334873219-42ca023e48ce?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    {
      id: '5',
      type: 'video' as const,
      content: 'Как ты мотивируешь команду - это просто восхитительно! Настоящий лидер 💪',
      mediaUrl: 'https://images.unsplash.com/photo-1554902748-feaf536fc594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbGVhZGVyc2hpcCUyMG9mZmljZXxlbnwxfHx8fDE3NTgzNTY4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Дмитрий К.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        isOnline: false
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Лидерство',
        emoji: '⭐'
      },
      timestamp: '3 дня назад',
      likes: 22,
      comments: 9,
      isLiked: true,
      likedBy: [
        { name: 'Chris Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
        { name: 'Lisa Garcia', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    {
      id: '6',
      type: 'text' as const,
      content: 'Твоя энергия заразительна! После общения с тобой хочется свернуть горы. Спасибо за заряд позитива! ⚡🔥',
      author: {
        name: 'Софья М.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Энергичность',
        emoji: '⚡'
      },
      timestamp: '4 дня назад',
      likes: 38,
      comments: 11,
      isLiked: false,
      likedBy: [
        { name: 'Tom Anderson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Kate Moore', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
        { name: 'Jack Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
      ]
    }
  ]);

  // Моковые данные для бликов, которые отправил пользователь (переводим в состояние)
  const [sentBliks, setSentBliks] = useState([
    {
      id: '7',
      type: 'photo' as const,
      content: 'Потрясающая работа с командой! Твоё лидерство вдохновляет всех вокруг 🌟',
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbGVhZGVyc2hpcCUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4MzU2ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Максим Петров',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Лидерство',
        emoji: '⭐'
      },
      timestamp: '1 час назад',
      likes: 15,
      comments: 4,
      isLiked: false,
      likedBy: [
        { name: 'Max Petrov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Nina Kolesova', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    {
      id: '8',
      type: 'text' as const,
      content: 'Твоя креативность в решении этой задачи просто восхитительна! Такой подход �� бы никогда не придумал. Спасибо за вдохновение! 💡✨',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Анна Сидорова',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Креативность',
        emoji: '💡'
      },
      timestamp: '3 часа назад',
      likes: 22,
      comments: 7,
      isLiked: true,
      likedBy: [
        { name: 'Anna Sidorova', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
        { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Lisa Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '4',
          author: { name: 'Anna Sidorova', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
          content: 'Благодарю за вдохновение! 🌟',
          timestamp: '30m'
        },
        {
          id: '5',
          author: { name: 'Mark Zhang', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
          content: 'Да, это точно про меня! 😅',
          timestamp: '15m'
        }
      ]
    },
    {
      id: '9',
      type: 'video' as const,
      content: 'Восхищаюсь тво��м стилем! Каждая деталь продумана идеально ❄️',
      mediaUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBvdXRmaXR8ZW58MXx8fHwxNzU4MzU2ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Елена См��рнова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Крутой стиль',
        emoji: '❄️'
      },
      timestamp: '6 часов назад',
      likes: 28,
      comments: 11,
      isLiked: false
    },
    {
      id: '10',
      type: 'photo' as const,
      content: 'Твоя энергия заразительна! Спасибо, что делишься позитивом с командой ⚡',
      mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmVyZ3klMjBwb3NpdGl2ZSUyMHBlb3BsZXxlbnwxfHx8fDE3NTgzNTY4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Иго��ь Новиков',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Энергичность',
        emoji: '⚡'
      },
      timestamp: '1 день назад',
      likes: 19,
      comments: 5,
      isLiked: true
    },
    {
      id: '11',
      type: 'text' as const,
      content: 'Невероятная эмпатия! Ты всегда знаешь, как поддержать в нужный момент. Это настоящий дар 💖',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Ольга Кузнецова',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Эмоциональная поддержка',
        emoji: '💖'
      },
      timestamp: '2 дня назад',
      likes: 33,
      comments: 8,
      isLiked: false
    },
    {
      id: '12',
      type: 'video' as const,
      content: 'Твоя способность решать проблемы просто поражает! Ты превращаешь любые сложности в воз��ожности 🚀',
      mediaUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ibGVtJTIwc29sdmluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc1ODM1NjgzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      author: {
        name: 'Risha Bliq',
        avatar: user.avatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Владимир Петрович',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Решение проблем',
        emoji: '💪'
      },
      timestamp: '3 дня назад',
      likes: 41,
      comments: 16,
      isLiked: true,
      likedBy: [
        { name: 'Vladimir Petrov', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
        { name: 'Alex Ivanov', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face' },
        { name: 'Sara Kim', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face' }
      ]
    }
  ]);

  // Отклоненные блики - можно восстановить позже
  const [declinedBliks, setDeclinedBliks] = useState<BlikData[]>([]);
  
  // Настройки автоматического принятия бликов
  const [bliksAutoSettings, setBliksAutoSettings] = useState({
    autoAcceptFromFriends: [] as string[],
    autoDeclineFromBlocked: [] as string[],
    autoAcceptSuperpowers: [] as string[],
    requireApproval: false
  });
  
  const [isBliksSettingsOpen, setIsBliksSettingsOpen] = useState(false);

  // Входящие блики - ожидают подтверждения (уменьшено для быстрой загрузки)
  const [incomingBliks, setIncomingBliks] = useState<BlikData[]>(() => [
    {
      id: 'incoming-1',
      type: 'photo' as const,
      content: 'Твой подход к решению этой задачи просто гениален! Восхищаюсь твоей изобретательностью 🧠✨',
      mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtd29yayUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzU4MzU2ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Максим Стеллар',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Аналитическое мышление',
        emoji: '🧠'
      },
      timestamp: 'только что',
      likes: 0,
      comments: 0,
      isLiked: false
    },
    {
      id: 'incoming-2',
      type: 'video' as const,
      content: 'Потрясающая работа с командой! Ты умеешь объединять людей и вдохновлять их на результат 🤝🌟',
      mediaUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya3xlbnwxfHx8fDE3NTgzNTY4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Ольга Маринова',
        avatar: 'https://images.unsplash.com/photo-1756588534346-e8899364757b?w=100&h=100&fit=crop&crop=face',
        isOnline: false
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Командная работа',
        emoji: '🤝'
      },
      timestamp: '15 минут назад',
      likes: 0,
      comments: 0,
      isLiked: false
    },
    {
      id: 'incoming-3',
      type: 'text' as const,
      content: 'Невероятная энергия! После общения с тобой всегда чувствую прилив сил и вдохновения. Спасибо за заряд позитива! ⚡💪',
      author: {
        name: 'Сергей Волков',
        avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Risha Bliq',
        avatar: user.avatarImage
      },
      superpower: {
        name: 'Энергичность',
        emoji: '⚡'
      },
      timestamp: '30 минут назад',
      likes: 0,
      comments: 0,
      isLiked: false
    }
  ]);

  // УБИРАЕМ МЕГАБЛИКИ - теперь только персональные и бизнес-суперсилы
  const [removedMegaSuperpowerBliks] = useState([
    // Блики по Программированию
    {
      id: 'mega-programming-1',
      type: 'photo' as const,
      content: 'Невероятный код! Твоё мастерство программирования впечатляет всю команду 💻',
      mediaUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZ3xlbnwxfHx8fDE3NTgzNTY4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Мария Смирнова',
        avatar: mariaAvatarImage,
        isOnline: false
      },
      recipient: {
        name: 'Алексей Корнеев',
        avatar: alexeyAvatarImage
      },
      superpower: {
        name: 'Программирование',
        emoji: '💻'
      },
      timestamp: '3 часа назад',
      likes: 32,
      comments: 12,
      isLiked: true,
      likedBy: [
        { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    // Блики по Фотографии  
    {
      id: 'mega-photography-1',
      type: 'photo' as const,
      content: 'Потрясающие кадры! Твой взгляд на мир через объектив просто волшебный 📸',
      mediaUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYXxlbnwxfHx8fDE3NTgzNTY4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Дмитрий Козлов',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        isOnline: false
      },
      recipient: {
        name: 'Мария Смирнова',
        avatar: mariaAvatarImage
      },
      superpower: {
        name: 'Фотография',
        emoji: '📸'
      },
      timestamp: '4 часа назад',
      likes: 28,
      comments: 9,
      isLiked: true,
      likedBy: [
        { name: 'Alexey Korneev', avatar: alexeyAvatarImage },
        { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    // Блики по Креативности (мегасила)
    {
      id: 'mega-creativity-1',
      type: 'video' as const,
      content: 'Твоя креативность в каждом проекте просто завораживает! Продолжай вдохновлять нас 🎨',
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY3JlYXRpdml0eXxlbnwxfHx8fDE3NTgzNTY4Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Елена Рыбакова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        isOnline: false
      },
      recipient: {
        name: 'Анна Петрова',
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Креативность',
        emoji: '🧠'
      },
      timestamp: '1 день назад',
      likes: 22,
      comments: 7,
      isLiked: false,
      likedBy: [
        { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    // Блики по Харизме (мегасила)
    {
      id: 'mega-charisma-1',
      type: 'video' as const,
      content: 'Твоя харизма просто зашкаливает! Каждое выступление - это магия 👑✨',
      mediaUrl: 'https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4Mjg0MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      author: {
        name: 'Алексей Корнеев',
        avatar: alexeyAvatarImage,
        isOnline: true
      },
      recipient: {
        name: 'Елена Рыбакова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Харизма',
        emoji: '👑'
      },
      timestamp: '2 часа назад',
      likes: 34,
      comments: 11,
      isLiked: true,
      likedBy: [
        { name: 'Maria Smirnova', avatar: mariaAvatarImage },
        { name: 'Igor Volkov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Dmitry Kozlov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
      ]
    },
    {
      id: 'mega-charisma-2',
      type: 'photo' as const,
      content: 'Невероятная энергетика! Ты умеешь зажигать людей и вдохновлять на великие дела 🔥',
      mediaUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA0MDE2Nnww&ixlib=rb-4.1.0&q=80&w=400',
      author: {
        name: 'Мария Смирнова',
        avatar: mariaAvatarImage,
        isOnline: false
      },
      recipient: {
        name: 'Дмитрий Козлов',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Харизма',
        emoji: '👑'
      },
      timestamp: '4 часа назад',
      likes: 28,
      comments: 8,
      isLiked: false,
      likedBy: [
        { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'Alexey Korneev', avatar: alexeyAvatarImage }
      ]
    },
    {
      id: 'mega-charisma-3',
      type: 'text' as const,
      content: 'Твоя способность вли��ть на людей и завоевывать их доверие - это настоящий дар! Продолжай в том же духе 👑💫',
      author: {
        name: 'Игорь Волков',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: true
      },
      recipient: {
        name: 'Анна Петрова',
        avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face'
      },
      superpower: {
        name: 'Харизма',
        emoji: '👑'
      },
      timestamp: '6 часов назад',
      likes: 41,
      comments: 15,
      isLiked: true,
      likedBy: [
        { name: 'Anna Petrova', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' },
        { name: 'Maria Smirnova', avatar: mariaAvatarImage },
        { name: 'Elena Rybakova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'Alexey Korneev', avatar: alexeyAvatarImage }
      ]
    }
  ]);

  // Оптимизированная база данных пользователей - только ключевые пользователи для быстрой загрузки
  const otherUsersDatabase: Record<string, OtherUser> = useMemo(() => ({
    'alexey-korneev': {
      id: 'alexey-korneev',
      name: 'Алексей Корнеев',
      status: 'Senior Frontend Developer',
      location: 'Москва, Россия',
      bio: 'Увлеченный разработчик с 8+ годами опыта. Спец��ализируюсь на React, TypeScript и современных веб-технологиях. Люблю создавать красивые и функциональные интерфейсы.',
      avatar: alexeyAvatarImage,
      backgroundImage: 'https://images.unsplash.com/photo-1604912364280-4a5f295cd988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 324, friends: 45, superpowers: 8 },
      topSuperpowers: [
        { name: 'Программирование', emoji: '💻', value: 95, energy: 92 },
        { name: 'Решение проблем', emoji: '💪', value: 88, energy: 85 },
        { name: 'Лидерство', emoji: '⭐', value: 72, energy: 78 },
        { name: 'TypeScript', emoji: '📝', value: 89, energy: 87 },
        { name: 'React', emoji: '⚛️', value: 93, energy: 90 },
        { name: 'UX/UI дизайн', emoji: '🎨', value: 76, energy: 73 },
        { name: 'Наставничество', emoji: '👨‍🏫', value: 69, energy: 66 },
        { name: 'Архитектура ПО', emoji: '🏗️', value: 84, energy: 81 }
      ]
    },
    'maria-smirnova': {
      id: 'maria-smirnova',
      name: 'Мария Смирнова',
      status: 'Creative Photographer',
      location: 'Санкт-Петербург, Россия',
      bio: 'Профессиональный фотограф и визуальный художник. Создаю эмоциональные снимки, которые рассказывают истории. Специализируюсь на портретной и событийной съемке.',
      avatar: mariaAvatarImage,
      backgroundImage: 'https://images.unsplash.com/photo-1715619172925-78d1b2022a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBib3JlYWxpcyUyMG5pZ2h0fGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 267, friends: 38, superpowers: 6 },
      topSuperpowers: [
        { name: 'Фотография', emoji: '📸', value: 92, energy: 85 },
        { name: 'Креативность', emoji: '🧠', value: 85, energy: 88 },
        { name: 'Крутой стиль', emoji: '❄️', value: 79, energy: 82 },
        { name: 'Редактировани��', emoji: '✂️', value: 74, energy: 78 },
        { name: 'Визуальное мышление', emoji: '👁️', value: 68, energy: 71 },
        { name: 'Художественный вкус', emoji: '🎨', value: 65, energy: 69 }
      ]
    },
    'igor-volkov': {
      id: 'igor-volkov',
      name: 'Игорь Волков',
      status: 'Professional Chef',
      location: 'Екатеринбург, Россия',
      bio: 'Шеф-пова�� с международным опытом. Создаю уникальные кулинарные впечатления, сочетая традиционные техники с современными подходами.',
      avatar: 'https://images.unsplash.com/photo-1723747338983-da5fd1d09904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjaGVmJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTg5fDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1646038572815-43fe759e459b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 189, friends: 29, superpowers: 5 },
      topSuperpowers: [
        { name: 'Кулинария', emoji: '👨‍🍳', value: 94, energy: 78 },
        { name: 'Креативность', emoji: '🧠', value: 76, energy: 72 },
        { name: 'Командная работа', emoji: '🤝', value: 68, energy: 65 },
        { name: 'Гостеприимство', emoji: '🏠', value: 62, energy: 59 },
        { name: 'Организованн��сть', emoji: '📋', value: 58, energy: 55 }
      ]
    },
    'elena-rybakova': {
      id: 'elena-rybakova',
      name: 'Елена Рыбакова',
      status: 'Dance Instructor & Choreographer',
      location: 'Казань, Россия',
      bio: 'Профессиональный хореограф и танцор. Преподаю современные танцы и помогаю людям выражать себя через движение. Участница международных фестивалей.',
      avatar: 'https://images.unsplash.com/photo-1736697027030-d3407ffc7c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGluc3RydWN0b3IlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTE4OXww&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1577642665234-b1abe52cd0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 298, friends: 52, superpowers: 7 },
      topSuperpowers: [
        { name: 'Танцы', emoji: '💃', value: 96, energy: 91 },
        { name: 'Энергичность', emoji: '⚡', value: 89, energy: 94 },
        { name: 'Харизма', emoji: '👑', value: 84, energy: 87 },
        { name: 'Координация', emoji: '🤸‍♀️', value: 78, energy: 82 },
        { name: 'Ритм', emoji: '🎵', value: 75, energy: 79 },
        { name: 'Выразительность', emoji: '🎭', value: 71, energy: 76 },
        { name: 'Грация', emoji: '🦢', value: 68, energy: 73 }
      ]
    },
    'dmitry-kozlov': {
      id: 'dmitry-kozlov',
      name: 'Дмитрий Козлов',
      status: 'Music Producer & Composer',
      location: 'Новосибирск, Россия',
      bio: 'Музыкальный продюсер и композитор. Создаю атмосферную электронную музыку и саундтреки. Работаю с артистами и помогаю им находить свое звучание.',
      avatar: 'https://images.unsplash.com/photo-1614273144956-a93d12cd3318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU5NzE4OXww&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1602981256888-244edc1f444f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBuZWJ1bGElMjBzcGFjZSUyMHB1cnBsZXxlbnwxfHx8fDE3NTg2MjQyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 156, friends: 34, superpowers: 4 },
      topSuperpowers: [
        { name: 'Музыка', emoji: '🎵', value: 91, energy: 67 },
        { name: 'Креативность', emoji: '🧠', value: 82, energy: 74 },
        { name: 'Эмоциональная поддержка', emoji: '💖', value: 75, energy: 69 },
        { name: 'Звукорежиссура', emoji: '🎚️', value: 68, energy: 64 }
      ]
    },
    // Добавляем новых пользователей с уникальным�� энергетическими фонами
    'anna-petrova': {
      id: 'anna-petrova',
      name: 'Анна Петрова',
      status: 'UX/UI Designer & Digital Artist',
      location: 'Санкт-Петербург, Россия',
      bio: 'Креативный дизайнер, создающий уникальные пользовательские опыты. Специализируюсь на интерфейсах мобильных приложений и интерактивном дизайне.',
      avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRlc2lnbmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTAyMDEyfDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1719042575585-e9d866f43210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjB1bmRlcndhdGVyfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 445, friends: 67, superpowers: 9 },
      topSuperpowers: [
        { name: 'Дизайн', emoji: '🎨', value: 96, energy: 89 },
        { name: 'Креативность', emoji: '🧠', value: 91, energy: 94 },
        { name: 'Визуальное мышление', emoji: '👁️', value: 87, energy: 85 },
        { name: 'UX/UI дизайн', emoji: '📱', value: 93, energy: 91 },
        { name: 'Интерактивный дизайн', emoji: '⚡', value: 84, energy: 87 },
        { name: 'Прототипирование', emoji: '🔧', value: 78, energy: 82 },
        { name: 'Пользовательский опыт', emoji: '👤', value: 89, energy: 86 },
        { name: 'Цифровое искусство', emoji: '💫', value: 75, energy: 79 },
        { name: 'Брендинг', emoji: '🏷️', value: 71, energy: 76 }
      ]
    },
    'sergey-volkov': {
      id: 'sergey-volkov',
      name: 'Сергей Волков',
      status: 'Extreme Sports Athlete',
      location: 'Сочи, Россия',
      bio: 'Профессиональный экстремальный спортсмен и тренер. Сноубординг, скалолазание, парашютный спорт - это моя стихия. Помогаю людям преодолевать страхи.',
      avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhdGhsZXRlJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTk2fDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1722482312877-dda06fc3c23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGNvcmFsJTIwcmVlZnxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 356, friends: 89, superpowers: 11 },
      topSuperpowers: [
        { name: 'Экстремальные виды спорта', emoji: '🏔️', value: 98, energy: 97 },
        { name: 'Смелость', emoji: '🦁', value: 95, energy: 91 },
        { name: 'Физическая подготовка', emoji: '💪', value: 93, energy: 88 },
        { name: 'Сноубординг', emoji: '🏂', value: 96, energy: 94 },
        { name: 'Скалолазание', emoji: '🧗‍♂️', value: 92, energy: 89 },
        { name: 'Парашютный спорт', emoji: '🪂', value: 89, energy: 86 },
        { name: 'Тренерство', emoji: '👨‍🏫', value: 78, energy: 75 },
        { name: 'Мотивация', emoji: '🔥', value: 85, energy: 82 },
        { name: 'Адреналин', emoji: '⚡', value: 91, energy: 88 },
        { name: 'Выносливость', emoji: '🏃‍♂️', value: 87, energy: 84 },
        { name: 'Координация', emoji: '🤸‍♂️', value: 83, energy: 80 }
      ]
    },
    'olga-marinova': {
      id: 'olga-marinova',
      name: 'Ольга Маринова',
      status: 'Marine Biologist & Ocean Explorer',
      location: 'Владивосток, Россия',
      bio: 'Морской биолог и исследователь океанов. Изучаю подводную жизнь и экосистемы. Веду научные экспедиции и создаю документальные фильмы о морской природе.',
      avatar: 'https://images.unsplash.com/photo-1756588534346-e8899364757b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpc3QlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTE5Nnww&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1708864163871-311332fb9d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW4lMjBibHVlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 278, friends: 54, superpowers: 8 },
      topSuperpowers: [
        { name: 'Исследования', emoji: '🔬', value: 94, energy: 86 },
        { name: 'Экология', emoji: '🌊', value: 92, energy: 89 },
        { name: 'Научное мышление', emoji: '🧬', value: 88, energy: 84 },
        { name: 'Морская биология', emoji: '🐠', value: 96, energy: 91 },
        { name: 'Дайвинг', emoji: '🤿', value: 85, energy: 82 },
        { name: 'Документалистика', emoji: '🎬', value: 76, energy: 73 },
        { name: 'Охрана природы', emoji: '🌍', value: 89, energy: 86 },
        { name: 'Экспедиции', emoji: '🚢', value: 81, energy: 78 }
      ]
    },
    'maxim-stellar': {
      id: 'maxim-stellar',
      name: 'Максим Стеллар',
      status: 'Astrophysicist & Space Researcher',
      location: 'Москва, Россия',
      bio: 'Астрофизик и космический исследователь. Изучаю далекие галактики и черные дыры. Популяризирую науку и веду лекци�� о тайнах Вселенной.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      backgroundImage: 'https://images.unsplash.com/photo-1629647259197-78761c30327d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjBsaWZlJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 523, friends: 78, superpowers: 12 },
      topSuperpowers: [
        { name: 'Астрофизика', emoji: '🌌', value: 97, energy: 92 },
        { name: 'Научные исследования', emoji: '🔭', value: 95, energy: 88 },
        { name: 'Популяризация науки', emoji: '⭐', value: 89, energy: 86 },
        { name: 'Черные дыры', emoji: '🕳️', value: 94, energy: 90 },
        { name: 'Галактики', emoji: '🌠', value: 92, energy: 87 },
        { name: 'Теоретическая физика', emoji: '📐', value: 91, energy: 85 },
        { name: 'Космические исследования', emoji: '🚀', value: 93, energy: 89 },
        { name: 'Лекторство', emoji: '🎤', value: 85, energy: 82 },
        { name: 'Научная визуализация', emoji: '📊', value: 78, energy: 75 },
        { name: 'Математическое моделирование', emoji: '🧮', value: 88, energy: 84 },
        { name: 'Квантовая механика', emoji: '⚛️', value: 86, energy: 83 },
        { name: 'Космология', emoji: '🌍', value: 90, energy: 87 }
      ]
    },
    // Добавляем недостающих пользователей из popularUsers
    'pavel-sidorov': {
      id: 'pavel-sidorov',
      name: 'Павел Сидоров',
      status: 'Marketing Director & Brand Strategist',
      location: 'Нижний Новгород, Россия',
      bio: 'Директор по маркетингу с богатым опытом в брендинге и стратегическом планировании. Помогаю компаниям строить сильные бренды и эффективные маркетинговые стратегии.',
      avatar: 'https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MjAxfDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmx1ZXxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 156, friends: 31, superpowers: 6 },
      topSuperpowers: [
        { name: 'Маркетинг', emoji: '📊', value: 91, energy: 84 },
        { name: 'Стратегическое мышление', emoji: '🧠', value: 87, energy: 79 },
        { name: 'Лидерство', emoji: '⭐', value: 82, energy: 88 },
        { name: 'Брендинг', emoji: '🏷️', value: 78, energy: 75 },
        { name: 'Аналитика', emoji: '📈', value: 74, energy: 71 },
        { name: 'Планирование', emoji: '📋', value: 69, energy: 66 }
      ]
    },
    'tatiana-zaitseva': {
      id: 'tatiana-zaitseva',
      name: 'Татьяна Зайцева',
      status: 'Yoga Instructor & Wellness Coach',
      location: 'Краснодар, Россия',
      bio: 'Сертифицированный инструктор йоги и wellness-коуч. Помогаю людям находить баланс между телом и разумом, р��звивать осознанность и здоровые привычки.',
      avatar: 'https://images.unsplash.com/photo-1581557521869-e3ffa367232f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MjAyfDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2UlMjBzdW5yaXNlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 298, friends: 67, superpowers: 9 },
      topSuperpowers: [
        { name: 'Йога', emoji: '🧘‍♀️', value: 96, energy: 94 },
        { name: 'Mindfulness', emoji: '☯️', value: 92, energy: 91 },
        { name: 'Здоровый образ жизни', emoji: '💚', value: 89, energy: 87 },
        { name: 'М��д��тация', emoji: '🕉️', value: 94, energy: 92 },
        { name: 'Wellness-коучи��г', emoji: '🌟', value: 86, energy: 84 },
        { name: 'Баланс тела и разума', emoji: '⚖️', value: 83, energy: 81 },
        { name: 'Дыхательные практики', emoji: '🌬️', value: 79, energy: 77 },
        { name: 'Релаксация', emoji: '🌸', value: 76, energy: 74 },
        { name: 'Осознанность', emoji: '💫', value: 81, energy: 79 }
      ]
    },
    'andrey-nikolaev': {
      id: 'andrey-nikolaev',
      name: 'Андрей Николаев',
      status: 'Financial Analyst & Investment Advisor',
      location: 'Москва, Россия',
      bio: 'Финансовый аналитик и консультант по инвестициям. Помогаю частным лицам и компаниям принимать обоснованные финансовые решения и строить инвестиционные стратегии.',
      avatar: 'https://images.unsplash.com/flagged/photo-1573582677725-863b570e3c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTk2fDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYWJzdHJhY3QlMjBibHVlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 234, friends: 42, superpowers: 7 },
      topSuperpowers: [
        { name: 'Финансовый анализ', emoji: '💰', value: 94, energy: 89 },
        { name: 'Стратегическое планирование', emoji: '📈', value: 88, energy: 85 },
        { name: 'Консультирование', emoji: '🎯', value: 86, energy: 83 },
        { name: 'Инвестиционное планирование', emoji: '💼', value: 91, energy: 87 },
        { name: 'Рискmенеджмент', emoji: '⚡', value: 82, energy: 79 },
        { name: 'Финансовое планирование', emoji: '🎮', value: 78, energy: 75 },
        { name: 'Экономическое мышление', emoji: '🧮', value: 84, energy: 81 }
      ]
    },
    'valentina-orlova': {
      id: 'valentina-orlova',
      name: 'Валентина Орлова',
      status: 'Interior Designer & Architecture Enthusiast',
      location: 'Санкт-Петербург, Россия',
      bio: 'Дизайнер интерьеров с тонким чувством стиля и эстетики. Создаю уютные и функциональные пространства, которые отражают индивидуальность клиентов.',
      avatar: 'https://images.unsplash.com/photo-1644094751419-cc8ae49dd26d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbmVyJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkwNTUyMDd8MA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMG1vZGVybnxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 189, friends: 36, superpowers: 8 },
      topSuperpowers: [
        { name: 'Дизайн интерьера', emoji: '🏠', value: 93, energy: 87 },
        { name: 'Эстетическое чувство', emoji: '🎨', value: 90, energy: 85 },
        { name: 'Пространственное мышление', emoji: '📐', value: 84, energy: 81 },
        { name: 'Архитектурное понимание', emoji: '🏛️', value: 87, energy: 83 },
        { name: 'Цветовая гармония', emoji: '🌈', value: 79, energy: 76 },
        { name: 'Мебельная композиция', emoji: '🪑', value: 75, energy: 72 },
        { name: 'Освещение', emoji: '💡', value: 81, energy: 78 },
        { name: 'Уют и функциональность', emoji: '✨', value: 86, energy: 82 }
      ]
    },
    'ruslan-kovalev': {
      id: 'ruslan-kovalev',
      name: 'Руслан Ковалев',
      status: 'Cybersecurity Expert & Ethical Hacker',
      location: 'Казань, Россия',
      bio: 'Специалист по кибербезопасности и этичный хакер. Защищаю компании от кибератак и провожу аудиты безопасности. Популяризирую культуру информационной безопасности.',
      avatar: 'https://images.unsplash.com/photo-1611871426033-b517e7a4f1a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZXhwZXJ0JTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MjAyfDA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbWF0cml4fGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 276, friends: 58, superpowers: 10 },
      topSuperpowers: [
        { name: 'Кибербезопасность', emoji: '🔒', value: 97, energy: 92 },
        { name: 'Этичный хакинг', emoji: '💻', value: 94, energy: 89 },
        { name: 'Системное мышление', emoji: '🧠', value: 87, energy: 85 },
        { name: 'Аудит безопасности', emoji: '🔍', value: 91, energy: 87 },
        { name: 'Защита данных', emoji: '🛡️', value: 88, energy: 84 },
        { name: 'Сетевая безопасность', emoji: '🌐', value: 85, energy: 81 },
        { name: 'Криптография', emoji: '🔐', value: 82, energy: 78 },
        { name: 'Инцидент-реагиров��ние', emoji: '🚨', value: 79, energy: 75 },
        { name: 'Обучение безопасности', emoji: '🎓', value: 76, energy: 72 },
        { name: 'Пентестинг', emoji: '⚔️', value: 89, energy: 85 }
      ]
    },
    'natalia-belova': {
      id: 'natalia-belova',
      name: 'Наталья Белова',
      status: 'Event Planner & Experience Designer',
      location: 'Екатеринбург, Россия',
      bio: 'Организатор мероприятий и дизайнер впечатлений. Создаю незабываемые события - от корпоративных конференций до свадеб. Каждое мероприятие - это уникальная история.',
      avatar: 'https://images.unsplash.com/photo-1639986162505-c9bcccfc9712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uZXIlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTIwMnww&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uaW5nJTIwbHV4dXJ5fGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 367, friends: 89, superpowers: 11 },
      topSuperpowers: [
        { name: 'Организация мероприятий', emoji: '🎉', value: 95, energy: 91 },
        { name: 'Креативность', emoji: '💡', value: 89, energy: 87 },
        { name: 'Управление проектами', emoji: '📋', value: 86, energy: 84 },
        { name: 'Дизайн впечатлений', emoji: '✨', value: 92, energy: 88 },
        { name: 'Координация команды', emoji: '👥', value: 83, energy: 80 },
        { name: 'Тайм-менеджмент', emoji: '⏰', value: 80, energy: 77 },
        { name: 'Работа с клиентами', emoji: '🤝', value: 87, energy: 84 },
        { name: 'Декорирование', emoji: '🎨', value: 78, energy: 75 },
        { name: 'Кейтеринг', emoji: '🍽️', value: 74, energy: 71 },
        { name: 'Техническое обеспечение', emoji: '🎵', value: 76, energy: 73 },
        { name: 'Логистика', emoji: '🚚', value: 81, energy: 78 }
      ]
    },
    'viktor-sokolov': {
      id: 'viktor-sokolov',
      name: 'Виктор Соколов',
      status: 'Automotive Engineer & Racing Enthusiast',
      location: 'Самара, Россия',
      bio: 'Инженер автомобильной промышленности и энтузиаст автоспорта. Работаю над инновационными решениями в области электромобилей и автономного вождения.',
      avatar: 'https://images.unsplash.com/photo-1710403662298-73913a5a4dc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZW5naW5lZXIlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkwNTUyMDJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 123, friends: 24, superpowers: 5 },
      topSuperpowers: [
        { name: 'Автомобильная инженерия', emoji: '🚗', value: 92, energy: 86 },
        { name: 'Техническое мышление', emoji: '⚙️', value: 88, energy: 83 },
        { name: 'Инновации', emoji: '💡', value: 84, energy: 79 },
        { name: 'Электромобили', emoji: '🔋', value: 89, energy: 85 },
        { name: 'Автоспорт', emoji: '🏎️', value: 81, energy: 77 }
      ]
    },
    'karina-vasilieva': {
      id: 'karina-vasilieva',
      name: 'Карина Васильева',
      status: 'Social Media Strategist & Content Creator',
      location: 'Ростов-на-Дону, Ро��сия',
      bio: 'Стратег социальных медиа и создатель контент��. Помогаю брендам находить свой голос в цифровом пространстве и строить аутентичные отношения с ��удиторией.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      backgroundImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGNvbnRlbnR8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 412, friends: 78, superpowers: 12 },
      topSuperpowers: [
        { name: 'Социальные медиа', emoji: '📱', value: 96, energy: 93 },
        { name: 'Контент-стратегия', emoji: '📝', value: 91, energy: 88 },
        { name: 'Коммуникации', emoji: '💬', value: 87, energy: 85 },
        { name: 'Создание контента', emoji: '🎥', value: 93, energy: 90 },
        { name: 'Бренд-маркетинг', emoji: '🏷️', value: 89, energy: 86 },
        { name: 'Аналитика соцсетей', emoji: '📊', value: 84, energy: 81 },
        { name: 'Влияние на аудиторию', emoji: '🎯', value: 88, energy: 85 },
        { name: 'Вирусный контент', emoji: '🚀', value: 82, energy: 79 },
        { name: 'Копирайтинг', emoji: '✍️', value: 85, energy: 82 },
        { name: 'Визуальный сторителлинг', emoji: '📸', value: 90, energy: 87 },
        { name: 'Тренды соцсетей', emoji: '🔥', value: 87, energy: 84 },
        { name: 'Аутентичность бренда', emoji: '💎', value: 86, energy: 83 }
      ]
    },

    // БИЗНЕС-ПРОФИЛЬ: NeoTech Solutions
    'neotech-solutions': {
      id: 'neotech-solutions',
      name: 'NeoTech Solutions',
      status: 'AI-powered Software Development Company',
      location: 'Москва, Россия',
      bio: 'Мы создаем передовые AI-решения для бизнеса. Наша команда разрабатывает инновационные программные продукты, которые автоматизируют процессы и повышают эффективность компаний. Специализируемся на машинном обучении, чат-ботах и системах аналитики.',
      avatar: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY3liZXJwdW5rfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      // Добавляем поля для бизнес-профиля
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'NeoTech Solutions',
        industry: 'Технологии и IT',
        founded: '2019',
        employees: '51-200 сотрудников',
        revenue: '100 млн - 1 млрд ₽',
        description: 'AI-powered разработка программного обеспечения',
        website: 'https://neotech-solutions.ru',
        phone: '+7 (495) 123-45-67',
        email: 'hello@neotech-solutions.ru',
        verified: true,
        verificationDate: '15 декабря 2024',
        verificationDocuments: []
      },
      metrics: { bliks: 892, friends: 156, superpowers: 15 },
      // Бизнес-суперсилы на основе 7 категорий
      topSuperpowers: [
        // Flow - Операционная эффективность
        { name: 'Автоматизация процессов', emoji: '🌊', value: 96, energy: 94 },
        { name: 'Agile-методологии', emoji: '🔄', value: 89, energy: 91 },
        
        // Mind - Инновации и стратегия
        { name: 'Искусственный интеллект', emoji: '🧠', value: 98, energy: 96 },
        { name: 'Машинное обучение', emoji: '🤖', value: 94, energy: 92 },
        { name: 'Инновационные решения', emoji: '💡', value: 91, energy: 88 },
        
        // Crew - Команда и культура
        { name: 'Командное лидерство', emoji: '👥', value: 85, energy: 83 },
        { name: 'Техническая экспертиза', emoji: '👨‍💻', value: 93, energy: 90 },
        
        // Style - Дизайн и UX
        { name: 'Пользовательский опыт', emoji: '🎨', value: 87, energy: 85 },
        { name: 'Интерфейсы будущего', emoji: '✨', value: 82, energy: 79 },
        
        // Drive - Маркетинг и продажи
        { name: 'Продажи B2B', emoji: '⚡', value: 79, energy: 77 },
        { name: 'Клиентский сервис', emoji: '🎯', value: 88, energy: 86 },
        
        // Body - Финансовая мощь
        { name: 'Масштабирование бизнеса', emoji: '💪', value: 84, energy: 82 },
        { name: 'Финансовая устойчивость', emoji: '📈', value: 86, energy: 84 },
        
        // Soul - Брендинг и ценности
        { name: 'Корпоративная культура', emoji: '💜', value: 81, energy: 78 },
        { name: 'Технологическая миссия', emoji: '🌟', value: 83, energy: 80 }
      ]
    },
    'svetlana-belova': {
      id: 'svetlana-belova',
      name: 'Светлана Белова',
      status: 'Psychologist & Life Coach',
      location: 'Воронеж, Россия',
      bio: 'Психолог и лайф-коуч с многолетним опытом. Помогаю людям преодолевать жизненные трудности, находить внутренние ресурсы и достигать личностного роста.',
      avatar: 'https://images.unsplash.com/photo-1581490152474-e63c1ad2fa75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTIwN3ww&ixlib=rb-4.1.0&q=80&w=400',
      backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwbWluZGZ1bG5lc3N8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 289, friends: 54, superpowers: 9 },
      topSuperpowers: [
        { name: 'Психология', emoji: '🧠', value: 94, energy: 90 },
        { name: 'Эмпатия', emoji: '💖', value: 92, energy: 88 },
        { name: 'Консультирование', emoji: '💬', value: 87, energy: 85 },
        { name: 'Лайф-коучинг', emoji: '🌟', value: 90, energy: 87 },
        { name: 'Терапевтические техники', emoji: '🔧', value: 88, energy: 84 },
        { name: 'Личностный рост', emoji: '🌱', value: 85, energy: 82 },
        { name: 'Работа с кризисами', emoji: '🆘', value: 89, energy: 86 },
        { name: 'Мотивация', emoji: '🔥', value: 83, energy: 80 },
        { name: 'Внутренние ресурсы', emoji: '💎', value: 86, energy: 83 }
      ]
    },
    'maria-chen': {
      id: 'maria-chen',
      name: 'Maria Chen',
      status: 'Digital Artist & Creative Director',
      location: 'Санкт-Петербург, Россия',
      bio: 'Цифровой художник и креативный директор. Создаю уникальные визуальные решения для брендов и помогаю им выделиться в цифровом пространстве.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      backgroundImage: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      metrics: { bliks: 345, friends: 62, superpowers: 8 },
      topSuperpowers: [
        { name: 'Цифровое искусство', emoji: '🎨', value: 94, energy: 87 },
        { name: 'Креативность', emoji: '💡', value: 91, energy: 89 },
        { name: 'Визу��льный дизайн', emoji: '👁️', value: 88, energy: 84 },
        { name: 'Креативная режиссура', emoji: '🎬', value: 92, energy: 88 },
        { name: 'Брендинг', emoji: '🏷️', value: 85, energy: 82 },
        { name: 'Графический дизайн', emoji: '🖼️', value: 89, energy: 86 },
        { name: 'Визуальная айдентика', emoji: '🎯', value: 86, energy: 83 },
        { name: 'Цифровые решения', emoji: '💻', value: 83, energy: 80 }
      ]
    },
    'david-kim': {
      id: 'david-kim',
      name: 'David Kim',
      status: 'Tech Entrepreneur & Innovation Leader',
      location: 'Москва, Россия',
      bio: 'Технологический предприниматель и лидер инноваций. Основываю стартапы в области AI и разрабатываю решения, которые меняют мир к лучшему.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      metrics: { bliks: 278, friends: 54, superpowers: 9 },
      topSuperpowers: [
        { name: 'Инновации', emoji: '💡', value: 96, energy: 92 },
        { name: 'Предпринимательство', emoji: '🚀', value: 93, energy: 89 },
        { name: 'Технологическое мышление', emoji: '🤖', value: 89, energy: 86 },
        { name: 'Искусственный интеллект', emoji: '🧠', value: 94, energy: 91 },
        { name: 'Стартапы', emoji: '⚡', value: 91, energy: 88 },
        { name: 'Лидерство инноваций', emoji: '🌟', value: 87, energy: 84 },
        { name: 'Венчурные инвестиции', emoji: '💰', value: 84, energy: 81 },
        { name: 'Продуктовое мышление', emoji: '📱', value: 88, energy: 85 },
        { name: 'Технологические решения', emoji: '⚙️', value: 85, energy: 82 }
      ]
    },

    // ДОПОЛНИТЕЛЬНЫЕ БИЗНЕС-ПРОФИЛИ
    'innovacorp': {
      id: 'innovacorp',
      name: 'InnovaCorp',
      status: 'Digital Innovation & Consulting',
      location: 'Москва, Россия', 
      bio: 'Ведущая консалтинговая компания в области цифровых инноваций. Помогаем бизнесу внедрять передовые технологии и трансформироваться в цифровую эпоху.',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'InnovaCorp',
        industry: 'Консалтинг и IT',
        founded: '2020',
        employees: '11-50 сотрудников',
        revenue: '50-100 млн ₽',
        description: 'Цифровые инновации и консалтинг',
        website: 'https://innovacorp.ru',
        phone: '+7 (495) 567-89-10',
        email: 'info@innovacorp.ru',
        verified: true,
        verificationDate: '10 января 2025',
        verificationDocuments: []
      },
      metrics: { bliks: 456, friends: 89, superpowers: 12 },
      topSuperpowers: [
        { name: 'Цифровые инновации', emoji: '💡', value: 94, energy: 91 },
        { name: 'Консалтинг', emoji: '🎯', value: 88, energy: 85 },
        { name: 'Цифровая трансформация', emoji: '🔄', value: 92, energy: 89 },
        { name: 'Технологическая стратегия', emoji: '🧠', value: 87, energy: 84 },
        { name: 'Управление изменениями', emoji: '⚡', value: 85, energy: 82 }
      ]
    },
    'pixel-perfect-studio': {
      id: 'pixel-perfect-studio',
      name: 'Pixel Perfect Studio',
      status: 'Creative Design Agency',
      location: 'Санкт-Петербург, Россия',
      bio: 'Креативное дизайн-агентство полного цикла. Создаем уникальные визуальные решения для брендов, которые хотят выделиться на рынке.',
      avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydCUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU4MjQ2MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'Pixel Perfect Studio',
        industry: 'Дизайн и креатив',
        founded: '2018',
        employees: '21-50 сотрудников',
        revenue: '25-50 млн ₽',
        description: 'Креативное дизайн-агентство полного цикла',
        website: 'https://pixelperfect.studio',
        phone: '+7 (812) 456-78-90',
        email: 'hello@pixelperfect.studio',
        verified: true,
        verificationDate: '5 февраля 2025',
        verificationDocuments: []
      },
      metrics: { bliks: 623, friends: 234, superpowers: 15 },
      topSuperpowers: [
        { name: 'Креативный дизайн', emoji: '🎨', value: 96, energy: 94 },
        { name: 'Брендинг', emoji: '🏷️', value: 91, energy: 88 },
        { name: 'Визуальная айдентика', emoji: '✨', value: 93, energy: 90 },
        { name: 'Пользовательский опыт', emoji: '👁️', value: 89, energy: 86 },
        { name: 'Веб-дизайн', emoji: '💻', value: 87, energy: 84 }
      ]
    },
    'strategic-minds-ltd': {
      id: 'strategic-minds-ltd',
      name: 'Strategic Minds Ltd',
      status: 'Business Strategy & Management Consulting',
      location: 'Екатеринбург, Россия',
      bio: 'Стратегическое консалтинговое агентство, специализирующееся на управленческом консалтинге и развитии бизнеса.',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYWJzdHJhY3QlMjBibHVlfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: false,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'Strategic Minds Ltd',
        industry: 'Консалтинг',
        founded: '2017',
        employees: '11-50 сотрудников',
        revenue: '100-500 млн ₽',
        description: 'Стратегическое консалтинговое агентство',
        website: 'https://strategicminds.ru',
        phone: '+7 (343) 789-01-23',
        email: 'contact@strategicminds.ru',
        verified: true,
        verificationDate: '12 марта 2025',
        verificationDocuments: []
      },
      metrics: { bliks: 345, friends: 167, superpowers: 10 },
      topSuperpowers: [
        { name: 'Стратегическое планирование', emoji: '🎯', value: 95, energy: 92 },
        { name: 'Управленческий консалтинг', emoji: '💼', value: 93, energy: 90 },
        { name: 'Развитие бизнеса', emoji: '📈', value: 89, energy: 86 },
        { name: 'Аналитическое мышление', emoji: '🧠', value: 91, energy: 88 },
        { name: 'Лидерство', emoji: '⭐', value: 87, energy: 84 }
      ]
    },
    'finflow-solutions': {
      id: 'finflow-solutions',
      name: 'FinFlow Solutions',
      status: 'Financial Technology & Digital Banking',
      location: 'Новосибирск, Россия',
      bio: 'Финтех-компания, разрабатывающая инновационные решения для цифрового банкинга и управления финансами.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1559221265-598e5f27c1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwZGlnaXRhbHxlbnwxfHx8fDE3NTgyNDYwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'FinFlow Solutions',
        industry: 'Финансовые технологии',
        founded: '2021',
        employees: '101-500 сотрудников',
        revenue: '500 млн - 1 млрд ₽',
        description: 'Инновационные финтех-решения',
        website: 'https://finflow.solutions',
        phone: '+7 (383) 234-56-78',
        email: 'info@finflow.solutions',
        verified: true,
        verificationDate: '20 декабря 2024',
        verificationDocuments: []
      },
      metrics: { bliks: 789, friends: 312, superpowers: 18 },
      topSuperpowers: [
        { name: 'Финансовые технологии', emoji: '💰', value: 97, energy: 95 },
        { name: 'Цифровой банкинг', emoji: '🏦', value: 94, energy: 91 },
        { name: 'Blockchain', emoji: '⛓️', value: 90, energy: 87 },
        { name: 'Кибербезопасность', emoji: '🔒', value: 92, energy: 89 },
        { name: 'UX финансов', emoji: '📱', value: 88, energy: 85 }
      ]
    },

    // НОВЫЙ БИЗНЕС-ПРОФИЛЬ: Пекарня Цех85
    'tsekh85-bakery': {
      id: 'tsekh85-bakery',
      name: 'Цех85',
      status: 'Artisan Bakery & Pastry Shop',
      location: 'Москва, Россия',
      bio: 'Семейная пекарня с более чем 10-летним опытом. Мы создаем авторские булочки, круассаны и хлеб по традиционным рецептам с современным подходом. Каждое утро свежая выпечка готовится с любовью и заботой о наших клиентах.',
      avatar: tsekh85Logo,
      backgroundImage: 'https://images.unsplash.com/photo-1666019077186-2497e35531d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyNDQ1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'Цех85',
        industry: 'Пищевая промышленность и общественное питание',
        founded: '2014',
        employees: '11-50 сотрудников',
        revenue: '10-50 млн ₽',
        description: 'Семейная артизанская пекарня с авторскими рецептами',
        website: 'https://tsekh85.ru',
        phone: '+7 (495) 789-85-85',
        email: 'hello@tsekh85.ru',
        verified: true,
        verificationDate: '25 января 2025',
        verificationDocuments: []
      },
      metrics: { bliks: 567, friends: 298, superpowers: 14 },
      // Бизнес-суперсилы пекарни на основе 7 категорий
      topSuperpowers: [
        // Style - Эстетика продукта и визуальная подача
        { name: 'Авторская подача выпечки', emoji: '🎨', value: 95, energy: 92 },
        { name: 'Визуальная эстетика', emoji: '📸', value: 89, energy: 87 },
        
        // Drive - Маркетинг и продажи
        { name: 'Клиентский сервис', emoji: '⚡', value: 93, energy: 90 },
        { name: 'Локальный маркетинг', emoji: '📢', value: 85, energy: 83 },
        
        // Soul - Традиции и ценности
        { name: 'Семейные традиции', emoji: '💜', value: 96, energy: 94 },
        { name: 'Забота о клиентах', emoji: '❤️', value: 91, energy: 88 },
        
        // Mind - Инновации и рецепты
        { name: 'Авторские рецепты', emoji: '🧠', value: 88, energy: 85 },
        { name: 'Инновации в выпечке', emoji: '💡', value: 82, energy: 79 },
        
        // Body - Качество продукт��
        { name: 'Качество ингредиентов', emoji: '💪', value: 97, energy: 95 },
        { name: 'Свежесть продукции', emoji: '🌟', value: 94, energy: 91 },
        
        // Flow - Операционная эффективность
        { name: 'Производственный процесс', emoji: '🌊', value: 86, energy: 84 },
        { name: 'Управление поставками', emoji: '📦', value: 83, energy: 81 },
        
        // Crew - Команда пекарей
        { name: 'Профессиональная команда', emoji: '���', value: 90, energy: 87 },
        { name: 'Мастерство пекарей', emoji: '👨‍🍳', value: 98, energy: 96 }
      ]
    },

    // ГЛАВНЫЙ БИЗНЕС-ПРОФИЛЬ: NeoTech Solutions
    'neotech-solutions': {
      id: 'neotech-solutions',
      name: 'NeoTech Solutions',
      status: 'AI-powered Software Development Company',
      location: 'Москва, Россия',
      bio: 'Мы создаем передовые AI-решения для бизнеса. Наша команда разрабатывает инновационные программные продукты, которые автоматизируют процессы и повышают эффективность компаний. Специализи��уемся на машинном обучении, чат-ботах и системах аналитики.',
      avatar: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=100&h=100&fit=crop&crop=center',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY3liZXJwdW5rfGVufDF8fHx8MTc1ODI0NjA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      isOnline: true,
      profileType: 'business' as ProfileType,
      businessInfo: {
        companyName: 'NeoTech Solutions',
        industry: 'Технологии и IT',
        founded: '2019',
        employees: '51-200 сотрудников',
        revenue: '100 млн - 1 млрд ₽',
        description: 'AI-powered разработка программного обеспечения',
        website: 'https://neotech-solutions.ru',
        phone: '+7 (495) 123-45-67',
        email: 'hello@neotech-solutions.ru',
        verified: true,
        verificationDate: '15 декабря 2024',
        verificationDocuments: []
      },
      metrics: { bliks: 892, friends: 156, superpowers: 15 },
      // Бизнес-суперсилы на основе 7 категорий
      topSuperpowers: [
        // Flow - Операционная эффективность
        { name: 'Автомати��ация процессов', emoji: '🌊', value: 96, energy: 94 },
        { name: 'Agile-методологии', emoji: '🔄', value: 89, energy: 91 },
        
        // Mind - Инновации и стратегия
        { name: 'Искусственный интеллект', emoji: '🧠', value: 98, energy: 96 },
        { name: 'Машинное обучение', emoji: '🤖', value: 94, energy: 92 },
        { name: 'Инновационные решения', emoji: '💡', value: 91, energy: 88 },
        
        // Crew - Команда и культура
        { name: 'К��мандное лидерство', emoji: '👥', value: 85, energy: 83 },
        { name: 'Техническая экспертиза', emoji: '👨‍💻', value: 93, energy: 90 },
        
        // Style - Дизайн и UX
        { name: 'Пользовательский опыт', emoji: '🎨', value: 87, energy: 85 },
        { name: 'Интерфейсы будущего', emoji: '✨', value: 82, energy: 79 },
        
        // Drive - Маркетинг и продажи
        { name: 'Продажи B2B', emoji: '⚡', value: 79, energy: 77 },
        { name: 'Клиентский сервис', emoji: '🎯', value: 88, energy: 86 },
        
        // Body - Финансовая мощь
        { name: 'Масштабирование бизнеса', emoji: '💪', value: 84, energy: 82 },
        { name: 'Финансовая устойчивость', emoji: '📈', value: 86, energy: 84 },
        
        // Soul - Брендинг и ценности
        { name: 'Корпоративная культура', emoji: '💜', value: 81, energy: 78 },
        { name: 'Технологическая миссия', emoji: '🌟', value: 83, energy: 80 }
      ]
    }
  }), []);

  // Оптимизированный список популярных пользователей
  const popularUsers = useMemo(() => [
    {
      id: '1',
      name: 'Алексей Корнеев',
      avatar: alexeyAvatarImage,
      isOnline: true,
      recentBliks: 15,
      hasNewContent: true
    },
    {
      id: '2',
      name: 'Мария Смирнова',
      avatar: mariaAvatarImage,
      isOnline: false,
      recentBliks: 12,
      hasNewContent: true
    },
    {
      id: '3',
      name: 'Игорь Волков',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 8,
      hasNewContent: false
    },
    {
      id: '4',
      name: 'Елена Рыбакова',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 22,
      hasNewContent: true
    },
    {
      id: '5',
      name: '��митрий Козлов',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 6,
      hasNewContent: false
    },
    {
      id: '6',
      name: 'Анна Петрова',
      avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 18,
      hasNewContent: true
    },
    {
      id: '7',
      name: 'Сергей Иванов',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 9,
      hasNewContent: false
    },
    {
      id: '8',
      name: 'Ольга Морозова',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 25,
      hasNewContent: true
    },
    {
      id: '9',
      name: 'Максим Федоров',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 13,
      hasNewContent: true
    },
    {
      id: '10',
      name: 'Светлана Белова',
      avatar: 'https://images.unsplash.com/photo-1592334873219-42ca023e48ce?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 16,
      hasNewContent: false
    },
    {
      id: '11',
      name: 'Павел Сидоров',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 7,
      hasNewContent: false
    },
    {
      id: '12',
      name: 'Татьяна Зайцева',
      avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 21,
      hasNewContent: true
    },
    {
      id: '13',
      name: 'Андрей Николаев',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 19,
      hasNewContent: true
    },
    {
      id: '14',
      name: 'Валентина Орлова',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 11,
      hasNewContent: true
    },
    {
      id: '15',
      name: 'Руслан Ков��лев',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 14,
      hasNewContent: false
    },
    {
      id: '16',
      name: 'Наталья Белова',
      avatar: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 26,
      hasNewContent: true
    },
    {
      id: '17',
      name: 'Виктор Соколов',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      recentBliks: 4,
      hasNewContent: false
    },
    {
      id: '18',
      name: 'Карина Васильева',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      recentBliks: 17,
      hasNewContent: true
    },
    {
      id: '19',
      name: 'NeoTech Solutions',
      avatar: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=100&h=100&fit=crop&crop=center',
      isOnline: true,
      recentBliks: 28,
      hasNewContent: true,
      profileType: 'business' as const
    },
    {
      id: '20',
      name: 'InnovaCorp',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      isOnline: false,
      recentBliks: 12,
      hasNewContent: true,
      profileType: 'business' as const
    },
    {
      id: '21',
      name: 'Pixel Perfect Studio',
      avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center',
      isOnline: true,
      recentBliks: 18,
      hasNewContent: true,
      profileType: 'business' as const
    },
    {
      id: '22',
      name: 'FinFlow Solutions',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
      isOnline: true,
      recentBliks: 24,
      hasNewContent: true,
      profileType: 'business' as const
    },
    {
      id: '23',
      name: 'Цех85',
      avatar: tsekh85Logo,
      isOnline: true,
      recentBliks: 32,
      hasNewContent: true,
      profileType: 'business' as const // Добавляем явную метку типа профиля
    }
  ], []);

  // Мемоизированные блики для ленты - убираем мегаблики
  const feedBliks = useMemo(() => {
    return [...receivedBliks, ...sentBliks].sort((a, b) => {
      const timeA = a.timestamp.includes('час') ? 1 : a.timestamp.includes('день') ? 24 : 1;
      const timeB = b.timestamp.includes('час') ? 1 : b.timestamp.includes('день') ? 24 : 1;
      return timeA - timeB;
    });
  }, [receivedBliks, sentBliks]);

  // Мемоизированный список друзей
  const friends = useMemo(() => [
    { id: '1', name: 'Алексей Корнеев', avatar: alexeyAvatarImage, isOnline: true },
    { id: '2', name: 'Мария Смирнова', avatar: mariaAvatarImage, isOnline: false },
    { id: '3', name: 'Игорь Волков', avatar: 'https://images.unsplash.com/photo-1723747338983-da5fd1d09904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjaGVmJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTg5fDA&ixlib=rb-4.1.0&q=80&w=400', isOnline: true },
    { id: '4', name: 'Елена Рыбакова', avatar: 'https://images.unsplash.com/photo-1736697027030-d3407ffc7c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGluc3RydWN0b3IlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTE4OXww&ixlib=rb-4.1.0&q=80&w=400', isOnline: true },
    { id: '5', name: 'Дмитрий Козлов', avatar: 'https://images.unsplash.com/photo-1614273144956-a93d12cd3318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU5NzE4OXww&ixlib=rb-4.1.0&q=80&w=400', isOnline: false }
  ], []);

  // Мемоизированный список пользователей для поиска
  const searchableUsers = useMemo(() => 
    Object.values(otherUsersDatabase).map(user => ({
      id: user.id,
      name: user.name,
      status: user.status,
      avatar: user.avatar,
      isOnline: user.isOnline,
      metrics: user.metrics,
      profileType: user.profileType || 'personal', // Добавляем тип профиля
      businessInfo: user.businessInfo // Добавляем бизнес-информацию
    })), []);

  // Расширенные данные для экрана друзей
  const friendsList = [
    {
      id: 'alexey-korneev',
      name: 'Алексей Корнеев',
      avatar: alexeyAvatarImage,
      status: 'Senior Frontend Developer',
      isOnline: true,
      mutualFriends: 12,
      isClose: true,
      lastActivity: 'сейчас',
      metrics: { bliks: 324, friends: 45, superpowers: 8 },
      activityScore: 92,
      topSuperpowers: [
        { name: 'Программирование', emoji: '💻', value: 95, energy: 92 },
        { name: 'Лидерство', emoji: '⭐', value: 82, energy: 85 },
        { name: 'Креативность', emoji: '🧠', value: 78, energy: 78 }
      ]
    },
    {
      id: 'maria-smirnova',
      name: 'Мария Смирнова',
      avatar: mariaAvatarImage,
      status: 'Creative Photographer',
      isOnline: false,
      mutualFriends: 8,
      isClose: true,
      lastActivity: '2 ч назад',
      metrics: { bliks: 267, friends: 38, superpowers: 6 },
      activityScore: 78,
      topSuperpowers: [
        { name: 'Фотография', emoji: '📸', value: 92, energy: 85 },
        { name: 'Креативность', emoji: '🧠', value: 85, energy: 88 },
        { name: 'Стиль', emoji: '❄️', value: 79, energy: 82 }
      ]
    },
    {
      id: 'igor-volkov',
      name: 'Игорь Волков',
      avatar: 'https://images.unsplash.com/photo-1723747338983-da5fd1d09904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjaGVmJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTg5fDA&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Professional Chef',
      isOnline: true,
      mutualFriends: 5,
      isClose: false,
      lastActivity: '15 мин назад',
      metrics: { bliks: 189, friends: 29, superpowers: 5 },
      activityScore: 65,
      topSuperpowers: [
        { name: 'Кулинария', emoji: '👨‍🍳', value: 94, energy: 78 },
        { name: 'Креативность', emoji: '🧠', value: 76, energy: 72 }
      ]
    },
    {
      id: 'elena-rybakova',
      name: 'Елена Рыбакова',
      avatar: 'https://images.unsplash.com/photo-1736697027030-d3407ffc7c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMGluc3RydWN0b3IlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTE4OXww&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Dance Instructor',
      isOnline: true,
      mutualFriends: 15,
      isClose: true,
      lastActivity: 'сейчас',
      metrics: { bliks: 298, friends: 52, superpowers: 7 },
      activityScore: 94,
      topSuperpowers: [
        { name: 'Танцы', emoji: '💃', value: 96, energy: 91 },
        { name: 'Энергичность', emoji: '⚡', value: 89, energy: 94 },
        { name: 'Харизма', emoji: '👑', value: 84, energy: 87 }
      ]
    },
    {
      id: 'dmitry-kozlov',
      name: 'Дмитрий Козлов',
      avatar: 'https://images.unsplash.com/photo-1614273144956-a93d12cd3318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU5NzE4OXww&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Music Producer',
      isOnline: false,
      mutualFriends: 3,
      isClose: false,
      lastActivity: '1 день назад',
      metrics: { bliks: 156, friends: 34, superpowers: 4 },
      activityScore: 43,
      topSuperpowers: [
        { name: 'Музыка', emoji: '🎵', value: 91, energy: 67 },
        { name: 'Креативность', emoji: '🧠', value: 82, energy: 74 }
      ]
    },
    {
      id: 'anna-petrova',
      name: 'Анна Петрова',
      avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRlc2lnbmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MTAyMDEyfDA&ixlib=rb-4.1.0&q=80&w=400',
      status: 'UX/UI Designer & Digital Artist',
      isOnline: true,
      mutualFriends: 18,
      isClose: true,
      lastActivity: 'сейчас',
      metrics: { bliks: 445, friends: 67, superpowers: 9 },
      activityScore: 96,
      topSuperpowers: [
        { name: 'Дизайн', emoji: '🎨', value: 96, energy: 89 },
        { name: 'Креативность', emoji: '🧠', value: 91, energy: 94 },
        { name: 'Визуальное мышление', emoji: '👁️', value: 87, energy: 85 }
      ]
    },
    {
      id: 'sergey-volkov',
      name: 'Сергей Волков',
      avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhdGhsZXRlJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTk2fDA&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Extreme Sports Athlete',
      isOnline: true,
      mutualFriends: 25,
      isClose: true,
      lastActivity: 'сейчас',
      metrics: { bliks: 356, friends: 89, superpowers: 11 },
      activityScore: 88,
      topSuperpowers: [
        { name: 'Экстремальные виды спорта', emoji: '🏔️', value: 98, energy: 97 },
        { name: 'Смелость', emoji: '🦁', value: 95, energy: 91 },
        { name: 'Физическая подготовка', emoji: '💪', value: 93, energy: 88 }
      ]
    },
    {
      id: 'olga-marinova',
      name: 'Ольга Маринова',
      avatar: 'https://images.unsplash.com/photo-1756588534346-e8899364757b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpc3QlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTA1NTE5Nnww&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Marine Biologist & Ocean Explorer',
      isOnline: false,
      mutualFriends: 14,
      isClose: true,
      lastActivity: '3 ч назад',
      metrics: { bliks: 278, friends: 54, superpowers: 8 },
      activityScore: 71,
      topSuperpowers: [
        { name: 'Исследования', emoji: '🔬', value: 94, energy: 86 },
        { name: 'Экология', emoji: '🌊', value: 92, energy: 89 },
        { name: 'Научное мышление', emoji: '🧬', value: 88, energy: 84 }
      ]
    },
    {
      id: 'maxim-stellar',
      name: 'Максим Стеллар',
      avatar: 'https://images.unsplash.com/photo-1598596932689-31a0512bf127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZW50cmVwcmVuZXVyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MDU1MTk2fDA&ixlib=rb-4.1.0&q=80&w=400',
      status: 'Astrophysicist & Space Researcher',
      isOnline: true,
      mutualFriends: 22,
      isClose: true,
      lastActivity: '1 ч назад',
      metrics: { bliks: 523, friends: 78, superpowers: 12 },
      activityScore: 89,
      topSuperpowers: [
        { name: 'Астрофизика', emoji: '🌌', value: 97, energy: 92 },
        { name: 'Научные исследования', emoji: '🔭', value: 95, energy: 88 },
        { name: 'Популяризация науки', emoji: '⭐', value: 89, energy: 86 }
      ]
    }
  ];

  // Трендинговые суперсилы
  const trendingSuperpowers = [
    { name: 'Креативность', emoji: '💡', currentBliks: 156, previousBliks: 134, trendPercentage: 16, trendDirection: 'up' as const, category: 'Mind', isHot: true },
    { name: 'Харизма', emoji: '👑', currentBliks: 142, previousBliks: 98, trendPercentage: 45, trendDirection: 'up' as const, category: 'Соул', isHot: true },
    { name: 'Лидерство', emoji: '⭐', currentBliks: 128, previousBliks: 115, trendPercentage: 11, trendDirection: 'up' as const, category: 'Соул' },
    { name: 'Крутой стиль', emoji: '❄️', currentBliks: 119, previousBliks: 132, trendPercentage: -10, trendDirection: 'down' as const, category: 'Mind' },
    { name: 'Энергичность', emoji: '⚡', currentBliks: 95, previousBliks: 89, trendPercentage: 7, trendDirection: 'up' as const, category: 'Тело' },
    { name: 'Решение проблем', emoji: '💪', currentBliks: 87, previousBliks: 103, trendPercentage: -16, trendDirection: 'down' as const, category: 'Флоу' },
    { name: 'Эмпатия', emoji: '💖', currentBliks: 76, previousBliks: 76, trendPercentage: 0, trendDirection: 'stable' as const, category: 'Соул' },
    { name: 'Командная работа', emoji: '🤝', currentBliks: 68, previousBliks: 54, trendPercentage: 26, trendDirection: 'up' as const, category: 'Флоу' }
  ];

  // 🎯 УПРОЩЕННАЯ СИСТЕМА: Получение бликов по типу суперсилы - только персональные и бизнес
  const getBliksForSuperpower = useCallback((superpowerName: string, type: 'personal' | 'business', ownerId?: string) => {
    const allBliks = [...receivedBliks, ...sentBliks];
    
    switch (type) {
      case 'personal':
        // Для персональных суперсил показываем только блики конкретн��го пользователя
        if (ownerId) {
          // Сначала проверяем общие блики
          let userBliks = allBliks.filter(blik => 
            blik.superpower.name === superpowerName && 
            (blik.author.name === ownerId || blik.recipient.name === ownerId)
          );
          
          // Если это другой пользователь, также проверяем его специфичные блики
          if (selectedOtherUser && ownerId === selectedOtherUser.name) {
            const otherUserSpecificBliks = otherUsersBliks[selectedOtherUser.id] || [];
            const additionalBliks = otherUserSpecificBliks.filter(blik => 
              blik.superpower.name === superpowerName &&
              !userBliks.some(existingBlik => existingBlik.id === blik.id) // Избегаем дубликатов
            );
            userBliks = [...userBliks, ...additionalBliks];
          }
          
          return userBliks;
        }
        return [];

      case 'business':
        // Для бизнес-суперсил показываем блики конкретной компани�� 
        if (ownerId) {
          let businessBliks = allBliks.filter(blik => 
            blik.superpower.name === superpowerName && 
            (blik.author.name === ownerId || blik.recipient.name === ownerId)
          );
          
          // Если это бизнес-пользователь, добавляем его специфичные блики
          if (selectedOtherUser && selectedOtherUser.businessInfo?.companyName === ownerId) {
            const businessSpecificBliks = otherUsersBliks[selectedOtherUser.id] || [];
            const additionalBliks = businessSpecificBliks.filter(blik => 
              blik.superpower.name === superpowerName &&
              !businessBliks.some(existingBlik => existingBlik.id === blik.id) // Избегаем дубликатов
            );
            businessBliks = [...businessBliks, ...additionalBliks];
          }
          
          return businessBliks;
        }
        return [];
        
      default:
        return [];
    }
  }, [receivedBliks, sentBliks, otherUsersBliks, selectedOtherUser]);

  // УБИРАЕМ ФУНКЦИЮ МЕГАСИЛ - теперь только персональные и бизнес-суперсилы

  // 🔄 ИСПРАВЛЕННАЯ ЛОГИКА: Определение типа суперсилы с поддержкой других пользователей
  const getSuperpowerType = useCallback((superpowerName: string, context?: 'user-profile' | 'business-profile' | 'library' | 'other-user') => {
    console.log(`🔍 Определяем тип суперсилы "${superpowerName}" в контексте "${context}"`);
    
    // 🎯 ПРИОРИТЕТ 1: Персональные суперсилы текущего пользователя
    if (context === 'user-profile' || context === 'library' || (context !== 'other-user' && !selectedOtherUser)) {
      const personalSuperpower = userSuperpowers.find(sp => sp.name === superpowerName);
      if (personalSuperpower) {
        console.log(`✅ Найдена персональная суперсила текущего пользователя: ${superpowerName}`);
        return { type: 'personal' as const, data: personalSuperpower };
      }
    }
    
    // 🎯 ПРИОРИТЕТ 2: Персональные суперсилы другого пользователя (если смотрим чужой профиль)
    if (context === 'other-user' && selectedOtherUser) {
      const otherUserSuperpower = selectedOtherUser.topSuperpowers.find(sp => sp.name === superpowerName);
      if (otherUserSuperpower) {
        console.log(`✅ Найдена персональная суперсила другого пользователя "${selectedOtherUser.name}": ${superpowerName}`);
        // Создаем объект суперсилы в нужном формате
        const formattedSuperpower = {
          id: `other-${selectedOtherUser.id}-${superpowerName}`,
          name: otherUserSuperpower.name,
          emoji: otherUserSuperpower.emoji,
          bliks: otherUserSuperpower.value,
          energy: otherUserSuperpower.energy,
          trend: otherUserSuperpower.energy > 80 ? 'up' as const : otherUserSuperpower.energy < 40 ? 'down' as const : 'stable' as const,
          category: 'Mind', // Упрощенно для других пользователей
          type: 'personal' as const,
          ownerName: selectedOtherUser.name,
          ownerAvatar: selectedOtherUser.avatar
        };
        return { type: 'personal' as const, data: formattedSuperpower };
      }
    }
    
    // 🎯 ПРИОРИТЕТ 3: Бизнес-суперсилы (для бизнес-профилей)
    if (context === 'business-profile') {
      // Сначала проверяем, это бизнес-профиль текущего пользователя
      if (user.profileType === 'business' && !selectedOtherUser) {
        const userBusinessSuperpower = user.topSuperpowers.find(sp => sp.name === superpowerName);
        if (userBusinessSuperpower) {
          console.log(`✅ Найдена бизнес-суперсила текущего пользователя \"${user.name}\": ${superpowerName}`);
          const formattedBusinessSuperpower = {
            id: `business-current-${superpowerName}`,
            name: userBusinessSuperpower.name,
            emoji: userBusinessSuperpower.emoji,
            bliks: userBusinessSuperpower.value,
            energy: userBusinessSuperpower.energy,
            trend: userBusinessSuperpower.energy > 80 ? 'up' as const : userBusinessSuperpower.energy < 40 ? 'down' as const : 'stable' as const,
            category: 'Mind',
            type: 'business' as const,
            companyName: user.businessInfo?.companyName || user.name,
            companyId: 'current-user'
          };
          return { type: 'business' as const, data: formattedBusinessSuperpower };
        }
      }
      
      // Затем проверяем бизнес-суперсилы из глобальной базы данных
      const businessSuperpower = businessSuperpowers.find(sp => sp.name === superpowerName);
      if (businessSuperpower) {
        console.log(`✅ Найдена бизнес-суперсила: ${superpowerName}`);
        return { type: 'business' as const, data: businessSuperpower };
      }
      
      // Для бизнес-профилей других пользователей проверяем их топ суперсилы
      if (selectedOtherUser && selectedOtherUser.profileType === 'business') {
        const businessUserSuperpower = selectedOtherUser.topSuperpowers.find(sp => sp.name === superpowerName);
        if (businessUserSuperpower) {
          console.log(`✅ Найдена бизнес-суперсила пользователя "${selectedOtherUser.name}": ${superpowerName}`);
          const formattedBusinessSuperpower = {
            id: `business-${selectedOtherUser.id}-${superpowerName}`,
            name: businessUserSuperpower.name,
            emoji: businessUserSuperpower.emoji,
            bliks: businessUserSuperpower.value,
            energy: businessUserSuperpower.energy,
            trend: businessUserSuperpower.energy > 80 ? 'up' as const : businessUserSuperpower.energy < 40 ? 'down' as const : 'stable' as const,
            category: 'Mind',
            type: 'business' as const,
            companyName: selectedOtherUser.businessInfo?.companyName || selectedOtherUser.name,
            companyId: selectedOtherUser.id
          };
          return { type: 'business' as const, data: formattedBusinessSuperpower };
        }
      }
    }
    
    // УБИРАЕМ МЕГАСИЛЫ - теперь только персональные и бизнес-суперсилы
    
    console.warn(`❌ Суперсила "${superpowerName}" не найдена ни в одном типе (контекст: "${context}", selectedOtherUser: ${selectedOtherUser?.name || 'none'})`);
    return null;
  }, [userSuperpowers, businessSuperpowers, selectedOtherUser, user.profileType, user.name, user.topSuperpowers, user.businessInfo]);

  // Функция для получения данных детального экрана суперсилы
  const getSuperpowerDetails = (superpowerName: string) => {
    const predefinedDetails: Record<string, { description: string }> = {
    'Креативность': {
      description: 'Способность генерировать оригинальные идеи и находить нестандартные решения. Эта суперсила помогает создавать уникальный контент и вдохновлять других.'
    },
    'Контент-маркетинг': {
      description: 'Мастерство создания вовлекающего контента и эффектив��ых маркетинговых стратегий. Умение рассказывать истор��и бренда так, чтобы они находили отклик у аудитории.',
    },
    'Межличностное общение': {
      description: 'Искусство выстраивать глубокие и значимые отношения с людьми. Способность понимать других, эффективно коммуницировать и создавать атмосферу доверия.',
    },
    'Харизма': {
      description: 'Природная способность притягивать и вдохновля��ь людей. Харизматичные личности легко завоевывают довери�� и влияют на окружающих своей э����ргетикой.',
    },
    'Крутой стиль': {
      description: 'Безупречное чувство стиля и эстетики. Способность создавать уникальные образы и вдохновлять других на самовыражение через внешний вид.',
    },
    'Лидерство': {
      description: 'Умение вести за собой людей, принимать важные решения и брать ответственность. Лидеры создают видение будущего и мотивируют команду его достигать.',
    },
    'Энергичность': {
      description: 'Неиссякаемый источник энергии и позитива. Энергичные люди заряжают окружающих оптимизмом и готовностью к действию.',
    },
    'Решение проблем': {
      description: 'Аналитический подход к сложным ситуациям и способность находить эффективные решения. Превращение проблем в возможности.',
    },
    'Командная работа': {
      description: 'Способность эффективно работать в команде, находить общий язык с разными людьми и создавать синергию для достижения общих целей.',
    },
    'Эмоциональная поддержка': {
      description: 'Умение понимать эмоции других людей и оказывать своевременную психологическую поддержку. Создание атмосферы доверия и понимания.',
    },
    'Занятия спортом': {
      description: 'Преданность активному образу жизни и физическому развитию. Мотивация других на здоровые привычки и спортивные достижения.',
    },
    'Программирование': {
      description: 'Искусство создания элегантного и эффективного кода. Решение сложных технических задач и воплощение идей в цифровые продукты.',
    },
    'Фотография': {
      description: 'Умение видеть красоту в обыденном и запечатлевать мгновения. Создание визуальных историй, которые трогают сердц��.',
    },
    'Кулинария': {
      description: 'Мастерство превращения простых ингредиентов в кулинарные шедевры. Создание атмосферы уюта и заботы через еду.',
    },
    'Танцы': {
      description: 'Способность выражать эмоции через дви��ение. Владение телом как инструментом для создания красоты и вдохновения.',
    },
    'Музыка': {
      description: 'Дар создавать гарм��нию звуков, которая касается души. Способ��ость передавать чувства и создавать атмосферу через мелодии.',
    },
      'Публичные выступления': {
        description: 'Умение уверенно выступать перед аудиторией и эффективно доносить свои идеи. Способность вдохновлять и убеждать людей через речь.'
      },
      'Концентрация': {
        description: 'Способность фокусироваться на задаче и поддерживать внимание в течение длительного времени. Ключ к глубокой работе и высоким результатам.'
      },
      'Тайм-менеджмент': {
        description: 'Искусство эффективного управления временем и приоритетами. Способность достигать боль��е за меньшее время без потери качества.'
      }
    };

    // Если есть предопределенное описание, используем его
    if (predefinedDetails[superpowerName]) {
      return {
        description: predefinedDetails[superpowerName].description
      };
    }

    // Для новых суперсил генерируем общее описание
    return {
      description: `Уникальная суперсила "${superpowerName}", которая делает тебя особенным и помогает достигать новых высот. Эта способность ��тражает твою индивидуальность и потенциал для роста.`
    };
  };

  const handleAddBlik = () => {
    toast.success('Блик добавлен! ✨');
  };

  const handleViewBliks = () => {
    setCurrentScreen('bliks');
  };

  const handleLikeBlik = (blikId: string) => {
    // Функция для обновления лайка
    const updateBlikLike = (blik: any) => {
      if (blik.id === blikId) {
        const isCurrentlyLiked = blik.isLiked;
        const newLikesCount = isCurrentlyLiked ? blik.likes - 1 : blik.likes + 1;
        
        // Обновляем список лайкнувших
        let newLikedBy = [...(blik.likedBy || [])];
        const userLike = { name: user.name, avatar: user.avatarImage };
        
        if (isCurrentlyLiked) {
          // Убираем лайк
          newLikedBy = newLikedBy.filter(like => like.name !== user.name);
        } else {
          // Добавляем лайк в начало списка
          newLikedBy.unshift(userLike);
        }

        return {
          ...blik,
          isLiked: !isCurrentlyLiked,
          likes: newLikesCount,
          likedBy: newLikedBy
        };
      }
      return blik;
    };

    // Обновляем все коллекции бликов
    setReceivedBliks(prev => prev.map(updateBlikLike));
    setSentBliks(prev => prev.map(updateBlikLike));

    // Обновляем selectedBlik если он открыт
    if (selectedBlik && selectedBlik.id === blikId) {
      setSelectedBlik(prev => prev ? updateBlikLike(prev) : null);
    }

    // Создаём уведомление для автора блика (если это не наш блик)
    const blik = [...receivedBliks, ...sentBliks].find(b => b.id === blikId);
    if (blik && blik.author.name !== user.name) {
      // В реальном приложении здесь будет отправка уведомления через API
      // Для демо создаем уведомление только если ставим лайк не своему блику
    }

    toast.success('Лайк! ❤️');
  };

  const handleCommentBlik = (blikId: string) => {
    // Ищем блик в общих бликах, бликах отправленных и в бликах выбранного пользователя
    let blik = [...receivedBliks, ...sentBliks].find(b => b.id === blikId);
    
    // Если не нашли в общих бликах, ищем в бликах выбранного другого пользователя
    if (!blik && selectedOtherUser) {
      const otherUserBliks = otherUsersBliks[selectedOtherUser.id] || [];
      blik = otherUserBliks.find(b => b.id === blikId);
    }
    
    if (blik) {
      setSelectedBlik(blik);
      setCurrentScreen('blik-detail');
    } else {
      toast.success('Комментарии открыты! 💬');
    }
  };

  const handleBlikDetail = (blikId: string) => {
    // Ищем блик в общих бликах, бликах отправленных и в бликах выбранного пользователя
    let blik = [...receivedBliks, ...sentBliks].find(b => b.id === blikId);
    
    // Если не нашли в общих бликах, ищем в бликах выбранного другого пользователя
    if (!blik && selectedOtherUser) {
      const otherUserBliks = otherUsersBliks[selectedOtherUser.id] || [];
      blik = otherUserBliks.find(b => b.id === blikId);
    }
    
    if (blik) {
      setSelectedBlik(blik);
      setCurrentScreen('blik-detail');
    }
  };

  const handleAddComment = (blikId: string, comment: string) => {
    // Создаем новый комментарий
    const newComment = {
      id: Date.now().toString(),
      author: {
        name: user.name,
        avatar: user.avatarImage
      },
      content: comment,
      timestamp: 'только что'
    };

    // Функция для обновления блика с новым комментарием
    const updateBlikWithComment = (blik: any) => {
      if (blik.id === blikId) {
        return {
          ...blik,
          comments: blik.comments + 1,
          commentsList: [newComment, ...(blik.commentsList || [])]
        };
      }
      return blik;
    };

    // Обновляем receivedBliks
    setReceivedBliks(prev => prev.map(updateBlikWithComment));
    
    // Обновляем sentBliks
    setSentBliks(prev => prev.map(updateBlikWithComment));

    // Обновляем selectedBlik если он открыт
    if (selectedBlik && selectedBlik.id === blikId) {
      setSelectedBlik(prev => prev ? updateBlikWithComment(prev) : null);
    }

    toast.success(`Комментарий добавлен: "${comment}" 💬`);
  };

  const handleShareBlik = (blikId: string) => {
    toast.success('Блик поделился! 🔗');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
    setIsSidebarOpen(false); // Закрываем сайдбар при переходе в настройки
  };

  const handleSaveSettings = (updatedUserData: Partial<typeof user>) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
    setCurrentScreen('profile');
  };

  const handleChat = () => {
    toast.success('Сообщения открыты! 💬');
  };

  const handleViewFriends = () => {
    setCurrentScreen('friends');
    setIsSidebarOpen(false); // Закрываем сайдбар при переходе в экран друзей
  };

  const handleShare = () => {
    toast.success('Ссылка скопирована в буфер обмена! 🔗');
  };

  const handleShareMap = () => {
    toast.success('Карта ценности поделилась! 📊✨');
  };

  const handleAddFriend = () => {
    toast.success('Заявка в друзья отправлена! 👋');
  };

  const handleSubscribe = () => {
    toast.success('Вы подписались на уведомления! 🔔');
  };

  const handleViewMap = () => {
    setCurrentScreen('value-map');
    setActiveTab('profile');
  };

  const handleViewPersonalSite = () => {
    setPersonalSiteTab('about'); // Открываем вкладку "О себе"
    setCurrentScreen('personal-site');
    setActiveTab('profile');
  };

  const handleViewBlog = () => {
    setPersonalSiteTab('blog'); // Открываем вкладку блога
    setCurrentScreen('personal-site');
    setActiveTab('profile');
  };

  // 🔔 ОБРАБОТЧИКИ УВЕДОМЛЕНИЙ
  const handleNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleNotificationClick = (notification: Notification) => {
    // Отмечаем как прочитанное
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }

    // Переходим на соответствующий экран в зависимости от типа уведомления
    if (notification.blikId) {
      // Открываем блик
      const blik = [...receivedBliks, ...sentBliks].find(b => b.id === notification.blikId);
      if (blik) {
        setSelectedBlik(blik);
        setCurrentScreen('blik-detail');
      }
    } else if (notification.userId) {
      // Открываем профиль пользователя
      handleUserProfile(notification.userId);
    } else if (notification.superpowerName) {
      // Открываем суперсилу
      handleSuperpowerSelect(notification.superpowerName);
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('Все уведомления отмечены как прочитанные ✅');
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Уведомление удалено 🗑️');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success('Все уведомления очищены 🗑️');
  };

  // Функция для добавления нового уведомления
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: 'только что'
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // 🎯 ИСПРАВЛЕННАЯ ЛОГИКА: Выбор суперсилы с сохранением источника перехода
  const [superpowerContext, setSuperpowerContext] = useState<{
    name: string;
    source: 'user-profile' | 'business-profile' | 'library' | 'other-user';
  } | null>(null);

  // Состояние для выбранной вкладки PersonalSiteScreen
  const [personalSiteTab, setPersonalSiteTab] = useState<'about' | 'professional' | 'contacts' | 'blog' | 'portfolio'>('about');

  const handleSuperpowerSelect = (superpowerName: string) => {
    console.log(`🚀 Выбрана суперсила "${superpowerName}" на экране "${currentScreen}"`);
    console.log(`🔍 Текущее состояние:`, {
      currentScreen,
      selectedOtherUser: selectedOtherUser?.name || 'none',
      userProfileType: user.profileType,
      userName: user.name
    });
    
    // Определяем контекст на основе текущего экрана
    let context: 'user-profile' | 'business-profile' | 'library' | 'other-user';
    
    if (currentScreen === 'profile') {
      context = user.profileType === 'business' ? 'business-profile' : 'user-profile';
    } else if (currentScreen === 'library') {
      context = 'library';
    } else if (currentScreen === 'other-profile' && selectedOtherUser) {
      context = selectedOtherUser.profileType === 'business' ? 'business-profile' : 'other-user';
    } else if (currentScreen === 'value-map') {
      // Если переходим с карты ценностей - определяем по владельцу карты
      if (selectedOtherUser) {
        context = selectedOtherUser.profileType === 'business' ? 'business-profile' : 'other-user';
      } else {
        context = user.profileType === 'business' ? 'business-profile' : 'user-profile';
      }
    } else {
      // Для всех остальных случаев используем профиль текущего пользователя
      context = user.profileType === 'business' ? 'business-profile' : 'user-profile';
    }
    
    console.log(`📍 Определен контекст: "${context}" для экрана "${currentScreen}"`);
    
    // Определяем тип суперсилы
    const superpowerInfo = getSuperpowerType(superpowerName, context);
    
    if (!superpowerInfo) {
      console.warn(`❌ Суперсила "${superpowerName}" не найдена в контексте "${context}"`);
      toast.error('Суперсила не найдена');
      return;
    }
    
    console.log(`✅ Определен тип суперсилы: "${superpowerInfo.type}" для "${superpowerName}"`);
    
    // Сохраняем информацию о выбранной суперсиле и источнике перехода
    setSelectedSuperpower(superpowerName);
    setSuperpowerContext({ name: superpowerName, source: context });
    setCurrentScreen('detail');
    
    // Принудительно скроллим к верху при выборе суперсилы
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Также скроллим любые контейнеры с overflow
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
      scrollableContainers.forEach(container => {
        container.scrollTop = 0;
      });
    };
    
    // Немедленная прокрутка
    scrollToTop();
    
    // Дополнительные попытки с задержкой для гарантии
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 200);
  };

  const handleSuperpowerLibraryDetail = (superpowerName: string) => {
    console.log(`🚀 Выбрана суперсила "${superpowerName}" из библиотеки`);
    
    setSelectedSuperpower(superpowerName);
    setSuperpowerContext({ name: superpowerName, source: 'library' });
    setCurrentScreen('detail');
    
    // Принудительно скроллим к верху при выборе суперсилы
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Также скроллим любые контейнеры с overflow
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
      scrollableContainers.forEach(container => {
        container.scrollTop = 0;
      });
    };
    
    scrollToTop();
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 200);
  };

  // Обработчики входящих бликов
  const handleAcceptBlik = useCallback((blikId: string) => {
    // Проверяем и в входящих, и в отклоненных
    const blik = incomingBliks.find(b => b.id === blikId) || declinedBliks.find(b => b.id === blikId);
    if (blik) {
      // Добавляем блик в полученные
      setReceivedBliks(prev => [blik, ...prev]);
      // Удаляем из входящих
      setIncomingBliks(prev => prev.filter(b => b.id !== blikId));
      // Удаляем из отклоненных (если восстанавливаем)
      setDeclinedBliks(prev => prev.filter(b => b.id !== blikId));
      toast.success('Блик принят! Теперь он появился в ленте ✨');
    }
  }, [incomingBliks, declinedBliks]);

  const handleDeclineBlik = useCallback((blikId: string) => {
    const blik = incomingBliks.find(b => b.id === blikId);
    if (blik) {
      // Перемещаем в отклоненные
      setDeclinedBliks(prev => [blik, ...prev]);
      // Удаляем из входящих
      setIncomingBliks(prev => prev.filter(b => b.id !== blikId));
      toast.success('Блик отклонен. Можешь восстановить его позже');
    }
  }, [incomingBliks]);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    // Очищаем контекст суперсилы при смене табов
    setSuperpowerContext(null);
    
    switch (tab) {
      case 'feed':
        setCurrentScreen('feed');
        break;
      case 'top':
        setCurrentScreen('top');
        break;
      case 'create':
        setCurrentScreen('create');
        break;
      case 'bliks':
        setCurrentScreen('incoming-bliks');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
    
    // Прокрутка к верху при смене табов
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Также скроллим любые контейнеры с overflow
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
      scrollableContainers.forEach(container => {
        container.scrollTop = 0;
      });
    };
    
    scrollToTop();
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
  };

  const handleCreateBlik = useCallback((data: {
    type: 'text' | 'photo' | 'video';
    content: string;
    recipientId: string;
    superpowerId: string;
    mediaUrl?: string;
  }) => {
    toast.success('Блик создан и отправлен! ✨');
    setCurrentScreen('feed');
    setActiveTab('feed');
  }, []);



  // 🎯 СОЗДАНИЕ ПЕРСОНАЛЬНОЙ СУПЕРСИЛЫ
  const handleCreateSuperpower = useCallback((data: {
    name: string;
    emoji: string;
    category: string;
  }) => {
    // Создаем новую персональную суперсилу для текущего пользователя
    const newSuperpower = {
      id: `user-${data.name}-${Date.now()}`,
      name: data.name,
      emoji: data.emoji,
      bliks: 1, // Начинаем с 1 блика
      energy: 100, // Максимальная энергия для новой суперсилы
      trend: 'up' as const,
      category: data.category,
      type: 'personal' as const,
      ownerName: user.name,
      ownerAvatar: user.avatarImage
    };

    // Добавляем в персональные суперсилы
    setUserSuperpowers(prev => [...prev, newSuperpower]);
    
    // Также добавляем в topSuperpowers пользователя
    setUser(prev => ({
      ...prev,
      topSuperpowers: [...prev.topSuperpowers, {
        name: data.name,
        emoji: data.emoji,
        value: 1,
        energy: 100
      }]
    }));

    toast.success(`Суперсила "${data.name}" ${data.emoji} создана! ✨`);
    return data.name; // Возвращаем название для выбора
  }, [user.name, user.avatarImage]);

  const handleUserProfile = (userId: string) => {
    // Проверяем, если это текущий пользователь - переходим на его профиль
    if (userId === user.name || userId === 'Risha Bliq') {
      setCurrentScreen('profile');
      setActiveTab('profile');
      return;
    }
    
    // Маппинг различных форматов ID/имен на ключи базы данных
    const userIdMap: Record<string, string> = {
      // Популярные пользователи (числовые ID)
      '1': 'alexey-korneev',
      '2': 'maria-smirnova', 
      '3': 'igor-volkov',
      '4': 'elena-rybakova',
      '5': 'dmitry-kozlov',
      '6': 'anna-petrova',
      '7': 'sergey-volkov',
      '8': 'olga-marinova',
      '9': 'maxim-stellar',
      '10': 'svetlana-belova',
      '11': 'pavel-sidorov',
      '12': 'tatiana-zaitseva',
      '13': 'andrey-nikolaev',
      '14': 'valentina-orlova',
      '15': 'ruslan-kovalev',
      '16': 'natalia-belova',
      '17': 'viktor-sokolov',
      '18': 'karina-vasilieva',
      '19': 'neotech-solutions',
      '20': 'innovacorp',
      '21': 'pixel-perfect-studio',
      '22': 'finflow-solutions',
      '23': 'tsekh85-bakery',
      
      // Сокращенные имена из б��иков
      'Алексей К.': 'alexey-korneev',
      'Мария С.': 'maria-smirnova',
      'Игорь В.': 'igor-volkov',
      'Елена Р.': 'elena-rybakova',
      'Дмитрий К.': 'dmitry-kozlov',
      'Артем В.': 'alexey-korneev', // Мапим на существующего пользоват��ля
      'Софья М.': 'maria-smirnova', // Мапи�� на существующего пользователя
      
      // Получатели из sentBliks
      'Максим Петров': 'maxim-stellar',
      'Анна Сидорова': 'anna-petrova',
      'Елена Смирнова': 'elena-rybakova',
      'Игорь Новиков': 'igor-volkov',
      'Ольга Кузнецова': 'olga-marinova',
      'Владимир Петрович': 'viktor-sokolov',
      
      // Авторы бликов для Цех85
      'Анна М.': 'anna-petrova',
      'Михаил П.': 'igor-volkov', // Мапим на существующего пользователя
      'Екатерина Л.': 'elena-rybakova',
      'Владимир С.': 'viktor-sokolov',
      'София К.': 'karina-vasilieva',
      'Дмитрий Р.': 'dmitry-kozlov',
      'Ирина Т.': 'tatiana-zaitseva',
      'Алексей М.': 'alexey-korneev',
      'Петр Н.': 'pavel-sidorov',
      'Марина Ф.': 'maria-smirnova',
      'Станислав Г.': 'sergey-volkov',
      'Наталья В.': 'natalia-belova',
      
      // Пол��ые имена
      'Алексей Корнеев': 'alexey-korneev',
      'Мария Смирнова': 'maria-smirnova',
      'Игорь Волков': 'igor-volkov',
      'Елена Рыбакова': 'elena-rybakova',
      'Дмитрий Козлов': 'dmitry-kozlov',
      'Анна Петро��а': 'anna-petrova',
      'Сергей Иванов': 'sergey-volkov',
      'Ольга Морозова': 'olga-marinova',
      'Максим Федоров': 'maxim-stellar',
      'Светлана Белова': 'svetlana-belova',
      'Павел Сидоров': 'pavel-sidorov',
      'Татьяна Зайцева': 'tatiana-zaitseva',
      'Андрей Николаев': 'andrey-nikolaev',
      'Валентина Орлова': 'valentina-orlova',
      'Руслан Ковалев': 'ruslan-kovalev',
      'Наталья Белова': 'natalia-belova',
      'Виктор Соколов': 'viktor-sokolov',
      'Карина Васильева': 'karina-vasilieva',
      'NeoTech Solutions': 'neotech-solutions',
      'InnovaCorp': 'innovacorp',
      'Pixel Perfect Studio': 'pixel-perfect-studio',
      'Strategic Minds Ltd': 'strategic-minds-ltd',
      'FinFlow Solutions': 'finflow-solutions',
      'Цех85': 'tsekh85-bakery',
      
      // Прямые ключи базы данных
      'alexey-korneev': 'alexey-korneev',
      'maria-smirnova': 'maria-smirnova',
      'igor-volkov': 'igor-volkov',
      'elena-rybakova': 'elena-rybakova',
      'dmitry-kozlov': 'dmitry-kozlov',
      'anna-petrova': 'anna-petrova',
      'sergey-volkov': 'sergey-volkov',
      'olga-marinova': 'olga-marinova',
      'maxim-stellar': 'maxim-stellar',
      'pavel-sidorov': 'pavel-sidorov',
      'tatiana-zaitseva': 'tatiana-zaitseva',
      'andrey-nikolaev': 'andrey-nikolaev',
      'valentina-orlova': 'valentina-orlova',
      'ruslan-kovalev': 'ruslan-kovalev',
      'natalia-belova': 'natalia-belova',
      'viktor-sokolov': 'viktor-sokolov',
      'karina-vasilieva': 'karina-vasilieva',
      'neotech-solutions': 'neotech-solutions',
      'innovacorp': 'innovacorp',
      'pixel-perfect-studio': 'pixel-perfect-studio',
      'strategic-minds-ltd': 'strategic-minds-ltd',
      'finflow-solutions': 'finflow-solutions',
      'tsekh85-bakery': 'tsekh85-bakery',
      
      // Недостающие пользователи из комментариев
      'Maria Chen': 'maria-chen',
      'David Kim': 'david-kim',
      'maria-chen': 'maria-chen',
      'david-kim': 'david-kim',
      
      // Дополнительные ID для бизнес-профилей
      'tech-startup-1': 'innovacorp',
      'design-agency-1': 'pixel-perfect-studio',
      'consulting-firm-1': 'strategic-minds-ltd',
      'fintech-startup-1': 'finflow-solutions'
    };

    // Находим правильный ключ для базы данных
    const dbKey = userIdMap[userId] || userId;
    const otherUser = otherUsersDatabase[dbKey];
    
    if (otherUser) {
      setSelectedOtherUser(otherUser);
      setCurrentScreen('other-profile');
    } else {
      console.warn(`Пользователь не найден для ID: "${userId}", mapped to: "${dbKey}"`);
      toast.success(`Переход в профиль: ${userId} 👤`);
    }
  };

  const handleSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleAboutBliq = () => {
    setIsAboutBliqOpen(true);
    setIsSidebarOpen(false); // Закрываем сайдбар при открытии справки
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearchUserSelect = (userId: string) => {
    handleUserProfile(userId);
  };

  const handleSearchBlikSelect = (blikId: string) => {
    handleBlikDetail(blikId);
  };

  const handleSearchSuperpowerSelect = (superpowerName: string) => {
    handleSuperpowerSelect(superpowerName);
  };

  // Обработчики онбординга
  const handleOnboardingNext = (step: 'welcome' | 'auth' | 'profile-type' | 'superpowers-explain' | 'bliks-explain' | 'value-map-explain' | 'setup' | 'business-setup') => {
    switch (step) {
      case 'welcome':
        setCurrentScreen('onboarding-auth');
        break;
      case 'auth':
        setCurrentScreen('onboarding-profile-type');
        break;
      case 'profile-type':
        setCurrentScreen('onboarding-superpowers-explain');
        break;
      case 'superpowers-explain':
        setCurrentScreen('onboarding-bliks-explain');
        break;
      case 'bliks-explain':
        setCurrentScreen('onboarding-value-map-explain');
        break;
      case 'value-map-explain':
        // Переходим на соответствующий экран настройки в зависимости от типа профиля
        if (selectedProfileType === 'business') {
          setCurrentScreen('onboarding-business-setup');
        } else {
          setCurrentScreen('onboarding-setup');
        }
        break;
      case 'setup':
        setCurrentScreen('onboarding-complete');
        break;
      case 'business-setup':
        setCurrentScreen('onboarding-complete');
        break;
    }
  };

  const handleOnboardingBack = (step: 'auth' | 'profile-type' | 'superpowers-explain' | 'bliks-explain' | 'value-map-explain' | 'setup' | 'business-setup') => {
    switch (step) {
      case 'auth':
        setCurrentScreen('onboarding-welcome');
        break;
      case 'profile-type':
        setCurrentScreen('onboarding-auth');
        break;
      case 'superpowers-explain':
        setCurrentScreen('onboarding-profile-type');
        break;
      case 'bliks-explain':
        setCurrentScreen('onboarding-superpowers-explain');
        break;
      case 'value-map-explain':
        setCurrentScreen('onboarding-bliks-explain');
        break;
      case 'setup':
        setCurrentScreen('onboarding-value-map-explain');
        break;
      case 'business-setup':
        setCurrentScreen('onboarding-value-map-explain');
        break;
    }
  };

  // Обработчики выбора типа профиля
  const handleSelectPersonalProfile = () => {
    setSelectedProfileType('personal');
    handleOnboardingNext('profile-type');
  };

  const handleSelectBusinessProfile = () => {
    setSelectedProfileType('business');
    handleOnboardingNext('profile-type');
  };

  // Обработчик завершения настройки бизнес-профиля
  const handleBusinessSetupComplete = (businessInfo: any) => {
    // Обновляем данные пользователя с бизнес-информацией
    setUser(prev => ({
      ...prev,
      profileType: 'business',
      businessInfo: {
        ...prev.businessInfo,
        ...businessInfo,
        verified: false // Верификация происходит отдельно
      }
    }));
    
    handleOnboardingNext('business-setup');
  };

  const handleOnboardingSkip = () => {
    setIsOnboardingCompleted(true);
    setCurrentScreen('feed');
    setActiveTab('feed');
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingCompleted(true);
    setCurrentScreen('feed');
    setActiveTab('feed');
  };

  // Debug функции для разработки
  const handleResetOnboarding = () => {
    setIsOnboardingCompleted(false);
    setCurrentScreen('onboarding-welcome');
  };



  const handleBack = () => {
    // Принудительно скроллим к верху при возврате
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Также скроллим любые контейнеры с overflow
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
      scrollableContainers.forEach(container => {
        container.scrollTop = 0;
      });
    };
    
    if (currentScreen === 'detail') {
      // Очищаем сохраненный контекст при выходе из detail
      setSuperpowerContext(null);
      
      // Возвращаемся на предыдущий экран в зависимости от источника перехода
      if (superpowerContext?.source === 'library') {
        setCurrentScreen('library');
        setActiveTab('top');
      } else if (superpowerContext?.source === 'other-user' || selectedOtherUser) {
        // Если мы смотрели суперсилу другого пользователя, возвращаемся в его профиль
        setCurrentScreen('other-profile');
      } else {
        // Для user-profile и business-profile возвращаемся на соответствующий экран
        if (superpowerContext?.source === 'user-profile' || superpowerContext?.source === 'business-profile') {
          setCurrentScreen('profile');
          setActiveTab('profile');
        } else {
          // Fallback - возвращаемся на карту ценности
          setCurrentScreen('value-map');
          setActiveTab('profile');
        }
      }
    } else if (currentScreen === 'settings' || currentScreen === 'friends' || currentScreen === 'notifications' || currentScreen === 'create-value-map') {
      setCurrentScreen('profile');
      setActiveTab('profile');
    } else if (currentScreen === 'bliks') {
      // Возврат на профиль при выходе из экрана Блики
      setCurrentScreen('profile');
      setActiveTab('profile');
    } else if (currentScreen === 'value-map') {
      // Если смотрели карту ценности другого пользователя, возвращаемся в его профиль
      if (selectedOtherUser) {
        setCurrentScreen('other-profile');
      } else {
        // Если это была наша карта, возвращаемся в ��рофиль
        setCurrentScreen('profile');
        setActiveTab('profile');
      }
    } else if (currentScreen === 'personal-site') {
      // Если мы смотрели персональный сайт другого пользователя, возвращаемся в его профиль
      if (selectedOtherUser) {
        setCurrentScreen('other-profile');
      } else {
        // Если это был наш сайт, возвращаемся в профиль
        setCurrentScreen('profile');
        setActiveTab('profile');
      }
    } else if (currentScreen === 'blik-detail') {
      setSelectedBlik(null);
      setCurrentScreen('feed');
      setActiveTab('feed');
    } else if (currentScreen === 'other-profile') {
      setSelectedOtherUser(null);
      setCurrentScreen('feed');
      setActiveTab('feed');
    } else {
      setCurrentScreen('feed');
      setActiveTab('feed');
    }
    
    // Прокрутка к верху после изменения экрана
    scrollToTop();
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding-welcome':
        return (
          <OnboardingWelcomeScreen
            onNext={() => handleOnboardingNext('welcome')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-auth':
        return (
          <OnboardingAuthScreen
            onNext={() => handleOnboardingNext('auth')}
            onBack={() => handleOnboardingBack('auth')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-profile-type':
        return (
          <OnboardingProfileTypeScreen
            onSelectPersonal={handleSelectPersonalProfile}
            onSelectBusiness={handleSelectBusinessProfile}
            onBack={() => handleOnboardingBack('profile-type')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-superpowers-explain':
        return (
          <OnboardingSuperpowersExplainScreen
            onNext={() => handleOnboardingNext('superpowers-explain')}
            onBack={() => handleOnboardingBack('superpowers-explain')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-bliks-explain':
        return (
          <OnboardingBliksExplainScreen
            onNext={() => handleOnboardingNext('bliks-explain')}
            onBack={() => handleOnboardingBack('bliks-explain')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-value-map-explain':
        return (
          <OnboardingValueMapExplainScreen
            onNext={() => handleOnboardingNext('value-map-explain')}
            onBack={() => handleOnboardingBack('value-map-explain')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-setup':
        return (
          <OnboardingSetupScreen
            onNext={() => handleOnboardingNext('setup')}
            onBack={() => handleOnboardingBack('setup')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-business-setup':
        return (
          <OnboardingBusinessSetupScreen
            onNext={handleBusinessSetupComplete}
            onBack={() => handleOnboardingBack('business-setup')}
            onSkip={handleOnboardingSkip}
          />
        );

      case 'onboarding-complete':
        return (
          <OnboardingCompleteScreen
            onComplete={handleOnboardingComplete}
          />
        );

      case 'feed':
        return (
          <FeedScreen
            popularUsers={popularUsers}
            feedBliks={feedBliks}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onShare={handleShareBlik}
            onUserProfile={handleUserProfile}
            onSidebar={handleSidebar}
            onNotifications={handleNotifications}
            onSearch={handleSearch}
            onBlikDetail={handleBlikDetail}
            onSuperpowerClick={handleSuperpowerSelect}
            unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          />
        );

      case 'create':
        return (
          <CameraCreateScreen
            superpowers={[
              // Только персональные суперсилы пользователя
              ...userSuperpowers.map(sp => ({ 
                name: sp.name, 
                emoji: sp.emoji,
                category: sp.category.toLowerCase() 
              }))
            ]}
            friends={friends}
            onBack={handleBack}
            onCreateBlik={handleCreateBlik}
            onCreateSuperpower={handleCreateSuperpower}
          />
        );

      case 'incoming-bliks':
        return (
          <IncomingBliksScreen
            incomingBliks={incomingBliks}
            declinedBliks={declinedBliks}
            onAccept={handleAcceptBlik}
            onDecline={handleDeclineBlik}
            onBlikDetail={handleBlikDetail}
            onOpenSettings={() => setIsBliksSettingsOpen(true)}
            userSuperpowers={userSuperpowers.map(sp => ({
              name: sp.name,
              emoji: sp.emoji,
              energy: sp.energy
            }))}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          />
        );

      case 'profile':
        // Создаем пользователя с актуальными персональными суперсилами
        const userWithPersonalSuperpowers = {
          ...user,
          topSuperpowers: userSuperpowers.map(sp => ({
            name: sp.name,
            emoji: sp.emoji,
            value: sp.bliks,
            energy: sp.energy
          }))
        };
        
        // Используем ProfileScreen для всех типов профилей (личных и бизнес)
        return (
          <ProfileScreen
            user={userWithPersonalSuperpowers}
            receivedBliks={receivedBliks}
            sentBliks={sentBliks}
            onSettings={handleSettings}
            onViewMap={handleViewMap}
            onViewPersonalSite={handleViewPersonalSite}
            onViewBlog={handleViewBlog}
            onViewBliks={handleViewBliks}
            onViewFriends={handleViewFriends}
            onChat={handleChat}
            onBack={handleBack}
            onAddFriend={handleAddFriend}
            onSubscribe={handleSubscribe}
            onShare={handleShare}
            onSuperpowerClick={handleSuperpowerSelect}
            onUserProfile={handleUserProfile}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onShareBlik={handleShareBlik}
            onBlikDetail={handleBlikDetail}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
          />
        );
      
      case 'library':
        // Показываем все персональные суперсилы пользователя
        const personalSuperpowersForLibrary = userSuperpowers.map(sp => ({
          name: sp.name,
          emoji: sp.emoji,
          bliks: sp.bliks,
          energy: sp.energy,
          trend: sp.trend,
          category: sp.category,
          isOwn: true,
          ownerName: sp.ownerName,
          ownerAvatar: sp.ownerAvatar
        }));
        
        return (
          <MegapowersLibraryScreen
            superpowers={personalSuperpowersForLibrary}
            onSuperpowerDetail={handleSuperpowerLibraryDetail}
          />
        );
      
      case 'top':
        // 🏆 ТОП - лучший контент со всех категорий
        const topPeople = [
          {
            id: 'anna-petrova',
            name: 'Анна Петрова',
            avatar: 'https://images.unsplash.com/photo-1697095098675-1d02496ef86a?w=100&h=100&fit=crop&crop=face',
            status: 'UX/UI Designer',
            isOnline: true,
            metrics: { bliks: 445, friends: 67, superpowers: 9 },
            trendScore: 98
          },
          {
            id: 'maxim-stellar',
            name: 'Максим Стеллар',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
            status: 'Astrophysicist',
            isOnline: true,
            metrics: { bliks: 523, friends: 78, superpowers: 12 },
            trendScore: 96
          },
          {
            id: 'sergey-volkov',
            name: 'Сергей Волков',
            avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?w=100&h=100&fit=crop&crop=face',
            status: 'Extreme Sports Athlete',
            isOnline: true,
            metrics: { bliks: 356, friends: 89, superpowers: 11 },
            trendScore: 94
          },
          {
            id: 'alexey-korneev',
            name: 'Алексей Корнеев',
            avatar: alexeyAvatarImage,
            status: 'Senior Frontend Developer',
            isOnline: true,
            metrics: { bliks: 324, friends: 45, superpowers: 8 },
            trendScore: 92
          },
          {
            id: 'elena-rybakova',
            name: 'Елена Рыбакова',
            avatar: 'https://images.unsplash.com/photo-1736697027030-d3407ffc7c92?w=100&h=100&fit=crop&crop=face',
            status: 'Dance Instructor',
            isOnline: true,
            metrics: { bliks: 298, friends: 52, superpowers: 7 },
            trendScore: 90
          },
          {
            id: 'olga-marinova',
            name: 'Ольга Маринова',
            avatar: 'https://images.unsplash.com/photo-1756588534346-e8899364757b?w=100&h=100&fit=crop&crop=face',
            status: 'Marine Biologist',
            isOnline: false,
            metrics: { bliks: 278, friends: 54, superpowers: 8 },
            trendScore: 88
          },
          {
            id: 'maria-smirnova',
            name: 'Мария Смирнова',
            avatar: mariaAvatarImage,
            status: 'Creative Photographer',
            isOnline: false,
            metrics: { bliks: 267, friends: 38, superpowers: 6 },
            trendScore: 85
          },
          {
            id: 'karina-vasilieva',
            name: 'Карина Васильева',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
            status: 'Social Media Strategist',
            isOnline: true,
            metrics: { bliks: 412, friends: 78, superpowers: 12 },
            trendScore: 82
          }
        ];

        const topBusinesses = [
          {
            id: 'neotech-solutions',
            name: 'NeoTech Solutions',
            avatar: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=100&h=100&fit=crop&crop=center',
            industry: 'AI & Software Development',
            verified: true,
            metrics: { bliks: 892, followers: 156 },
            trendScore: 99
          },
          {
            id: 'finflow-solutions',
            name: 'FinFlow Solutions',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
            industry: 'Financial Technology',
            verified: true,
            metrics: { bliks: 789, followers: 312 },
            trendScore: 97
          },
          {
            id: 'pixel-perfect-studio',
            name: 'Pixel Perfect Studio',
            avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center',
            industry: 'Creative Design',
            verified: true,
            metrics: { bliks: 623, followers: 234 },
            trendScore: 95
          },
          {
            id: 'tsekh85-bakery',
            name: 'Цех85',
            avatar: tsekh85Logo,
            industry: 'Artisan Bakery',
            verified: true,
            metrics: { bliks: 567, followers: 298 },
            trendScore: 93
          },
          {
            id: 'innovacorp',
            name: 'InnovaCorp',
            avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
            industry: 'Digital Innovation',
            verified: true,
            metrics: { bliks: 456, followers: 89 },
            trendScore: 90
          },
          {
            id: 'strategic-minds-ltd',
            name: 'Strategic Minds',
            avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
            industry: 'Business Strategy',
            verified: true,
            metrics: { bliks: 345, followers: 167 },
            trendScore: 87
          }
        ];

        const topBliks = [
          ...receivedBliks.slice(0, 3),
          ...sentBliks.slice(0, 3)
        ].sort((a, b) => b.likes - a.likes).slice(0, 6);

        const topSuperpowers = [
          { name: 'Креативность', emoji: '💡', bliks: 85, energy: 89, trend: 'up' as const, category: 'Mind', growthRate: 16 },
          { name: 'Харизма', emoji: '👑', bliks: 84, energy: 87, trend: 'up' as const, category: 'Soul', growthRate: 45 },
          { name: 'Программирование', emoji: '💻', bliks: 95, energy: 92, trend: 'up' as const, category: 'Mind', growthRate: 12 },
          { name: 'Лидерство', emoji: '⭐', bliks: 82, energy: 85, trend: 'up' as const, category: 'Crew', growthRate: 11 },
          { name: 'Дизайн', emoji: '🎨', bliks: 96, energy: 89, trend: 'up' as const, category: 'Style', growthRate: 28 },
          { name: 'Энергичность', emoji: '⚡', bliks: 89, energy: 94, trend: 'up' as const, category: 'Body', growthRate: 7 },
          { name: 'Контент-маркетинг', emoji: '📱', bliks: 78, energy: 82, trend: 'up' as const, category: 'Drive', growthRate: 19 },
          { name: 'Фотография', emoji: '📸', bliks: 92, energy: 85, trend: 'up' as const, category: 'Style', growthRate: 15 }
        ];

        return (
          <TopScreen
            topPeople={topPeople}
            topBusinesses={topBusinesses}
            topBliks={topBliks}
            topSuperpowers={topSuperpowers}
            onUserProfile={handleUserProfile}
            onBlikDetail={handleBlikDetail}
            onSuperpowerDetail={handleSuperpowerSelect}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onShare={handleShareBlik}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          />
        );
      
      case 'value-map':
        // Определяем, чью карту це��ности показываем
        if (selectedOtherUser) {
          // Карта ценности другого пользователя
          const otherUserSuperpowers = selectedOtherUser.topSuperpowers.map(sp => ({
            name: sp.name,
            emoji: sp.emoji,
            bliks: sp.value,
            energy: sp.energy,
            trend: sp.energy > 80 ? 'up' as const : sp.energy < 40 ? 'down' as const : 'stable' as const,
            category: 'Общие', // Для других пользователей используем общую категорию
            isOwn: true, // Для просмотра карты другого пользователя считаем его суперсилы как "собственные" для корректных расчетов
            ownerName: selectedOtherUser.name,
            ownerAvatar: selectedOtherUser.avatar
          }));
          
          const otherUserData = {
            name: selectedOtherUser.name,
            avatarImage: selectedOtherUser.avatar,
            metrics: selectedOtherUser.metrics,
            topSuperpowers: selectedOtherUser.topSuperpowers
          };
          
          // 🏢 Для бизнес-профилей используем специальную карту
          if (selectedOtherUser.profileType === 'business') {
            const businessBliks = otherUsersBliks[selectedOtherUser.id] || [];
            
            return (
              <BusinessValueMapScreen
                user={{
                  name: selectedOtherUser.name,
                  avatarImage: selectedOtherUser.avatar,
                  businessInfo: selectedOtherUser.businessInfo,
                  metrics: selectedOtherUser.metrics,
                  topSuperpowers: selectedOtherUser.topSuperpowers
                }}
                userBliks={businessBliks}
                onBack={handleBack}
                onShare={handleShareMap}
                onSuperpowerClick={handleSuperpowerSelect}
              />
            );
          }
          
          return (
            <ValueMapScreen
              superpowers={otherUserSuperpowers}
              user={otherUserData}
              onBack={handleBack}
              onShare={handleShareMap}
              onSuperpowerClick={handleSuperpowerSelect}
              sentBliks={[]} // Для других польз��вателей не показываем отправленные блики
            />
          );
        } else {
          // 🏢 БИЗНЕС-ПРОФИЛЬ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
          if (user.profileType === 'business') {
            return (
              <BusinessValueMapScreen
                user={user}
                userBliks={[...receivedBliks, ...sentBliks]}
                onBack={handleBack}
                onShare={handleShareMap}
                onSuperpowerClick={handleSuperpowerSelect}
              />
            );
          }
          
          // Личная карта ценности текущего пользователя - используем только персональные суперсилы
          return (
            <ValueMapScreen
              superpowers={userSuperpowers.map(sp => ({
                name: sp.name,
                emoji: sp.emoji,
                bliks: sp.bliks,
                energy: sp.energy,
                trend: sp.trend,
                category: sp.category,
                isOwn: true,
                ownerName: sp.ownerName,
                ownerAvatar: sp.ownerAvatar
              }))}
              user={user}
              onBack={handleBack}
              onShare={handleShareMap}
              onSuperpowerClick={handleSuperpowerSelect}
              sentBliks={sentBliks}
            />
          );
        }
      
      case 'detail':
        if (!selectedSuperpower) {
          console.warn('Не выбрана суперсила для отображения');
          handleBack();
          return null;
        }

        console.log(`🔧 Отображаем detail для "${selectedSuperpower}", сохраненный контекст: "${superpowerContext?.source}"`);

        // 🎯 ИСПРАВЛЕННАЯ ЛОГИКА: Используем сохраненный контекст источника перехода
        const context = superpowerContext?.source || (
          selectedOtherUser 
            ? (selectedOtherUser.profileType === 'business' ? 'business-profile' : 'other-user')
            : (user.profileType === 'business' ? 'business-profile' : 'user-profile')
        );
        
        console.log(`🔧 В detail используем контекст: "${context}" (источник: ${superpowerContext?.source ? 'сохранен' : 'определен по умолчанию'})`);
        
        const superpowerInfo = getSuperpowerType(selectedSuperpower, context);
        
        if (!superpowerInfo) {
          console.warn(`❌ В detail: Суперсила "${selectedSuperpower}" не найдена в контексте "${context}"`);
          handleBack();
          return null;
        }
        
        console.log(`🔧 В detail определен тип: "${superpowerInfo.type}" для "${selectedSuperpower}"`);
        
        const { type, data: selectedSuperpowerData } = superpowerInfo;
        
        // Получаем правильные блики для данного типа суперсилы
        let correctBliks;
        let isOwner = false;
        let ownerName = '';
        let ownerAvatar = '';
        let ownerProfileType: 'personal' | 'business' = 'personal';
        
        switch (type) {
          case 'personal':
            // ИСПРАВЛЕННАЯ ЛОГИКА: Правильно определяем владельца персональной суперсилы
            if (context === 'user-profile') {
              // Если это профиль текущего пользователя, то он владелец
              isOwner = true;
              ownerName = user.name;
              ownerAvatar = user.avatarImage;
              ownerProfileType = user.profileType || 'personal';
            } else if (context === 'other-user' && selectedOtherUser) {
              // Если это профиль другого пользовател��, то владелец - другой пользователь
              isOwner = false;
              ownerName = selectedOtherUser.name;
              ownerAvatar = selectedOtherUser.avatar;
              ownerProfileType = selectedOtherUser.profileType || 'personal';
            } else {
              // Для всех остальных случаев используем данные из суперсилы
              isOwner = selectedSuperpowerData.ownerName === user.name;
              ownerName = selectedSuperpowerData.ownerName || user.name;
              ownerAvatar = selectedSuperpowerData.ownerAvatar || user.avatarImage;
              ownerProfileType = selectedOtherUser?.profileType || user.profileType || 'personal';
            }
            
            correctBliks = getBliksForSuperpower(selectedSuperpower, 'personal', ownerName);
            
            console.log(`🔧 Персональная суперсила "${selectedSuperpower}":`, {
              ownerName,
              userName: user.name,
              isOwner,
              context,
              selectedOtherUser: selectedOtherUser?.name || 'none',
              superpowerContext: superpowerContext
            });
            break;
            
          // УБРАЛИ CASE 'MEGA' - теперь только персональные и бизнес-суперсилы
            
          case 'business':
            // ИСПРАВЛЕННАЯ ЛОГИКА: Правильно определяем владельца бизнес-суперсилы  
            if (context === 'business-profile' && selectedOtherUser && selectedOtherUser.profileType === 'business') {
              // Если это бизнес-профиль другого пользователя
              isOwner = false;
              ownerName = selectedOtherUser.businessInfo?.companyName || selectedOtherUser.name;
              ownerAvatar = selectedOtherUser.avatar;
              ownerProfileType = 'business';
            } else if (user.profileType === 'business') {
              // Если это бизнес-профиль текущего пользователя
              isOwner = selectedSuperpowerData.companyName === user.businessInfo?.companyName;
              ownerName = selectedSuperpowerData.companyName || user.businessInfo?.companyName || '';
              ownerAvatar = user.avatarImage;
              ownerProfileType = 'business';
            } else {
              // Fallback
              isOwner = false;
              ownerName = selectedSuperpowerData.companyName || '';
              ownerAvatar = user.avatarImage;
              ownerProfileType = 'business';
            }
            
            correctBliks = getBliksForSuperpower(selectedSuperpower, 'business', ownerName);
            break;
        }
        
        // Получаем описание суперсилы
        const detailData = getSuperpowerDetails(selectedSuperpower);
        
        // 🎯 ИСПОЛЬЗУЕМ ОДИН ЭКРАН ДЛЯ ВСЕХ ТИПОВ СУПЕРСИЛ
        // Для мегасил показываем участников в специальном блоке
        const isMegaSuperpower = type === 'mega';
        const participants = isMegaSuperpower && 'participants' in selectedSuperpowerData 
          ? selectedSuperpowerData.participants 
          : [];

        return (
          <SuperpowerHubScreen
            name={selectedSuperpowerData.name}
            emoji={selectedSuperpowerData.emoji}
            description={
              detailData?.description || 'Уникальная суперсила, которая делает вас особенным и помогает достигать новых высот.'
            }
            bliks={selectedSuperpowerData.bliks}
            energy={selectedSuperpowerData.energy}
            trend={selectedSuperpowerData.trend}
            category={selectedSuperpowerData.category}
            ownerAvatar={ownerAvatar}
            ownerName={ownerName}
            ownerProfileType={ownerProfileType}
            feedBliks={correctBliks}
            userSuperpowers={user.topSuperpowers.map(sp => ({
              name: sp.name,
              emoji: sp.emoji,
              value: sp.value,
              trend: sp.energy > 80 ? 'up' as const : sp.energy < 40 ? 'down' as const : 'stable' as const
            }))}
            onBack={handleBack}
            onShare={handleShare}
            onCreateBlik={handleAddBlik}
            onUserProfile={handleUserProfile}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onBlikDetail={handleBlikDetail}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            isOwner={isOwner}
            // Передаем данные о мегасиле
            isMegaSuperpower={isMegaSuperpower}
            participantCount={isMegaSuperpower && 'participantCount' in selectedSuperpowerData 
              ? selectedSuperpowerData.participantCount 
              : undefined}
            participants={participants}
          />
        );
      
      case 'bliks':
        return (
          <BliksScreen
            receivedBliks={receivedBliks}
            sentBliks={sentBliks}
            userProfileType={user.profileType || 'personal'}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onShare={handleShareBlik}
            onBlikDetail={handleBlikDetail}
            onSuperpowerClick={handleSuperpowerSelect}
            onUserProfile={handleUserProfile}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
            unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
          />
        );
      
      case 'blik-detail':
        if (!selectedBlik) {
          return <div>Блик не найден</div>;
        }
        
        return (
          <BlikDetailScreen
            blik={selectedBlik}
            onBack={handleBack}
            onLike={handleLikeBlik}
            onComment={handleAddComment}
            onShare={handleShareBlik}
            onUserProfile={handleUserProfile}
            onSidebar={handleSidebar}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        );

      case 'other-profile':
        if (!selectedOtherUser) {
          return <div>Пользователь не ��айден</div>;
        }
        
        // Получаем блики для конкретного пользователя
        const userSpecificBliks = otherUsersBliks[selectedOtherUser.id] || [];
        
        // Используем OtherUserProfileScreen для всех типов профилей (личных и бизнес)
        // Брендированная шапка будет отображаться автоматически для бизнес-профилей
        return (
          <OtherUserProfileScreen
            user={selectedOtherUser}
            userBliks={userSpecificBliks}
            onBack={handleBack}
            onChat={handleChat}
            onAddFriend={handleAddFriend}
            onSubscribe={handleSubscribe}
            onShare={handleShare}
            onSuperpowerClick={handleSuperpowerSelect}
            onLike={handleLikeBlik}
            onComment={handleCommentBlik}
            onShareBlik={handleShareBlik}
            onBlikDetail={handleBlikDetail}
            onUserProfile={handleUserProfile}
            onViewFriends={handleViewFriends}
            onViewSuperpowersMap={() => {
              // Переходим на карту ценности с данными выбранного пользователя
              setCurrentScreen('value-map');
              setActiveTab('profile');
            }}
            onCreateBlik={() => {
              setCurrentScreen('create');
              setActiveTab('create');
            }}
            onViewPersonalSite={() => {
              // Просто переходим на PersonalSiteScreen - данные будут переданы через viewingOtherUser
              setCurrentScreen('personal-site');
            }}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
            onNotifications={handleNotifications}
          />
        );

      case 'friends':
        return (
          <FriendsScreen
            friends={friendsList}
            onBack={handleBack}
            onUserProfile={handleUserProfile}
            onChat={handleChat}
            onAddFriend={handleAddFriend}
            onSearch={handleSearch}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            notifications={notifications}
            onBack={handleBack}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
            onSidebar={handleSidebar}
            onSearch={handleSearch}
          />
        );

      case 'personal-site':
        // Если мы смотрим сайт другого пользователя, создаем данные для PersonalSiteScreen
        const viewingUserData = selectedOtherUser ? {
          name: selectedOtherUser.name,
          status: selectedOtherUser.status,
          location: selectedOtherUser.location,
          bio: selectedOtherUser.bio,
          avatarImage: selectedOtherUser.avatar,
          backgroundImage: selectedOtherUser.backgroundImage,
          topSuperpowers: selectedOtherUser.topSuperpowers,
          metrics: selectedOtherUser.metrics,
          // Добавляем недостающие поля для PersonalSiteScreen
          email: '',
          phone: '',
          website: `https://${selectedOtherUser.name.toLowerCase().replace(/\s+/g, '')}.com`,
          birthDate: '',
          occupation: selectedOtherUser.status,
          interests: [],
          socialLinks: {},
          privacy: {
            showEmail: false,
            showPhone: false,
            showBirthDate: false,
            allowFriendRequests: true,
            showOnlineStatus: true
          },
          isOnline: selectedOtherUser.isOnline
        } : null;
        
        return (
          <PersonalSiteScreen
            user={user}
            viewingOtherUser={viewingUserData}
            onBack={handleBack}
            onShare={handleShare}
            onSuperpowerClick={handleSuperpowerSelect}
            unsplashTool={searchUnsplashImage}
            initialTab={personalSiteTab}
          />
        );

      case 'create-value-map':
        return (
          <CreateValueMapScreen
            onBack={handleBack}
            availableSuperpowers={[]} // Теперь суперсилы определяются внутри компонента
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            user={user}
            onBack={handleBack}
            onSave={handleSaveSettings}
            onSidebar={handleSidebar}
            unsplashTool={async (query: string) => {
              // Моковая функция для unsplash_tool - имитирует реальные изображения из Unsplash
              const imageMap: Record<string, string> = {
                // Портреты для аватаров
                'professional portrait woman': 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=400&h=400&fit=crop&crop=face',
                'creative portrait': 'https://images.unsplash.com/photo-1539135950877-26943cd58152?w=400&h=400&fit=crop&crop=face',
                'business headshot': 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=400&h=400&fit=crop&crop=face',
                'professional man': 'https://images.unsplash.com/photo-1595745688820-1a8bca9dd00f?w=400&h=400&fit=crop&crop=face',
                'artistic portrait': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
                'modern portrait': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                
                // Энергетические и космические фоны (идеально для суперсил!)
                'cosmic nebula space': 'https://images.unsplash.com/photo-1602981256888-244edc1f444f?w=800&h=600&fit=crop',
                'aurora borealis night': 'https://images.unsplash.com/photo-1715619172925-78d1b2022a77?w=800&h=600&fit=crop',
                'cyberpunk neon cityscape': 'https://images.unsplash.com/photo-1604912364280-4a5f295cd988?w=800&h=600&fit=crop',
                'abstract gradient purple': 'https://images.unsplash.com/photo-1646038572815-43fe759e459b?w=800&h=600&fit=crop',
                'mountain landscape sunset': 'https://images.unsplash.com/photo-1577642665234-b1abe52cd0ae?w=800&h=600&fit=crop',
                
                // Классические фоны
                'abstract gradient': 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&h=600&fit=crop',
                'mountain landscape': 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=800&h=600&fit=crop',
                'ocean sunset': 'https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?w=800&h=600&fit=crop',
                'urban skyline': 'https://images.unsplash.com/photo-1704080864842-2577d94ebb1c?w=800&h=600&fit=crop',
                'nature forest': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
                'space stars': 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=800&h=600&fit=crop',
                
                // Морские фоны
                'coral reef underwater': 'https://images.unsplash.com/photo-1719042575585-e9d866f43210?w=800&h=600&fit=crop',
                'tropical coral reef': 'https://images.unsplash.com/photo-1722482312877-dda06fc3c23d?w=800&h=600&fit=crop',
                'underwater ocean blue': 'https://images.unsplash.com/photo-1708864163871-311332fb9d5e?w=800&h=600&fit=crop',
                'sea life colorful': 'https://images.unsplash.com/photo-1629647259197-78761c30327d?w=800&h=600&fit=crop'
              };
              
              return imageMap[query] || 'https://images.unsplash.com/photo-1602981256888-244edc1f444f?w=800&h=600&fit=crop';
            }}
          />
        );
      
      default:
        return null;
    }
  };

  // Определяем нужно ли показывать навигацию
  const shouldShowNavigation = isOnboardingCompleted && !['settings', 'bliks', 'value-map', 'friends', 'personal-site', 'create-value-map', 'create'].includes(currentScreen);

  return (
    <AppBackground>
      {/* Debug панель для разработки */}
      <OnboardingDebugPanel
        currentScreen={currentScreen}
        onSkipToApp={handleOnboardingSkip}
        onResetOnboarding={handleResetOnboarding}
      />
      
      {renderScreen()}
      
      {/* Sidebar - показываем только после онбординга */}
      {isOnboardingCompleted && (
        <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        user={user}
        onSettings={handleSettings}
        onNotifications={handleNotifications}
        onFriends={handleViewFriends}
        onTrends={() => {
          setCurrentScreen('trends');
          setActiveTab('trends');
          setIsSidebarOpen(false);
        }}
        onViewMap={() => {
          setCurrentScreen('value-map');
          setActiveTab('profile');
          setIsSidebarOpen(false);
        }}
        onCreateValueMap={() => {
          setCurrentScreen('create-value-map');
          setIsSidebarOpen(false);
        }}
        onSuperpowerClick={(superpowerName) => {
          setSelectedSuperpower(superpowerName);
          setCurrentScreen('detail');
          setIsSidebarOpen(false);
          
          // Принудительно скроллим к верху при выборе суперсилы
          const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // Также скроллим любые контейнеры с overflow
            const scrollableContainers = document.querySelectorAll('[class*="overflow-y"], [class*="scroll"]');
            scrollableContainers.forEach(container => {
              container.scrollTop = 0;
            });
          };
          
          // Немедленная прокрутка
          scrollToTop();
          
          // Дополнительные попытки с задержкой
          setTimeout(scrollToTop, 10);
          setTimeout(scrollToTop, 50);
          setTimeout(scrollToTop, 100);
          setTimeout(scrollToTop, 200);
        }}
        onAboutBliq={handleAboutBliq}
        onProfileClick={() => {
          setCurrentScreen('profile');
          setActiveTab('profile');
          setIsSidebarOpen(false);
        }}
      />
      )}
      
      {/* About Bliq Modal - показываем только после онбординга */}
      {isOnboardingCompleted && (
        <AboutBliqModal
        isOpen={isAboutBliqOpen}
        onClose={() => setIsAboutBliqOpen(false)}
      />
      )}
      
      {/* Search Modal - показываем только после онбординга */}
      {isOnboardingCompleted && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          users={searchableUsers}
          bliks={[...receivedBliks, ...sentBliks]}
          superpowers={[
            // Только персональные суперсилы пользователя
            ...userSuperpowers.map(sp => ({
              name: sp.name,
              emoji: sp.emoji,
              bliks: sp.bliks,
              energy: sp.energy,
              trend: sp.trend,
              category: sp.category,
              isOwn: true,
              ownerName: sp.ownerName,
              ownerAvatar: sp.ownerAvatar
            }))
          ]}
          onUserSelect={handleSearchUserSelect}
          onBlikSelect={handleSearchBlikSelect}
          onSuperpowerSelect={handleSearchSuperpowerSelect}
        />
      )}
      
      {/* Bliks Settings Modal - настройки автоматического принятия */}
      {isOnboardingCompleted && (
        <BliksSettingsModal
          isOpen={isBliksSettingsOpen}
          onClose={() => setIsBliksSettingsOpen(false)}
          settings={bliksAutoSettings}
          onSave={(newSettings) => {
            setBliksAutoSettings(newSettings);
            setIsBliksSettingsOpen(false);
          }}
          friends={friendsList}
          userSuperpowers={userSuperpowers.map(sp => ({
            name: sp.name,
            emoji: sp.emoji
          }))}
        />
      )}
      
      {shouldShowNavigation && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          incomingBliksCount={incomingBliks.length}
        />
      )}
    </AppBackground>
  );
}