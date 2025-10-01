import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  Type, 
  Image, 
  Video, 
  Music, 
  Link, 
  Hash, 
  User, 
  Settings, 
  Send,
  X,
  FileText,
  Sparkles,
  Eye,
  Users,
  Tag,
  Search,
  Upload
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface ContentBlock {
  id: string;
  type: 'title' | 'description' | 'image' | 'video' | 'audio' | 'link' | 'tags';
  content: string;
  metadata?: {
    url?: string;
    caption?: string;
    alt?: string;
  };
}

interface NotificationTarget {
  id: string;
  name: string;
  avatar: string;
  isRequired: boolean;
}

interface Superpower {
  name: string;
  emoji: string;
  category?: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface ModernCreateScreenProps {
  superpowers: Superpower[];
  friends: Friend[];
  onBack: () => void;
  onCreatePost: (data: {
    blocks: ContentBlock[];
    targetUsers: NotificationTarget[];
    superpowerId?: string;
    isPublic: boolean;
  }) => void;
  onCreateSuperpower: (data: {
    name: string;
    emoji: string;
    category: string;
  }) => string;
  unsplashTool?: (query: string) => Promise<string>;
}

const BLOCK_TYPES = [
  { 
    type: 'title' as const, 
    label: 'Заголовок', 
    icon: FileText, 
    placeholder: 'Введи заголовок поста...',
    description: 'Главный заголовок твоего поста'
  },
  { 
    type: 'description' as const, 
    label: 'Описание', 
    icon: Type, 
    placeholder: 'Расскажи подробнее...',
    description: 'Основное содержание поста'
  },
  { 
    type: 'image' as const, 
    label: 'Изображение', 
    icon: Image, 
    placeholder: 'Ссылка на изображение',
    description: 'Добавь визуальный контент'
  },
  { 
    type: 'video' as const, 
    label: 'Видео', 
    icon: Video, 
    placeholder: 'Ссылка на видео',
    description: 'Поделись видеоконтентом'
  },
  { 
    type: 'audio' as const, 
    label: 'Аудио/Трек', 
    icon: Music, 
    placeholder: 'Ссылка на трек',
    description: 'Музыка или аудиозапись'
  },
  { 
    type: 'link' as const, 
    label: 'Ссылка', 
    icon: Link, 
    placeholder: 'https://example.com',
    description: 'Полезная ссылка'
  },
  { 
    type: 'tags' as const, 
    label: 'Теги', 
    icon: Hash, 
    placeholder: 'тег1, тег2, тег3',
    description: 'Хештеги для категоризации'
  }
];

export function ModernCreateScreen({
  superpowers,
  friends,
  onBack,
  onCreatePost,
  onCreateSuperpower,
  unsplashTool
}: ModernCreateScreenProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [targetUsers, setTargetUsers] = useState<NotificationTarget[]>([]);
  const [selectedSuperpower, setSelectedSuperpower] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showTargetUsers, setShowTargetUsers] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [searchingImage, setSearchingImage] = useState(false);
  const [imageSearchBlockId, setImageSearchBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    setEditingBlock(newBlock.id);
    setShowBlockMenu(false);
  }, []);

  const updateBlock = useCallback((id: string, content: string, metadata?: ContentBlock['metadata']) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, content, metadata: { ...block.metadata, ...metadata } } : block
    ));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    if (editingBlock === id) {
      setEditingBlock(null);
    }
  }, [editingBlock]);

  const toggleTargetUser = useCallback((user: Friend) => {
    setTargetUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          isRequired: true
        }];
      }
    });
  }, []);

  const handleSearchImage = useCallback(async () => {
    if (!unsplashTool || !imageSearchQuery.trim() || !imageSearchBlockId) return;
    
    setSearchingImage(true);
    try {
      const imageUrl = await unsplashTool(imageSearchQuery);
      updateBlock(imageSearchBlockId, imageUrl);
      setShowImageSearch(false);
      setImageSearchQuery('');
      setImageSearchBlockId(null);
      toast.success('Изображение добавлено! 🖼️');
    } catch (error) {
      toast.error('Не удалось найти изображение');
    } finally {
      setSearchingImage(false);
    }
  }, [unsplashTool, imageSearchQuery, imageSearchBlockId, updateBlock]);

  const openImageSearch = useCallback((blockId: string) => {
    setImageSearchBlockId(blockId);
    setShowImageSearch(true);
  }, []);

  const handlePublish = useCallback(() => {
    if (blocks.length === 0) {
      toast.error('Добавь хотя бы один блок контента!');
      return;
    }

    onCreatePost({
      blocks,
      targetUsers,
      superpowerId: selectedSuperpower,
      isPublic
    });
  }, [blocks, targetUsers, selectedSuperpower, isPublic, onCreatePost]);

  const getBlockIcon = (type: ContentBlock['type']) => {
    const blockType = BLOCK_TYPES.find(bt => bt.type === type);
    return blockType?.icon || Type;
  };

  const getBlockLabel = (type: ContentBlock['type']) => {
    const blockType = BLOCK_TYPES.find(bt => bt.type === type);
    return blockType?.label || 'Блок';
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Статус бар */}
      <StatusBar />

      {/* Заголовок */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <h1 className="text-white text-lg font-medium">Создать пост</h1>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePublish}
          disabled={blocks.length === 0}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            blocks.length > 0
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          <Send size={16} className="mr-2" />
          Опубликовать
        </motion.button>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-6">
          
          {/* Блоки контента */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-lg font-medium">Контент</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBlockMenu(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300"
              >
                <Plus size={16} />
                Добавить блок
              </motion.button>
            </div>

            {/* Список блоков */}
            <AnimatePresence>
              {blocks.map((block, index) => {
                const BlockIcon = getBlockIcon(block.type);
                const isEditing = editingBlock === block.id;
                
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                          <BlockIcon size={16} className="text-purple-400" />
                        </div>
                        <span className="text-white font-medium">{getBlockLabel(block.type)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingBlock(isEditing ? null : block.id)}
                          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                          <Settings size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeBlock(block.id)}
                          className="p-1 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Контент блока */}
                    {block.type === 'description' ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder={BLOCK_TYPES.find(bt => bt.type === block.type)?.placeholder}
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                        />
                        <div className="text-right">
                          <span className={`text-xs ${
                            block.content.length > 500 ? 'text-red-400' : 
                            block.content.length > 300 ? 'text-yellow-400' : 'text-white/40'
                          }`}>
                            {block.content.length}/500 символов
                          </span>
                        </div>
                      </div>
                    ) : block.type === 'tags' ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Введи теги через запятую"
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                        {block.content && (
                          <div className="flex flex-wrap gap-2">
                            {block.content.split(',').filter(tag => tag.trim()).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                #{tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          placeholder={BLOCK_TYPES.find(bt => bt.type === block.type)?.placeholder}
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                        {/* Счетчик символов для заголовка */}
                        {block.type === 'title' && (
                          <div className="text-right">
                            <span className={`text-xs ${
                              block.content.length > 100 ? 'text-red-400' : 
                              block.content.length > 60 ? 'text-yellow-400' : 'text-white/40'
                            }`}>
                              {block.content.length}/100 символов
                            </span>
                          </div>
                        )}
                        {/* Кнопка поиска изображений для блоков изображений */}
                        {block.type === 'image' && unsplashTool && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openImageSearch(block.id)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/25 text-sm transition-all duration-300"
                          >
                            <Search size={14} />
                            Найти изображение
                          </motion.button>
                        )}
                        {/* Предварительный просмотр изображения */}
                        {block.type === 'image' && block.content && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                            <img 
                              src={block.content} 
                              alt={block.metadata?.alt || "Preview"} 
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Дополнительные поля для медиа */}
                    {isEditing && ['image', 'video', 'audio'].includes(block.type) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/10 space-y-2"
                      >
                        <Input
                          placeholder="Подпись к медиа (опционально)"
                          value={block.metadata?.caption || ''}
                          onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, caption: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm"
                        />
                        {block.type === 'image' && (
                          <Input
                            placeholder="Alt-текст для изображения"
                            value={block.metadata?.alt || ''}
                            onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, alt: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm"
                          />
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {blocks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Sparkles size={24} className="text-purple-400" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Начни создавать</h3>
                <p className="text-white/60 text-sm mb-4">Добавь блоки контента чтобы создать пост</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockMenu(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25"
                >
                  <Plus size={16} />
                  Добавить первый блок
                </motion.button>
              </div>
            )}
          </div>

          {/* Предварительный просмотр */}
          {blocks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-white text-lg font-medium">Предварительный просмотр</h2>
              
              <div className="glass-card rounded-2xl p-4 border-2 border-dashed border-purple-400/30">
                <div className="space-y-3">
                  {blocks.map((block) => {
                    const BlockIcon = getBlockIcon(block.type);
                    
                    if (!block.content.trim()) return null;
                    
                    return (
                      <div key={block.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BlockIcon size={14} className="text-purple-400" />
                          <span className="text-white/60 text-xs uppercase font-medium">{getBlockLabel(block.type)}</span>
                        </div>
                        
                        {block.type === 'title' && (
                          <h3 className="text-white text-lg font-bold">{block.content}</h3>
                        )}
                        
                        {block.type === 'description' && (
                          <p className="text-white/80 text-sm leading-relaxed">{block.content}</p>
                        )}
                        
                        {block.type === 'image' && (
                          <div className="rounded-lg overflow-hidden">
                            <img 
                              src={block.content} 
                              alt={block.metadata?.alt || ""} 
                              className="w-full h-32 object-cover"
                            />
                            {block.metadata?.caption && (
                              <p className="text-white/60 text-xs p-2 bg-black/20">{block.metadata.caption}</p>
                            )}
                          </div>
                        )}
                        
                        {block.type === 'video' && (
                          <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30">
                            <div className="flex items-center gap-2 mb-1">
                              <Video size={14} className="text-red-400" />
                              <span className="text-red-300 text-sm font-medium">Видео</span>
                            </div>
                            <p className="text-white/80 text-sm">{block.content}</p>
                          </div>
                        )}
                        
                        {block.type === 'audio' && (
                          <div className="p-3 rounded-lg bg-green-500/20 border border-green-400/30">
                            <div className="flex items-center gap-2 mb-1">
                              <Music size={14} className="text-green-400" />
                              <span className="text-green-300 text-sm font-medium">Аудио</span>
                            </div>
                            <p className="text-white/80 text-sm">{block.content}</p>
                          </div>
                        )}
                        
                        {block.type === 'link' && (
                          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
                            <div className="flex items-center gap-2 mb-1">
                              <Link size={14} className="text-blue-400" />
                              <span className="text-blue-300 text-sm font-medium">Ссылка</span>
                            </div>
                            <a href={block.content} className="text-blue-300 text-sm underline break-all">{block.content}</a>
                          </div>
                        )}
                        
                        {block.type === 'tags' && (
                          <div className="flex flex-wrap gap-2">
                            {block.content.split(',').filter(tag => tag.trim()).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                #{tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Настройки поста */}
          <div className="space-y-4">
            <h2 className="text-white text-lg font-medium">Настройки</h2>
            
            {/* Суперсила */}
            <div className="glass-card rounded-2xl p-4">
              <label className="block text-white font-medium mb-3">Связанная суперсила</label>
              <select
                value={selectedSuperpower}
                onChange={(e) => setSelectedSuperpower(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Выбери суперсилу</option>
                {superpowers.map((superpower) => (
                  <option key={superpower.name} value={superpower.name} className="bg-gray-800">
                    {superpower.emoji} {superpower.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Обязательные зрители */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-medium">Кто должен увидеть</label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTargetUsers(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 hover:text-white text-sm"
                >
                  <Eye size={14} />
                  Выбрать
                </motion.button>
              </div>
              
              {targetUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {targetUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30"
                    >
                      <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full" />
                      <span className="text-orange-300 text-sm">{user.name}</span>
                      <button
                        onClick={() => setTargetUsers(prev => prev.filter(u => u.id !== user.id))}
                        className="text-orange-300 hover:text-orange-200"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-sm">Пост будет виден всем подписчикам</p>
              )}
            </div>

            {/* Публичность */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Публичный пост</label>
                  <p className="text-white/60 text-sm">Виден всем пользователям в ленте</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    isPublic ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: isPublic ? 24 : 0 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Меню выбора блока */}
      <AnimatePresence>
        {showBlockMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowBlockMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-h-[80vh] overflow-y-auto glass-card rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-medium">Добавить блок</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockMenu(false)}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {BLOCK_TYPES.map((blockType) => {
                  const Icon = blockType.icon;
                  return (
                    <motion.button
                      key={blockType.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addBlock(blockType.type)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{blockType.label}</h4>
                        <p className="text-white/60 text-sm">{blockType.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Меню выбора целевых пользователей */}
      <AnimatePresence>
        {showTargetUsers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowTargetUsers(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-h-[80vh] overflow-y-auto glass-card rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-medium">Кто должен увидеть</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTargetUsers(false)}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-3">
                {friends.map((friend) => {
                  const isSelected = targetUsers.some(u => u.id === friend.id);
                  return (
                    <motion.button
                      key={friend.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleTargetUser(friend)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 w-full text-left ${
                        isSelected
                          ? 'bg-orange-500/20 border-orange-400/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{friend.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-white/60 text-sm">
                            {friend.isOnline ? 'Онлайн' : 'Офлайн'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <Users size={12} className="text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно поиска изображений */}
      <AnimatePresence>
        {showImageSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-medium">Поиск изображения</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImageSearch(false)}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <Input
                    placeholder="creative workspace, nature landscape..."
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchImage()}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowImageSearch(false)}
                    className="flex-1 py-2 px-4 rounded-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300"
                  >
                    Отмена
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearchImage}
                    disabled={!imageSearchQuery.trim() || searchingImage}
                    className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {searchingImage ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Поиск...
                      </div>
                    ) : (
                      'Найти'
                    )}
                  </motion.button>
                </div>

                <div className="text-center">
                  <p className="text-white/60 text-xs">
                    Предложения: "creative workspace", "nature landscape", "modern office", "abstract art"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}