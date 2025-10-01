import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Share, Send, MoreHorizontal } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { ProfileAvatar } from './ProfileAvatar';
import { BottomNavigation } from './BottomNavigation';
import { BlikData } from './BlikCard';
import avatarImage from 'figma:asset/13a2eacd50ee49248f65bd0dde4638d5946ed903.png';

// Компонент для отображения аватаров лайкнувших пользователей
const LikedByAvatars = ({ 
  likedBy, 
  totalLikes 
}: { 
  likedBy: { name: string; avatar: string; }[], 
  totalLikes: number 
}) => {
  const displayedUsers = likedBy.slice(0, 3);
  const remainingCount = Math.max(0, totalLikes - displayedUsers.length);
  
  return (
    <div className="flex items-center gap-3">
      {/* Аватары лайкнувших пользователей */}
      <div className="flex -space-x-3">
        {displayedUsers.map((user, index) => (
          <div 
            key={index}
            className="relative rounded-full border-2 border-black overflow-hidden"
            style={{ zIndex: displayedUsers.length - index }}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Текст с именами */}
      <div className="text-white text-sm">
        {displayedUsers.length > 0 && (
          <span>
            Нравится{' '}
            <span className="font-medium">
              {displayedUsers.map((user, index) => (
                <span key={index}>
                  {user.name.split(' ')[0]}
                  {index < displayedUsers.length - 1 && index < 1 ? ', ' : ''}
                  {index === 1 && displayedUsers.length > 2 && ' '}
                </span>
              )).slice(0, 2)}
            </span>
            {remainingCount > 0 && (
              <span>
                {displayedUsers.length > 1 ? ' и еще ' : ''}
                <span className="font-medium">{remainingCount} {remainingCount === 1 ? 'человеку' : remainingCount < 5 ? 'людям' : 'людям'}</span>
              </span>
            )}
          </span>
        )}
        {displayedUsers.length === 0 && totalLikes > 0 && (
          <span>
            <span className="font-medium">{totalLikes}</span> {totalLikes === 1 ? 'лайк' : totalLikes < 5 ? 'лайка' : 'лайков'}
          </span>
        )}
      </div>
    </div>
  );
};

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface BlikDetailScreenProps {
  blik: BlikData;
  onBack: () => void;
  onLike: (blikId: string) => void;
  onComment: (blikId: string, comment: string) => void;
  onShare: (blikId: string) => void;
  onUserProfile: (userId: string) => void;
  onSidebar?: () => void;
  activeTab?: 'feed' | 'superpowers' | 'create' | 'trends' | 'profile';
  onTabChange?: (tab: 'feed' | 'superpowers' | 'create' | 'trends' | 'profile') => void;
}

export function BlikDetailScreen({
  blik,
  onBack,
  onLike,
  onComment,
  onShare,
  onUserProfile,
  onSidebar,
  activeTab = 'feed',
  onTabChange
}: BlikDetailScreenProps) {
  const [newComment, setNewComment] = useState('');
  
  // Используем комментарии из блика, если есть, иначе - моковые данные
  const comments = blik.commentsList || [
    {
      id: '1',
      author: {
        name: 'Алексей К.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Полностью согласен! Такой подход действительно работает 👍',
      timestamp: '1 час назад'
    },
    {
      id: '2',
      author: {
        name: 'Мария С.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Спасибо за вдохновение! Буду применять в своих проектах ✨',
      timestamp: '2 час назад'
    },
    {
      id: '3',
      author: {
        name: 'Игорь В.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Отличная работа! Давно ждал что-то подобное 🔥',
      timestamp: '3 часа назад'
    },
    {
      id: '4',
      author: {
        name: 'Елена Р.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Как всегда на высоте! Продолжай в том же духе 💪',
      timestamp: '4 часа назад'
    },
    {
      id: '5',
      author: {
        name: 'Дмитрий М.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      },
      content: 'Это именно то, что нужно было нашей команде. Супер!',
      timestamp: '5 часов назад'
    }
  ];

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment(blik.id, newComment.trim());
      setNewComment('');
    }
  };

  const getMediaContent = () => {
    if (!blik.mediaUrl) return null;

    if (blik.type === 'photo') {
      return (
        <div className="rounded-xl overflow-hidden mb-4 bg-black/20">
          <img 
            src={blik.mediaUrl} 
            alt="Blik media"
            className="w-full min-h-64 max-h-96 md:max-h-[28rem] object-cover"
          />
        </div>
      );
    }

    if (blik.type === 'video') {
      return (
        <div className="rounded-xl overflow-hidden mb-4 bg-gray-900/50 aspect-[16/9] min-h-64 md:min-h-80 lg:min-h-96 flex items-center justify-center relative">
          <div className="text-center text-white/60">
            <div className="text-6xl mb-4">🎥</div>
            <div className="text-base font-medium">Видео контент</div>
            <div className="text-sm mt-2 opacity-70">Нажмите для воспроизведения</div>
          </div>
          
          {/* Кнопка воспроизведения */}
          <button 
            className="absolute inset-0 flex items-center justify-center group"
            onClick={() => {
              // Здесь будет логика воспроизведения видео
              console.log('Play video:', blik.mediaUrl);
            }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <div className="w-0 h-0 border-l-[12px] md:border-l-[16px] border-l-white border-y-[8px] md:border-y-[10px] border-y-transparent ml-1"></div>
            </div>
          </button>
          
          {/* Индикатор продолжительности */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-white text-sm font-medium">3:42</span>
          </div>
          
          {/* Индикатор качества видео */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-medium">HD</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Контент с прокруткой */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Статус-бар */}
        <StatusBar />

        {/* Прокручиваемый контент */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ minHeight: 0 }}>
          {/* Центрированный контейнер */}
          <div className="max-w-lg mx-auto px-4 pt-1 md:max-w-xl lg:max-w-2xl md:px-6 lg:px-8">
            {/* Верхняя строка навигации */}
            <div className="flex items-center justify-between py-2 md:py-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="text-white p-1"
              >
                <ArrowLeft size={20} />
              </motion.button>

              {/* Миниаватарка пользователя для доступа к сайдбару */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSidebar || (() => {
                  console.log('Sidebar button clicked');
                  // Временная заглушка для тестирования
                })}
                className="
                  relative group
                  p-1 rounded-xl
                  hover:bg-white/10
                  backdrop-blur-xl
                  transition-all duration-300
                "
              >
                {/* Аватар с градиентной рамкой */}
                <div className="relative z-10 p-0.5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
                  <div className="p-0.5 rounded-full bg-slate-900">
                    <ProfileAvatar 
                      image={avatarImage}
                      isOnline={true}
                      size="small"
                    />
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Основной блик */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-xl bg-black/15 border border-white/20 rounded-2xl mb-5 overflow-hidden shadow-2xl"
            >
              <div className="p-4 md:p-6">
                {/* Заголовок с автором */}
                <div className="flex items-start gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUserProfile(blik.author.name)}
                  >
                    <ProfileAvatar 
                      image={blik.author.avatar} 
                      isOnline={blik.author.isOnline}
                      size="medium"
                    />
                  </motion.button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{blik.author.name}</h3>
                        <p className="text-white/60 text-sm">{blik.timestamp}</p>
                      </div>
                      
                      {/* Суперсила */}
                      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-2 py-1 md:px-3">
                        <span className="text-base md:text-lg">{blik.superpower.emoji}</span>
                        <span className="text-white text-xs md:text-sm font-medium">{blik.superpower.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Медиа контент */}
                {getMediaContent()}

                {/* Текст блика */}
                <p className="text-white text-base leading-relaxed mb-4">
                  {blik.content}
                </p>

                {/* Получатель */}
                <div className="flex items-center gap-2 mb-4 text-white/60 text-sm">
                  <span>Для</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUserProfile(blik.recipient.name)}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <img 
                      src={blik.recipient.avatar} 
                      alt={blik.recipient.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium">{blik.recipient.name}</span>
                  </motion.button>
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onLike(blik.id)}
                      className={`transition-colors ${
                        blik.isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                      }`}
                    >
                      <Heart size={24} className={blik.isLiked ? 'fill-current' : ''} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/60 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle size={24} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onShare(blik.id)}
                      className="text-white/60 hover:text-green-400 transition-colors"
                    >
                      <Share size={24} />
                    </motion.button>
                  </div>

                  <div className="text-white/40 text-sm">
                    {blik.timestamp}
                  </div>
                </div>

                {/* Аватары лайкнувших пользователей */}
                {blik.likes > 0 && blik.likedBy && blik.likedBy.length > 0 && (
                  <div className="mb-4">
                    <LikedByAvatars 
                      likedBy={blik.likedBy}
                      totalLikes={blik.likes}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Комментарии */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-xl bg-black/15 border border-white/20 rounded-2xl mb-6 overflow-hidden shadow-2xl"
            >
              <div className="p-4 md:p-6">
                <h3 className="text-white font-semibold mb-4">
                  Комментарии ({blik.comments})
                </h3>
                
                {/* Список комментариев */}
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onUserProfile(comment.author.name)}
                        className="flex-shrink-0"
                      >
                        <img 
                          src={comment.author.avatar} 
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full transition-all duration-200 hover:ring-2 hover:ring-purple-400/60 hover:shadow-lg"
                        />
                      </motion.button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onUserProfile(comment.author.name)}
                            className="text-white font-medium text-sm hover:text-purple-400 transition-colors"
                          >
                            {comment.author.name}
                          </motion.button>
                          <span className="text-white/50 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 text-white/50 hover:text-red-400 text-xs transition-colors">
                            <Heart size={12} />
                          </button>
                          <button className="text-white/50 hover:text-white text-xs transition-colors">
                            Ответить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Форма добавления комментария */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUserProfile('Risha Bliq')} 
                    className="flex-shrink-0"
                  >
                    <img 
                      src={blik.recipient.avatar} 
                      alt="Ваш аватар"
                      className="w-8 h-8 rounded-full transition-all duration-200 hover:ring-2 hover:ring-purple-400/60 hover:shadow-lg"
                    />
                  </motion.button>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Добавить комментарий..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:border-purple-500/50 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        newComment.trim()
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Отступ для безопасной зоны внизу и навигации */}
            <div className="pb-36 md:pb-32" />
          </div>
        </div>
      </div>

      {/* Нижняя навигация */}
      {onTabChange && (
        <div className="relative z-20 flex-shrink-0">
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </div>
      )}
    </div>
  );
}