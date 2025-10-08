import React, { memo } from 'react';
import { Heart, MessageCircle, Share, Play, Camera, FileText, MapPin } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

// Компонент для отображения аватаров лайкнувших пользователей
const LikedByAvatars = memo(function LikedByAvatars({ 
  likedBy, 
  totalLikes, 
  isLiked 
}: { 
  likedBy: { name: string; avatar: string; }[], 
  totalLikes: number,
  isLiked?: boolean 
}) {
  const displayedUsers = likedBy.slice(0, 3); // Показываем максимум 3 аватара
  const remainingCount = Math.max(0, totalLikes - displayedUsers.length);
  
  return (
    <div className="flex items-center gap-2">
      {/* Аватары лайкнувших пользователей */}
      <div className="flex -space-x-1 shrink-0 relative">
        {displayedUsers.map((user, index) => (
          <div 
            key={`avatar-${user.name}-${index}`}
            className="relative w-6 h-6 rounded-full border-2 border-background overflow-hidden shrink-0 bg-background/80"
            style={{ 
              zIndex: displayedUsers.length - index,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Текст с именами */}
      <div className="text-sm text-foreground">
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
});

// Компонент для отображения комментариев в карточке
const CommentsSection = memo(function CommentsSection({ 
  comments, 
  totalComments 
}: { 
  comments: {
    id: string;
    author: { name: string; avatar: string; };
    content: string;
    timestamp: string;
  }[], 
  totalComments: number 
}) {
  const displayedComments = comments.slice(0, 2); // Показываем первые 2 комментария
  const remainingCount = Math.max(0, totalComments - displayedComments.length);
  
  return (
    <div className="space-y-2">
      {displayedComments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          <img 
            src={comment.author.avatar} 
            alt={comment.author.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground">
              <span className="font-medium">{comment.author.name.split(' ')[0]}</span>
              {' '}
              <span className="text-foreground/90">{comment.content}</span>
            </div>
            <div className="text-xs mt-0.5 text-muted-foreground">
              {comment.timestamp}
            </div>
          </div>
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Посмотреть все {totalComments} {totalComments === 1 ? 'комментарий' : totalComments < 5 ? 'комментария' : 'комментариев'}
        </div>
      )}
    </div>
  );
});

export interface BlikData {
  id: string;
  type: 'photo' | 'video' | 'text';
  content: string;
  mediaUrl?: string;
  author: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  recipient: {
    name: string;
    avatar: string;
  };
  superpower: {
    name: string;
    emoji: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  likedBy?: {
    name: string;
    avatar: string;
  }[];
  commentsList?: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }[];
}

interface BlikCardProps {
  blik?: BlikData;
  data?: BlikData; // Add backward compatibility
  layout?: 'feed' | 'grid' | 'masonry';
  index?: number;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onBlikDetail?: (id: string) => void;
  onDetail?: (id: string) => void; // Alternative naming for TopScreen
  onUserProfile?: (userId: string) => void; // Add missing prop
  onSuperpowerClick?: (superpowerName: string) => void; // Добавлен новый пропс
  showRank?: boolean; // Показывать ранг в топе
  rank?: number; // Номер места в топе
}

export const BlikCard = memo(function BlikCard({ 
  blik,
  data, // backward compatibility
  layout = 'feed', 
  index = 0,
  onLike,
  onComment,
  onShare,
  onBlikDetail,
  onDetail,
  onUserProfile,
  onSuperpowerClick,
  showRank = false,
  rank
}: BlikCardProps) {
  // Use blik prop or fallback to data prop for backward compatibility
  const blikData = blik || data;
  
  // Safety check - return null if no data is provided
  if (!blikData) {
    return null; // Remove console.warn to reduce noise
  }

  // Safety check for required fields
  if (!blikData.author) {
    return null; // Remove console.warn to reduce noise
  }

  // Create safe data object with fallbacks
  const safeBlikData = {
    ...blikData,
    id: blikData.id || `blik-${Date.now()}`,
    type: blikData.type || 'text',
    author: {
      name: blikData.author?.name || 'Неизвестный пользователь',
      avatar: blikData.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: blikData.author?.isOnline ?? false
    },
    recipient: {
      name: blikData.recipient?.name || 'Неизвестный получатель',
      avatar: blikData.recipient?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    superpower: {
      name: blikData.superpower?.name || 'Суперсила',
      emoji: blikData.superpower?.emoji || '⭐'
    },
    content: blikData.content || 'Контент блика',
    timestamp: blikData.timestamp || 'недавно',
    likes: blikData.likes || 0,
    comments: blikData.comments || 0,
    isLiked: blikData.isLiked ?? false,
    likedBy: blikData.likedBy || [],
    commentsList: blikData.commentsList || []
  };
  
  const getTypeIcon = () => {
    switch (safeBlikData.type) {
      case 'photo': return <Camera size={14} className="text-blue-400" />;
      case 'video': return <Play size={14} className="text-red-400" />;
      case 'text': return <FileText size={14} className="text-green-400" />;
    }
  };

  // Обработчик клика по карточке с предотвращением всплытия для кнопок
  const handleCardClick = (e: React.MouseEvent) => {
    // Проверяем, что клик не был по кнопке
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return; // Не открываем детали если кликнули по кнопке
    }
    // Поддержка обоих вариантов пропсов
    (onBlikDetail || onDetail)?.(safeBlikData.id);
  };

  // Grid layout для больших экранов - компактный
  if (layout === 'grid') {
    return (
      <div 
        className="glass-card rounded-xl overflow-hidden shadow-xl transition-all duration-300 mb-6 cursor-pointer hover:bg-accent"
        onClick={handleCardClick}
      >
        {/* Компактный header */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ProfileAvatar 
                image={safeBlikData.author.avatar}
                isOnline={safeBlikData.author.isOnline}
                size="small"
                isBrandLogo={safeBlikData.author.avatar?.includes('f264197d0dfa11757e4a661e9aace4fad7102f83')}
                onClick={() => onUserProfile?.(safeBlikData.author.name)}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate text-foreground">{safeBlikData.author.name}</div>
                <div className="text-xs truncate text-muted-foreground">
                  для {safeBlikData.recipient.name}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSuperpowerClick?.(safeBlikData.superpower.name);
              }}
              className="flex items-center gap-1 bg-primary/20 hover:bg-primary/30 rounded-full px-2 py-1 transition-all duration-200 hover:scale-105"
              title={`Перейти к суперсиле: ${safeBlikData.superpower.name}`}
            >
              <span className="text-xs">{safeBlikData.superpower.emoji}</span>
              <span className="text-foreground text-xs font-medium truncate max-w-16">{safeBlikData.superpower.name}</span>
            </button>
          </div>
        </div>

        {/* Медиа контент - компактная высота */}
        {safeBlikData.type === 'photo' && safeBlikData.mediaUrl && (
          <div className="relative w-full">
            <img 
              src={safeBlikData.mediaUrl} 
              alt="Блик фото"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {safeBlikData.type === 'video' && safeBlikData.mediaUrl && (
          <div className="relative w-full bg-black/30">
            <img 
              src={safeBlikData.mediaUrl} 
              alt="Видео превью"
              className="w-full aspect-[16/9] min-h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                <Play size={20} className="text-white ml-1" />
              </div>
            </div>
            
            {/* Компактный индикатор времени */}
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
              <span className="text-white text-xs">3:42</span>
            </div>
          </div>
        )}

        {/* Текстовый контент - Glass эффект */}
        {safeBlikData.type === 'text' && (
          <div className="px-3 py-4 glass-card border border-purple-500/30 mx-3 my-2 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              {getTypeIcon()}
              <span className="text-foreground/70 text-xs">Текстовый блик</span>
            </div>
            <div className="text-foreground text-sm leading-relaxed line-clamp-3">
              {safeBlikData.content}
            </div>
          </div>
        )}

        {/* Компактный footer */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(safeBlikData.id);
                }}
                className={`transition-colors ${
                  safeBlikData.isLiked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'
                }`}
              >
                <Heart size={18} className={safeBlikData.isLiked ? 'fill-current' : ''} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComment?.(safeBlikData.id);
                }}
                className="text-muted-foreground hover:text-blue-400 transition-colors"
              >
                <MessageCircle size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(safeBlikData.id);
                }}
                className="text-muted-foreground hover:text-green-400 transition-colors"
              >
                <Share size={18} />
              </button>
            </div>
            <div className="text-muted-foreground text-xs">
              {safeBlikData.timestamp}
            </div>
          </div>

          {/* Компактная информация о лайках */}
          {safeBlikData.likes > 0 && (
            <div className="text-foreground text-xs">
              <span className="font-medium">{safeBlikData.likes}</span> {safeBlikData.likes === 1 ? 'лайк' : safeBlikData.likes < 5 ? 'лайка' : 'лайков'}
            </div>
          )}

          {/* Краткое описание */}
          {(safeBlikData.type === 'photo' || safeBlikData.type === 'video') && (
            <div className="text-foreground text-xs leading-relaxed mt-1 line-clamp-2">
              {safeBlikData.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Instagram-стиль карточка (feed layout)
  return (
    <div 
      className={`glass-card rounded-xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer hover:bg-accent ${index === 0 ? 'mt-2 mb-6' : 'mb-6 last:mb-8'} relative`}
      onClick={handleCardClick}
    >
      {/* Ранк бейдж для топов */}
      {showRank && rank && (
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm energy-glow shadow-lg">
          {rank}
        </div>
      )}
      
      {/* Header - как в Instagram */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <ProfileAvatar 
              image={safeBlikData.author.avatar}
              isOnline={safeBlikData.author.isOnline}
              size="small"
              isBrandLogo={safeBlikData.author.avatar?.includes('f264197d0dfa11757e4a661e9aace4fad7102f83')}
              onClick={() => onUserProfile?.(safeBlikData.author.name)}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate text-foreground">{safeBlikData.author.name}</div>
              <div className="text-xs truncate text-muted-foreground">
                {safeBlikData.timestamp}
              </div>
            </div>
          </div>
          
          {/* Суперсила - убрали MapPin иконку */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSuperpowerClick?.(safeBlikData.superpower.name);
              }}
              className="flex items-center gap-1 bg-primary/20 hover:bg-primary/30 rounded-full px-2 py-1 max-w-32 transition-all duration-200 hover:scale-105"
              title={`Перейти к суперсиле: ${safeBlikData.superpower.name}`}
            >
              <span className="text-xs shrink-0">{safeBlikData.superpower.emoji}</span>
              <span className="text-foreground text-xs font-medium truncate">{safeBlikData.superpower.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Медиа контент - адаптивная ширина с равномерными краями */}
      {safeBlikData.type === 'photo' && safeBlikData.mediaUrl && (
        <div className="relative w-full">
          <img 
            src={safeBlikData.mediaUrl} 
            alt="Блик фото"
            className="w-full h-80 object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
            {getTypeIcon()}
          </div>
        </div>
      )}

      {safeBlikData.type === 'video' && safeBlikData.mediaUrl && (
        <div className="relative w-full bg-black/30">
          <img 
            src={safeBlikData.mediaUrl} 
            alt="Видео превью"
            className="w-full aspect-[16/9] min-h-72 md:min-h-80 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-5 md:p-6 border border-white/20">
              <Play size={32} className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
            {getTypeIcon()}
          </div>
          
          {/* Индикатор продолжительности видео */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-medium">3:42</span>
          </div>
        </div>
      )}

      {/* Текстовый контент - Glass эффект */}
      {safeBlikData.type === 'text' && (
        <div className="px-4 py-6 glass-card border border-purple-500/30 mx-4 my-3 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            {getTypeIcon()}
            <span className="text-foreground/70 text-xs">Текстовый блик</span>
          </div>
          <div className="text-foreground text-sm leading-relaxed">
            {safeBlikData.content}
          </div>
        </div>
      )}

      {/* Footer с действиями и описанием */}
      <div className="px-4 py-3">
        {/* Действия (лайк, комментарий, поделиться) */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(safeBlikData.id);
            }}
            className={`transition-colors ${
              safeBlikData.isLiked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'
            }`}
          >
            <Heart size={24} className={safeBlikData.isLiked ? 'fill-current' : ''} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.(safeBlikData.id);
            }}
            className="text-muted-foreground hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(safeBlikData.id);
            }}
            className="text-muted-foreground hover:text-green-400 transition-colors"
          >
            <Share size={24} />
          </button>
        </div>

        {/* Описание блика (только для фото/видео) */}
        {(safeBlikData.type === 'photo' || safeBlikData.type === 'video') && (
          <div className="text-foreground text-sm leading-relaxed mb-3">
            {safeBlikData.content}
          </div>
        )}
      </div>
    </div>
  );
});