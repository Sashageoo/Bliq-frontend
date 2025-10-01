import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  Type, 
  Image, 
  Video, 
  Music, 
  Link, 
  Hash, 
  X,
  FileText,
  Eye,
  Upload,
  ChevronDown,
  GripVertical,
  Trash2,
  Camera
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BlogImageUploader } from './BlogImageUploader';
import { toast } from 'sonner@2.0.3';

interface ContentBlock {
  id: string;
  type: 'title' | 'text' | 'image' | 'video' | 'track' | 'link' | 'tags' | null;
  content: string;
  metadata?: {
    url?: string;
    caption?: string;
    alt?: string;
  };
}

interface CompactBlogEditorProps {
  onBack: () => void;
  onSave: (data: {
    blocks: ContentBlock[];
    isPublic: boolean;
  }) => void;
}

const BLOCK_TYPES = [
  { 
    value: 'title', 
    label: 'Заголовок', 
    icon: Type,
    placeholder: 'Введите заголовок...'
  },
  { 
    value: 'text', 
    label: 'Текст', 
    icon: FileText,
    placeholder: 'Введите текст...'
  },
  { 
    value: 'image', 
    label: 'Фото', 
    icon: Image,
    placeholder: 'URL изображения или выберите файл...'
  },
  { 
    value: 'video', 
    label: 'Видео', 
    icon: Video,
    placeholder: 'Введите название или URL видео...'
  },
  { 
    value: 'track', 
    label: 'Трек', 
    icon: Music,
    placeholder: 'Введите название трека...'
  },
  { 
    value: 'link', 
    label: 'Ссылка', 
    icon: Link,
    placeholder: 'https://example.com'
  },
  { 
    value: 'tags', 
    label: 'Теги', 
    icon: Hash,
    placeholder: 'тег1, тег2, тег3...'
  }
];

