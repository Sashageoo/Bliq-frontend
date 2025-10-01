import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Calendar, Briefcase, Share, Globe, Instagram, Twitter, Github, Linkedin, Star, Heart, Users, Zap, Edit, Plus, Rss, BookOpen, Camera, MessageCircle, Settings, Eye, X, MoreVertical, Flag, Trash2 } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AppBackground } from './AppBackground';
import { CompactBlogEditor } from './CompactBlogEditor';
import { toast } from 'sonner@2.0.3';

interface User {
  name: string;
  status: string;
  location: string;
  backgroundImage: string;
  avatarImage: string;
  isOnline: boolean;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  birthDate?: string;
  occupation?: string;
  interests?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  privacy?: {
    showEmail: boolean;
    showPhone: boolean;
    showBirthDate: boolean;
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
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

interface PersonalSiteScreenProps {
  user: User;
  viewingOtherUser?: User; // Пользователь, чей сайт мы смотрим (если не наш)
  onBack: () => void;
  onShare: () => void;
  onSuperpowerClick: (name: string) => void;
  unsplashTool?: (query: string) => Promise<string>;
  initialTab?: 'about' | 'professional' | 'contacts' | 'blog' | 'portfolio'; // Начальная вкладка
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  isPublished: boolean;
  isLiked?: boolean;
  likedBy?: Array<{ name: string; avatar: string }>;
  commentsList?: Array<{
    id: string;
    author: { name: string; avatar: string };
    content: string;
    timestamp: string;
  }>;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  url?: string;
  technologies?: string[];
}

export function PersonalSiteScreen({ user, viewingOtherUser, onBack, onShare, onSuperpowerClick, unsplashTool, initialTab = 'about' }: PersonalSiteScreenProps) {
  // Определяем, какого пользователя показывать - если передан viewingOtherUser, то его, иначе основного пользователя
  const displayUser = viewingOtherUser || user;
  const isOwner = !viewingOtherUser; // Владелец ли текущий пользователь этого сайта
  const [activeTab, setActiveTab] = useState<'about' | 'professional' | 'contacts' | 'blog' | 'portfolio'>(initialTab);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCompactEditor, setShowCompactEditor] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
    imageUrl: ''
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    name: displayUser.name,
    status: displayUser.status,
    location: displayUser.location,
    bio: displayUser.bio || '',
    website: displayUser.website || '',
    occupation: displayUser.occupation || ''
  });
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [openPostMenu, setOpenPostMenu] = useState<string | null>(null);

  // Обработчик закрытия меню при клике вне его
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPostMenu) {
        setOpenPostMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openPostMenu]);

  // Моковые данные блога - в реальном приложении это будет загружаться с сервера
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Мои размышления о творчестве и вдохновении',
      content: 'Сегодня хочу поделиться мыслями о том, как находить вдохновение в обыденных вещах. Творчество - это не только создание чего-то нового, но и умение увидеть красоту в привычном...',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      timestamp: '3 дня назад',
      views: 127,
      likes: 23,
      comments: 8,
      tags: ['творчество', 'вдохновение', 'жизнь'],
      isPublished: true,
      isLiked: false,
      likedBy: [
        { name: 'Алексей Корнеев', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face' },
        { name: 'Мария Смирнова', avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?w=100&h=100&fit=crop&crop=face' },
        { name: 'Игорь Волков', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '1',
          author: { name: 'Алексей Корнеев', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face' },
          content: 'Очень вдохновляющие мысли! 🌟',
          timestamp: '2 дня назад'
        },
        {
          id: '2',
          author: { name: 'Мария Смирнова', avatar: 'https://images.unsplash.com/photo-1612237372447-633d5ced1be1?w=100&h=100&fit=crop&crop=face' },
          content: 'Полностью согласна. Красота действительно везде вокруг нас 💖',
          timestamp: '1 день назад'
        }
      ]
    },
    {
      id: '2',
      title: 'Новый проект: UX/UI для мобильного приложения',
      content: 'Рад представить свою последнюю работу - дизайн мобильного приложения для медитации. Основная цель была создать интуитивно понятный интерфейс, который поможет пользователям расслабиться...',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      timestamp: '1 неделя назад',
      views: 89,
      likes: 15,
      comments: 4,
      tags: ['дизайн', 'UX/UI', 'мобильные приложения'],
      isPublished: true,
      isLiked: true,
      likedBy: [
        { name: 'Анна Петрова', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' },
        { name: 'Дмитрий Козлов', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '3',
          author: { name: 'Анна Петрова', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face' },
          content: 'Отличная работа! Дизайн действительно успокаивает ✨',
          timestamp: '5 дней назад'
        }
      ]
    },
    {
      id: '3',
      title: 'Как я развиваю свои суперсилы в Bliq',
      content: 'Поделюсь опытом использования платформы Bliq для развития креативности и профессиональных навыков. За последние месяцы заметил значительный прогресс...',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      timestamp: '2 недели назад',
      views: 156,
      likes: 31,
      comments: 12,
      tags: ['развитие', 'Bliq', 'суперсилы'],
      isPublished: true,
      isLiked: false,
      likedBy: [
        { name: 'Елена Рыбакова', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { name: 'Сергей Волков', avatar: 'https://images.unsplash.com/photo-1638128503215-c44ca91ce04b?w=100&h=100&fit=crop&crop=face' }
      ],
      commentsList: [
        {
          id: '4',
          author: { name: 'Елена Рыбакова', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          content: 'Спасибо за подробный опыт! Очень полезно 🙌',
          timestamp: '1 неделя назад'
        },
        {
          id: '5',
          author: { name: 'Максим Стеллар', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
          content: 'Результаты впечатляют! Продолжай в том же духе 🚀',
          timestamp: '1 неделя назад'
        }
      ]
    }
  ]);

  // Моковые данные портфолио
  const [portfolio, setPortfolio] = useState<Portfolio[]>([
    {
      id: '1',
      title: 'Мобильное приложение для медитации',
      description: 'Полный UX/UI дизайн приложения с фокусом на mindfulness и пользовательский опыт',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
      category: 'UX/UI Дизайн',
      url: 'https://figma.com/meditation-app',
      technologies: ['Figma', 'Adobe XD', 'Principle']
    },
    {
      id: '2',
      title: 'Редизайн e-commerce платформы',
      description: 'Современный дизайн интернет-магазина с улучшенной конверсией и пользовательским опытом',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      category: 'Веб-дизайн',
      url: 'https://dribbble.com/ecommerce-redesign',
      technologies: ['Sketch', 'InVision', 'Zeppelin']
    },
    {
      id: '3',
      title: 'Брендинг для стартапа',
      description: 'Создание полной визуальной идентичности от логотипа до гайдлайнов',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      category: 'Брендинг',
      technologies: ['Illustrator', 'Photoshop', 'After Effects']
    }
  ]);

  // Функция для получения возраста из даты рождения
  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long'
    });
  };

  // Функция для извлечения username из ссылки
  const extractUsername = (url?: string, platform?: string) => {
    if (!url) return null;
    if (url.startsWith('@')) return url;
    
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const pathname = urlObj.pathname;
      const username = pathname.split('/').filter(Boolean).pop();
      return username ? `@${username}` : url;
    } catch {
      return url;
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Заполните заголовок и содержание поста');
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      imageUrl: newPost.imageUrl.trim() || undefined,
      timestamp: 'только что',
      views: 0,
      likes: 0,
      comments: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublished: true
    };

    setBlogPosts([post, ...blogPosts]);
    setNewPost({ title: '', content: '', tags: '', imageUrl: '' });
    setShowCreatePost(false);
    toast.success('Пост опубликован! ✨');
  };

  // Обработчик для компактного редактора блога
  const handleCompactCreatePost = (data: {
    blocks: Array<{
      id: string;
      type: 'title' | 'text' | 'image' | 'video' | 'track' | 'link' | 'tags' | null;
      content: string;
      metadata?: {
        url?: string;
        caption?: string;
        alt?: string;
      };
    }>;
    isPublic: boolean;
  }) => {
    // Формируем блог пост из данных компактного редактора
    const titleBlock = data.blocks.find(b => b.type === 'title');
    const textBlocks = data.blocks.filter(b => b.type === 'text');
    const tagsBlock = data.blocks.find(b => b.type === 'tags');
    const mediaBlock = data.blocks.find(b => ['image', 'video', 'track'].includes(b.type));
    
    let content = '';
    if (titleBlock?.content) content += titleBlock.content + '\n\n';
    if (textBlocks.length > 0) {
      content += textBlocks.map(block => block.content).join('\n\n');
    }
    
    const post: BlogPost = {
      id: Date.now().toString(),
      title: titleBlock?.content || 'Новый пост',
      content: content.trim() || 'Содержание поста',
      imageUrl: mediaBlock?.content && (mediaBlock.content.startsWith('http') || mediaBlock.content.startsWith('blob:')) ? mediaBlock.content : undefined,
      timestamp: 'только что',
      views: 0,
      likes: 0,
      comments: 0,
      tags: tagsBlock?.content ? tagsBlock.content.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      isPublished: data.isPublic
    };

    setBlogPosts([post, ...blogPosts]);
    setShowCompactEditor(false);
    toast.success(`Блог пост "${post.title}" опубликован! ✨`);
  };

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
    toast.success(isEditMode ? 'Режим редактирования выключен ✨' : 'Режим редактирования включен 📝');
  };

  const handleSaveProfile = () => {
    // В реальном приложении здесь была бы отправка данных на сервер
    setShowEditProfile(false);
    setIsEditMode(false);
    toast.success('Профиль обновлен! ✨');
  };

  const handleEditSection = (section: string) => {
    if (section === 'profile') {
      setShowEditProfile(true);
    }
    toast.success(`Редактирование раздела: ${section} 📝`);
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleClosePostDetail = () => {
    setShowPostDetail(false);
    setSelectedPost(null);
  };

  // Функции управления постами
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditPostModal(true);
  };

  const handleDeletePost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    setBlogPosts(prev => prev.filter(p => p.id !== postId));
    toast.success(`Пост "${post?.title}" удален! 🗑️`);
  };

  const handleUpdatePost = (updatedPost: BlogPost) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setShowEditPostModal(false);
    setEditingPost(null);
    toast.success(`Пост "${updatedPost.title}" обновлен! ✨`);
  };

  const handleCloseEditModal = () => {
    setShowEditPostModal(false);
    setEditingPost(null);
  };

  // Функции для управления постами блога
  const handleLikePost = (postId: string) => {
    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked || false;
        const newLikesCount = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;
        
        let newLikedBy = [...(post.likedBy || [])];
        const userLike = { name: displayUser.name, avatar: displayUser.avatarImage };
        
        if (isCurrentlyLiked) {
          // Убираем лайк
          newLikedBy = newLikedBy.filter(like => like.name !== displayUser.name);
        } else {
          // Добавляем лайк в начало списка
          newLikedBy.unshift(userLike);
        }

        return {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: newLikesCount,
          likedBy: newLikedBy
        };
      }
      return post;
    }));

    // Обновляем selectedPost если он открыт
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => {
        if (!prev) return null;
        const isCurrentlyLiked = prev.isLiked || false;
        const newLikesCount = isCurrentlyLiked ? prev.likes - 1 : prev.likes + 1;
        
        let newLikedBy = [...(prev.likedBy || [])];
        const userLike = { name: displayUser.name, avatar: displayUser.avatarImage };
        
        if (isCurrentlyLiked) {
          newLikedBy = newLikedBy.filter(like => like.name !== displayUser.name);
        } else {
          newLikedBy.unshift(userLike);
        }

        return {
          ...prev,
          isLiked: !isCurrentlyLiked,
          likes: newLikesCount,
          likedBy: newLikedBy
        };
      });
    }

    toast.success('Лайк! ❤️');
  };

  const handleCommentPost = (postId: string, comment: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: {
        name: displayUser.name,
        avatar: displayUser.avatarImage
      },
      content: comment,
      timestamp: 'только что'
    };

    setBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [newComment, ...(post.commentsList || [])]
        };
      }
      return post;
    }));

    // Обновляем selectedPost если он открыт
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: prev.comments + 1,
          commentsList: [newComment, ...(prev.commentsList || [])]
        };
      });
    }

    toast.success(`Комментарий добавлен: "${comment}" 💬`);
  };

  const handleSharePost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      toast.success(`Пост "${post.title}" поделился! 🔗`);
    }
  };

  const handleReportPost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      toast.success(`Жалоба на пост "${post.title}" отправлена! 🚨`);
      setOpenPostMenu(null);
    }
  };

  const handlePostMenuToggle = (postId: string) => {
    setOpenPostMenu(openPostMenu === postId ? null : postId);
  };



  return (
    <AppBackground imageUrl={displayUser.backgroundImage}>
      <div className="min-h-screen flex flex-col">
        <StatusBar />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="
              w-10 h-10 rounded-full
              backdrop-blur-xl bg-white/10
              border border-white/20
              flex items-center justify-center
              text-white
              hover:bg-white/20
              transition-all duration-300
            "
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div className="flex items-center gap-2">
            <h1 className="text-white font-medium text-lg">
              Персональный сайт
            </h1>
            {/* Global Edit Mode Indicator */}
            {isOwner && isEditMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 bg-purple-500/90 backdrop-blur-xl px-2 py-1 rounded-full text-white text-xs font-medium shadow-lg border border-purple-400/50"
              >
                <Edit size={12} />
                Редактирование
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Кнопка редактирования (только для владельца) */}
            {isOwner && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEditModeToggle}
                className={`
                  w-10 h-10 rounded-full
                  backdrop-blur-xl border border-white/20
                  flex items-center justify-center
                  text-white
                  transition-all duration-300
                  ${isEditMode 
                    ? 'bg-purple-500/30 border-purple-400/50 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
              >
                <Edit size={16} />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="
                w-10 h-10 rounded-full
                backdrop-blur-xl bg-white/10
                border border-white/20
                flex items-center justify-center
                text-white
                hover:bg-white/20
                transition-all duration-300
              "
            >
              <Share size={20} />
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center space-y-6 relative ${isEditMode ? 'glass-card rounded-3xl p-6 border-2 border-purple-400/50' : ''}`}
            >
              {/* Edit Button for Profile Section */}
              {isOwner && isEditMode && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditSection('profile')}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-500/80 backdrop-blur-xl border border-purple-400/50 flex items-center justify-center text-white shadow-lg hover:bg-purple-500 transition-all duration-300"
                >
                  <Edit size={14} />
                </motion.button>
              )}

              {/* Edit Mode Indicator */}
              {isOwner && isEditMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500/90 backdrop-blur-xl px-3 py-1 rounded-full text-white text-xs font-medium shadow-lg border border-purple-400/50"
                >
                  📝 Режим редактирования
                </motion.div>
              )}
              {/* Avatar */}
              <div className="relative mx-auto w-32 h-32">
                <img 
                  src={displayUser.avatarImage} 
                  alt={displayUser.name}
                  className="w-full h-full rounded-full border-4 border-white/20 shadow-2xl object-cover"
                />
                {displayUser.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg" />
                )}
              </div>

              {/* Name & Status */}
              <div>
                <h1 className="text-white text-3xl font-bold mb-2">{displayUser.name}</h1>
                <p className="text-white/80 text-lg mb-3">{displayUser.status}</p>
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{user.metrics.bliks}</div>
                  <div className="text-white/60 text-sm">Блики</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{user.metrics.friends}</div>
                  <div className="text-white/60 text-sm">Друзья</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-2xl font-bold">{user.metrics.superpowers}</div>
                  <div className="text-white/60 text-sm">Суперсилы</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-1"
            >
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('about')}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${activeTab === 'about'
                      ? 'backdrop-blur-xl bg-primary/20 text-white shadow-lg border border-primary/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Heart size={14} />
                  О себе
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('professional')}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${activeTab === 'professional'
                      ? 'backdrop-blur-xl bg-primary/20 text-white shadow-lg border border-primary/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Briefcase size={14} />
                  Проф.
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('blog')}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${activeTab === 'blog'
                      ? 'backdrop-blur-xl bg-primary/20 text-white shadow-lg border border-primary/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <BookOpen size={14} />
                  Блог
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('portfolio')}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${activeTab === 'portfolio'
                      ? 'backdrop-blur-xl bg-primary/20 text-white shadow-lg border border-primary/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Camera size={14} />
                  Портфолио
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('contacts')}
                  className={`
                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${activeTab === 'contacts'
                      ? 'backdrop-blur-xl bg-primary/20 text-white shadow-lg border border-primary/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Mail size={14} />
                  Контакты
                </motion.button>
              </div>
            </motion.div>

            {/* About Tab */}
            {activeTab === 'about' && (
              <>
                {/* Bio Section */}
                {user.bio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-3xl p-6"
                  >
                    <h2 className="text-white text-xl font-medium mb-4 flex items-center gap-2">
                      <Heart size={20} />
                      О себе
                    </h2>
                    <p className="text-white/80 leading-relaxed">{user.bio}</p>
                  </motion.div>
                )}

                {/* Interests */}
                {user.interests && user.interests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-3xl p-6"
                  >
                    <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                      <Star size={18} />
                      Интересы
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-white/80 bg-white/10 border-white/20">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Work Info */}
                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h3 className="text-white text-lg font-medium flex items-center gap-2">
                    <Briefcase size={18} />
                    Профессиональное
                  </h3>
                  
                  <div className="space-y-3">
                    {user.occupation && (
                      <div className="flex items-start gap-3">
                        <Briefcase size={16} className="text-white/60 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white/60 text-sm">Профессия</div>
                          <div className="text-white">{user.occupation}</div>
                        </div>
                      </div>
                    )}
                    
                    {user.birthDate && user.privacy?.showBirthDate && (
                      <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-white/60 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white/60 text-sm">Возраст</div>
                          <div className="text-white">
                            {getAge(user.birthDate)} лет ({formatDate(user.birthDate)})
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {user.website && (
                      <div className="flex items-start gap-3">
                        <Globe size={16} className="text-white/60 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white/60 text-sm">Веб-сайт</div>
                          <a 
                            href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            {user.website.replace(/^https?:\/\//, '')}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Superpowers */}
                <div className="glass-card rounded-3xl p-6">
                  <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                    <Zap size={18} />
                    Топ суперсилы
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.topSuperpowers.slice(0, 6).map((superpower, index) => (
                      <motion.button
                        key={superpower.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSuperpowerClick(superpower.name)}
                        className="p-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{superpower.emoji}</span>
                          <div className="text-white/60 text-sm">{superpower.value}</div>
                        </div>
                        <div className="text-white font-medium mb-1">{superpower.name}</div>
                        
                        {/* Energy Bar */}
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500 rounded-full"
                            style={{
                              width: `${superpower.energy}%`,
                              background: superpower.energy > 80 
                                ? 'linear-gradient(90deg, #10b981, #22c55e)' 
                                : superpower.energy > 50 
                                ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                                : 'linear-gradient(90deg, #ef4444, #dc2626)'
                            }}
                          />
                        </div>
                        <div className="text-white/50 text-xs mt-1">Энергия: {superpower.energy}%</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Blog Header with Create Button */}
                <div className={`glass-card rounded-3xl p-6 relative ${isEditMode ? 'border-2 border-purple-400/50' : ''}`}>
                  {/* Edit Mode Indicator for Blog */}
                  {isOwner && isEditMode && (
                    <div className="absolute -top-2 left-4 bg-purple-500/90 backdrop-blur-xl px-2 py-1 rounded text-white text-xs font-medium shadow-lg border border-purple-400/50">
                      📝 Режим редактирования
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-xl font-medium flex items-center gap-2">
                      <BookOpen size={20} />
                      Мой блог
                    </h3>
                    {isOwner && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCompactEditor(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus size={16} />
                        Создать пост
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Blog Stats */}
                  <div className="flex gap-6 text-white/70 text-sm">
                    <div className="flex items-center gap-1">
                      <Rss size={14} />
                      {blogPosts.length} постов
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {blogPosts.reduce((sum, post) => sum + post.views, 0)} просмотров
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      {blogPosts.reduce((sum, post) => sum + post.likes, 0)} лайков
                    </div>
                  </div>
                </div>

                {/* Blog Posts */}
                <div className="space-y-6">
                  {blogPosts.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-white text-xl font-medium mb-3">
                        {isOwner ? 'Твой блог пока пуст' : 'Здесь пока нет постов'}
                      </h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        {isOwner 
                          ? 'Создай свой первый пост и поделись своими мыслями с миром!' 
                          : 'Этот пользователь еще не опубликовал ни одного поста в блоге.'}
                      </p>
                      {isOwner && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowCompactEditor(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus size={18} />
                          Создать первый пост
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    blogPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`glass-card rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 relative ${isEditMode ? 'border-2 border-purple-400/30' : ''}`}
                    >
                      {/* Post Header with Menu */}
                      <div className="flex items-center justify-between p-6 pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={displayUser.avatarImage} 
                              alt={displayUser.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-medium text-sm">{displayUser.name}</h4>
                            <p className="text-white/60 text-xs">{post.timestamp}</p>
                          </div>
                        </div>
                        
                        {/* Post Options Menu */}
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostMenuToggle(post.id);
                            }}
                            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                          >
                            <MoreVertical size={16} />
                          </motion.button>
                          
                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {openPostMenu === post.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute top-full right-0 mt-2 w-48 glass-card rounded-2xl p-2 shadow-2xl border border-white/20 z-20"
                              >
                                {/* Owner Options */}
                                {isOwner && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPost(post);
                                        setOpenPostMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm"
                                    >
                                      <Edit size={16} className="text-purple-400" />
                                      Редактировать
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(post.id);
                                        setOpenPostMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 text-sm"
                                    >
                                      <Trash2 size={16} className="text-red-400" />
                                      Удалить
                                    </motion.button>
                                  </>
                                )}
                                
                                {/* Non-owner Options */}
                                {!isOwner && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReportPost(post.id);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 text-sm"
                                  >
                                    <Flag size={16} className="text-red-400" />
                                    Пожаловаться
                                  </motion.button>
                                )}
                                
                                {/* Common Options */}
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSharePost(post.id);
                                    setOpenPostMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm"
                                >
                                  <Share size={16} className="text-blue-400" />
                                  Поделиться
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div 
                        className="p-6 pt-4 cursor-pointer" 
                        onClick={() => handlePostClick(post)}
                      >
                        {/* Post Title */}
                        <h3 className="text-white font-semibold text-xl mb-3 line-clamp-2">{post.title}</h3>
                        
                        {/* Post Image */}
                        {post.imageUrl && (
                          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Post Content */}
                        <p className="text-white/80 text-base leading-relaxed mb-4 line-clamp-3">{post.content}</p>
                        
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Footer */}
                      <div className="px-6 pb-6">
                        {/* Post Stats */}
                        <div className="flex items-center justify-between text-white/50 text-sm mb-4">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Eye size={16} />
                              <span>{post.views} просмотров</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart size={16} />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle size={16} />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-4">
                          {/* Like Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post.id);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                              post.isLiked 
                                ? 'bg-pink-500/20 text-pink-400 border border-pink-400/30 shadow-lg' 
                                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white'
                            }`}
                          >
                            <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                            <span className="text-sm font-medium">Нравится</span>
                          </motion.button>

                          {/* Comment Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-300"
                          >
                            <MessageCircle size={16} />
                            <span className="text-sm font-medium">Комментировать</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  )}
                </div>

                {/* Edit Profile Modal */}
                <AnimatePresence>
                  {showEditProfile && isOwner && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setShowEditProfile(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50"
                      >
                        <div className="glass-card rounded-3xl p-6 space-y-4">
                          <h3 className="text-white text-xl font-medium mb-4">Редактировать профиль</h3>
                          
                          <input
                            type="text"
                            placeholder="Имя"
                            value={editingProfile.name}
                            onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Статус"
                            value={editingProfile.status}
                            onChange={(e) => setEditingProfile({...editingProfile, status: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Местоположение"
                            value={editingProfile.location}
                            onChange={(e) => setEditingProfile({...editingProfile, location: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <textarea
                            placeholder="О себе"
                            value={editingProfile.bio}
                            onChange={(e) => setEditingProfile({...editingProfile, bio: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                          
                          <input
                            type="text"
                            placeholder="Веб-сайт"
                            value={editingProfile.website}
                            onChange={(e) => setEditingProfile({...editingProfile, website: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            placeholder="Профессия"
                            value={editingProfile.occupation}
                            onChange={(e) => setEditingProfile({...editingProfile, occupation: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          
                          <div className="flex gap-3 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowEditProfile(false)}
                              className="flex-1 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white font-medium"
                            >
                              Отменить
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveProfile}
                              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg"
                            >
                              Сохранить
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Compact Blog Editor */}
                <AnimatePresence>
                  {showCompactEditor && isOwner && (
                    <div className="fixed inset-0 z-50">
                      <CompactBlogEditor
                        onBack={() => setShowCompactEditor(false)}
                        onSave={handleCompactCreatePost}
                      />
                    </div>
                  )}
                </AnimatePresence>

                {/* Post Detail Modal */}
                <AnimatePresence>
                  {showPostDetail && selectedPost && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        onClick={handleClosePostDetail}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 top-8 bottom-8 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto z-50"
                      >
                        <div className="glass-card rounded-3xl p-6 space-y-4">
                          {/* Header with Author Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={displayUser.avatarImage} 
                                  alt={displayUser.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{displayUser.name}</h3>
                                <p className="text-white/60 text-sm">{displayUser.status}</p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleClosePostDetail}
                              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                            >
                              <X size={16} />
                            </motion.button>
                          </div>

                          {/* Post Image */}
                          {selectedPost.imageUrl && (
                            <div className="w-full h-64 rounded-xl overflow-hidden">
                              <img 
                                src={selectedPost.imageUrl} 
                                alt={selectedPost.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Post Content */}
                          <div className="space-y-4">
                            <h3 className="text-white text-2xl font-medium">{selectedPost.title}</h3>
                            
                            {/* Tags */}
                            {selectedPost.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {selectedPost.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Post Text */}
                            <div className="text-white/80 text-base leading-relaxed whitespace-pre-line">
                              {selectedPost.content}
                            </div>

                            {/* Post Stats */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                              <span className="text-white/50 text-sm">{selectedPost.timestamp}</span>
                              <div className="flex items-center gap-6 text-white/60">
                                <div className="flex items-center gap-2">
                                  <Eye size={16} />
                                  <span className="text-sm">{selectedPost.views}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart size={16} />
                                  <span className="text-sm">{selectedPost.likes}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageCircle size={16} />
                                  <span className="text-sm">{selectedPost.comments}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLikePost(selectedPost.id)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                                  selectedPost.isLiked
                                    ? 'bg-pink-500/20 text-pink-400 border border-pink-400/30'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                }`}
                              >
                                <Heart size={16} className={selectedPost.isLiked ? 'fill-current' : ''} />
                                {selectedPost.isLiked ? 'Нравится' : 'Нравится'}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  const comment = prompt('Введите ваш комментарий:');
                                  if (comment) {
                                    handleCommentPost(selectedPost.id, comment);
                                  }
                                }}
                                className="flex-1 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300"
                              >
                                <MessageCircle size={16} />
                                Комментировать
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSharePost(selectedPost.id)}
                                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                              >
                                <Share size={16} />
                              </motion.button>
                            </div>

                            {/* Comments Section */}
                            {selectedPost.commentsList && selectedPost.commentsList.length > 0 && (
                              <div className="space-y-4 pt-6 border-t border-white/10">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                  <MessageCircle size={16} />
                                  Комментарии ({selectedPost.commentsList.length})
                                </h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                  {selectedPost.commentsList.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-white/5">
                                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <img 
                                          src={comment.author.avatar} 
                                          alt={comment.author.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-white/90 text-sm font-medium">{comment.author.name}</span>
                                          <span className="text-white/50 text-xs">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-white/80 text-sm">{comment.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Liked By Section */}
                            {selectedPost.likedBy && selectedPost.likedBy.length > 0 && (
                              <div className="space-y-3 pt-4 border-t border-white/10">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                  <Heart size={16} />
                                  Понравилось ({selectedPost.likedBy.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPost.likedBy.slice(0, 8).map((like, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white/5 rounded-full py-1 px-3">
                                      <div className="w-5 h-5 rounded-full overflow-hidden">
                                        <img 
                                          src={like.avatar} 
                                          alt={like.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="text-white/70 text-xs">{like.name}</span>
                                    </div>
                                  ))}
                                  {selectedPost.likedBy.length > 8 && (
                                    <div className="flex items-center justify-center bg-white/5 rounded-full py-1 px-3">
                                      <span className="text-white/70 text-xs">+{selectedPost.likedBy.length - 8}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Portfolio Header */}
                <div className={`glass-card rounded-3xl p-6 relative ${isEditMode ? 'border-2 border-purple-400/50' : ''}`}>
                  {/* Edit Mode Indicator for Portfolio */}
                  {isOwner && isEditMode && (
                    <div className="absolute -top-2 left-4 bg-purple-500/90 backdrop-blur-xl px-2 py-1 rounded text-white text-xs font-medium shadow-lg border border-purple-400/50">
                      📝 Режим редактирования
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-xl font-medium flex items-center gap-2">
                      <Camera size={20} />
                      Портфолио
                    </h3>
                    {isOwner && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toast.success('Функция добавления работ скоро появится!')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus size={16} />
                        Добавить работу
                      </motion.button>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">
                    Избранные работы и проекты, демонстрирующие мои навыки и креативность
                  </p>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`glass-card rounded-3xl overflow-hidden relative ${isEditMode ? 'border-2 border-purple-400/30' : ''}`}
                    >
                      {/* Edit Button for Portfolio Item */}
                      {isOwner && isEditMode && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toast.success(`Редактирование работы: ${item.title} 📝`)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-500/80 backdrop-blur-xl border border-purple-400/50 flex items-center justify-center text-white shadow-lg hover:bg-purple-500 transition-all duration-300 z-10"
                        >
                          <Edit size={14} />
                        </motion.button>
                      )}
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-2">
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <h4 className="text-white font-medium text-lg mb-2">{item.title}</h4>
                        <p className="text-white/70 text-sm mb-4">{item.description}</p>
                        
                        {/* Technologies */}
                        {item.technologies && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white/5 text-white/60 border-white/20">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* View Project Button */}
                        {item.url && (
                          <motion.a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 text-sm"
                          >
                            <ExternalLink size={14} />
                            Посмотреть проект
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Contact Info */}
                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h3 className="text-white text-lg font-medium flex items-center gap-2">
                    <Mail size={18} />
                    Контакты
                  </h3>
                  
                  <div className="space-y-3">
                    {user.email && user.privacy?.showEmail && (
                      <div className="flex items-start gap-3">
                        <Mail size={16} className="text-white/60 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white/60 text-sm">Email</div>
                          <a 
                            href={`mailto:${user.email}`}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {user.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {user.phone && user.privacy?.showPhone && (
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-white/60 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white/60 text-sm">Телефон</div>
                          <a 
                            href={`tel:${user.phone}`}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {user.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-white/60 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-white/60 text-sm">Местоположение</div>
                        <div className="text-white">{user.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                  <div className="glass-card rounded-3xl p-6">
                    <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                      <Users size={18} />
                      Социальные сети
                    </h3>
                    <div className="space-y-3">
                      {user.socialLinks.instagram && (
                        <div className="flex items-center gap-3">
                          <Instagram size={16} className="text-white/60" />
                          <a 
                            href={user.socialLinks.instagram.startsWith('http') ? user.socialLinks.instagram : `https://instagram.com/${user.socialLinks.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            {extractUsername(user.socialLinks.instagram)}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      
                      {user.socialLinks.twitter && (
                        <div className="flex items-center gap-3">
                          <Twitter size={16} className="text-white/60" />
                          <a 
                            href={user.socialLinks.twitter.startsWith('http') ? user.socialLinks.twitter : `https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            {extractUsername(user.socialLinks.twitter)}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      
                      {user.socialLinks.linkedin && (
                        <div className="flex items-center gap-3">
                          <Linkedin size={16} className="text-white/60" />
                          <a 
                            href={user.socialLinks.linkedin.startsWith('http') ? user.socialLinks.linkedin : `https://linkedin.com/in/${user.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            {extractUsername(user.socialLinks.linkedin, 'linkedin')}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      
                      {user.socialLinks.github && (
                        <div className="flex items-center gap-3">
                          <Github size={16} className="text-white/60" />
                          <a 
                            href={user.socialLinks.github.startsWith('http') ? user.socialLinks.github : `https://github.com/${user.socialLinks.github.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            {extractUsername(user.socialLinks.github)}
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Site Settings (только для владельца) */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-3xl p-6"
              >
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Settings size={18} />
                  Настройки сайта
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Настройки темы скоро появятся!')}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-white font-medium mb-1">Тема сайта</div>
                    <div className="text-white/60 text-sm">Изменить оформление</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Настройки домена скоро появятся!')}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-white font-medium mb-1">Домен</div>
                    <div className="text-white/60 text-sm">Настроить URL</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('SEO настройки скоро появятся!')}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-white font-medium mb-1">SEO</div>
                    <div className="text-white/60 text-sm">Оптимизация поиска</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Аналитика скоро появится!')}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left"
                  >
                    <div className="text-white font-medium mb-1">Аналитика</div>
                    <div className="text-white/60 text-sm">Статистика посещений</div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center py-8"
            >
              <div className="text-white/40 text-sm mb-2">
                Создано с помощью
              </div>
              <div className="text-purple-400 font-medium">
                Bliq — Медиа социальная сеть суперсил
              </div>
              
              {/* Stats для посетителей */}
              {!isOwner && (
                <div className="flex justify-center gap-6 mt-4 text-white/50 text-sm">
                  <div>156 посещений</div>
                  <div>23 подписчика</div>
                  <div>Обновлен сегодня</div>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
      {/* Edit Post Modal */}
      {showEditPostModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseEditModal}
          />
          <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-medium">Редактировать пост</h3>
              <button
                onClick={handleCloseEditModal}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                ×
              </button>
            </div>
            
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Заголовок</label>
                <input
                  type="text"
                  defaultValue={editingPost.title}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Введите заголовок поста"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Содержание</label>
                <textarea
                  defaultValue={editingPost.content}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Напишите содержание поста..."
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Теги</label>
                <input
                  type="text"
                  defaultValue={editingPost.tags?.join(', ') || ''}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="тег1, тег2, тег3..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white font-medium transition-all duration-300"
                >
                  Отменить
                </button>
                <button
                  onClick={() => {
                    // В реальном приложении здесь была бы логика сохранения
                    toast.success(`Пост "${editingPost.title}" обновлен! ✨`);
                    handleCloseEditModal();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg transition-all duration-300"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppBackground>
  );
}