export function CompactBlogEditor({ onBack, onSave }: CompactBlogEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState<string | null>(null);
  const [showImageUploader, setShowImageUploader] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Генерируем уникальный ID для блока
  const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Добавляем новый блок
  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: generateBlockId(),
      type: null,
      content: ''
    };
    setBlocks(prev => [...prev, newBlock]);
    setShowBlockSelector(newBlock.id);
  };

  // Удаляем блок
  const removeBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setShowBlockSelector(null);
  };

  // Изменяем тип блока
  const updateBlockType = (blockId: string, type: ContentBlock['type']) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, type, content: '' }
        : block
    ));
    setShowBlockSelector(null);
  };

  // Изменяем содержимое блока
  const updateBlockContent = (blockId: string, content: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, content }
        : block
    ));
  };

  // Изменяем порядок блоков (drag & drop)
  const reorderBlocks = (newOrder: ContentBlock[]) => {
    setBlocks(newOrder);
  };

  // Обработка выбора изображения
  const handleImageSelect = (blockId: string, imageUrl: string) => {
    updateBlockContent(blockId, imageUrl);
    setShowImageUploader(null);
  };

  // Сохранение поста
  const handleSave = () => {
    const validBlocks = blocks.filter(block => block.type && block.content.trim());
    
    if (validBlocks.length === 0) {
      toast.error('Добавьте хотя бы один блок контента!');
      return;
    }

    onSave({
      blocks: validBlocks,
      isPublic: true
    });
    
    toast.success('Пост сохранен! ✨');
  };

  // Рендерим содержимое блока в зависимости от типа
  const renderBlockContent = (block: ContentBlock) => {
    if (!block.type) {
      return (
        <div className="p-4">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Выберите тип блока:</p>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((blockType) => (
                <motion.button
                  key={blockType.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateBlockType(block.id, blockType.value as ContentBlock['type'])}
                  className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200 text-sm"
                >
                  <blockType.icon size={16} />
                  <span>{blockType.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const blockType = BLOCK_TYPES.find(t => t.value === block.type);
    
    switch (block.type) {
      case 'title':
        return (
          <div className="p-4">
            <Input
              placeholder={blockType?.placeholder}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              className="bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400 text-lg font-semibold"
            />
          </div>
        );
        
      case 'text':
        return (
          <div className="p-4">
            <Textarea
              placeholder={blockType?.placeholder}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              className="bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400 min-h-[120px] resize-none"
            />
          </div>
        );
        
      case 'image':
        return (
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder={blockType?.placeholder}
                  value={block.content}
                  onChange={(e) => updateBlockContent(block.id, e.target.value)}
                  className="flex-1 bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={() => setShowImageUploader(block.id)}
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/30 border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/50"
                >
                  <Camera size={16} />
                </Button>
              </div>
              {block.content && (block.content.startsWith('http') || block.content.startsWith('blob:')) && (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={block.content} 
                    alt="Uploaded" 
                    className="w-full h-auto max-h-60 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      case 'video':
      case 'track':
      case 'link':
        return (
          <div className="p-4">
            <Input
              placeholder={blockType?.placeholder}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              className="bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400"
            />
          </div>
        );
        
      case 'tags':
        return (
          <div className="p-4">
            <Input
              placeholder={blockType?.placeholder}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              className="bg-slate-700/30 border-slate-600/50 text-white placeholder:text-slate-400"
            />
            {block.content && (
              <div className="flex flex-wrap gap-1 mt-3">
                {block.content.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  return (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-md text-xs border border-purple-500/30"
                    >
                      #{trimmedTag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Рендер предпросмотра
  const renderPreview = () => {
    const validBlocks = blocks.filter(block => block.type && block.content.trim());
    
    if (validBlocks.length === 0) {
      return (
        <div className="text-center py-12 text-slate-400">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>Добавь блоки чтобы увидеть предпросмотр</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {validBlocks.map((block, index) => {
          switch (block.type) {
            case 'title':
              return (
                <h1 key={block.id} className="text-2xl font-bold text-white">
                  {block.content}
                </h1>
              );
            
            case 'text':
              return (
                <p key={block.id} className="text-slate-200 leading-relaxed">
                  {block.content}
                </p>
              );
            
            case 'image':
              return (block.content.startsWith('http') || block.content.startsWith('blob:')) ? (
                <img 
                  key={block.id}
                  src={block.content} 
                  alt="Post image" 
                  className="w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    // Если изображение не загрузилось, скрываем его
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                block.content && (
                  <div key={block.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 text-slate-400 text-sm">
                    🖼️ Изображение: {block.content}
                  </div>
                )
              );
            
            case 'video':
              return (
                <div key={block.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Video size={20} />
                    <span>Видео: {block.content}</span>
                  </div>
                </div>
              );
            
            case 'track':
              return (
                <div key={block.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Music size={20} />
                    <span>Трек: {block.content}</span>
                  </div>
                </div>
              );
            
            case 'link':
              return (
                <div key={block.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <a 
                    href={block.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Link size={20} />
                    <span>{block.content}</span>
                  </a>
                </div>
              );
            
            case 'tags':
              return (
                <div key={block.id} className="flex flex-wrap gap-2">
                  {block.content.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                      >
                        #{trimmedTag}
                      </span>
                    );
                  })}
                </div>
              );
            
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      <StatusBar />
      
      {/* Header - фиксированный */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all duration-300"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 className="text-white text-lg font-medium">
              {isPreview ? 'Предпросмотр поста' : 'Редактор блога'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/50"
            >
              <Eye size={16} className="mr-2" />
              {isPreview ? 'Редактор' : 'Превью'}
            </Button>
            
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              Опубликовать
            </Button>
          </div>
        </div>
      </div>

      {/* Основной контент - прокручиваемый */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 max-w-4xl mx-auto pb-20">
          <AnimatePresence mode="wait">
            {isPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-2xl p-6"
              >
                {renderPreview()}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Блоки контента с drag&drop */}
                <Reorder.Group
                  axis="y"
                  values={blocks}
                  onReorder={reorderBlocks}
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {blocks.map((block, index) => {
                      const blockType = BLOCK_TYPES.find(t => t.value === block.type);
                      
                      return (
                        <Reorder.Item
                          key={block.id}
                          value={block}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          whileDrag={{ scale: 1.05, zIndex: 10 }}
                          className="glass-card rounded-xl border border-slate-600/30 overflow-hidden group hover:border-purple-500/30 transition-all duration-300 cursor-grab active:cursor-grabbing"
                        >
                          {/* Заголовок блока */}
                          <div className="flex items-center justify-between p-3 bg-slate-700/20 border-b border-slate-600/30">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2 text-slate-400">
                                <GripVertical size={16} className="text-slate-500" />
                                {blockType ? (
                                  <>
                                    <blockType.icon size={16} />
                                    <span className="text-sm font-medium">{blockType.label}</span>
                                  </>
                                ) : (
                                  <span className="text-sm">Новый блок</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {/* Кнопка удаления */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeBlock(block.id)}
                                className="w-7 h-7 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center"
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Содержимое блока */}
                          <div className="p-0">
                            {renderBlockContent(block)}
                          </div>
                        </Reorder.Item>
                      );
                    })}
                  </AnimatePresence>
                </Reorder.Group>
                
                {/* Яркая кнопка добавления нового блока */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addBlock}
                  className="relative w-full p-6 border-2 border-dashed border-purple-500/50 rounded-2xl hover:border-purple-400/70 text-white transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30"
                >
                  {/* Фоновое свечение */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  {/* Иконка с анимацией */}
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg relative z-10"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={20} className="text-white" />
                  </motion.div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Добавить новый блок
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Модальное окно загрузки изображений */}
      <AnimatePresence>
        {showImageUploader && (
          <BlogImageUploader
            onSelect={(imageUrl) => handleImageSelect(showImageUploader, imageUrl)}
            onClose={() => setShowImageUploader(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}