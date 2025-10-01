import { motion } from 'motion/react';
import { X, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface BlogImageUploaderProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export function BlogImageUploader({ onSelect, onClose }: BlogImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Можно загружать только изображения');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Размер файла не должен превышать 10MB');
      return;
    }

    setIsUploading(true);
    try {
      // Создаем URL для предпросмотра
      const imageUrl = URL.createObjectURL(file);
      
      // В реальном приложении здесь был бы запрос на сервер для загрузки файла
      // Пока используем локальный URL для демонстрации
      
      onSelect(imageUrl);
      toast.success('Изображение загружено! 📸');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-card rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-medium text-lg">
            Загрузить изображение
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-white/30 hover:border-white/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white/70 text-sm">Загружаем изображение...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ImageIcon size={28} className="text-white" />
              </div>
              
              <div className="text-center">
                <h4 className="text-white font-medium mb-1">
                  {dragOver ? 'Отпусти, чтобы загрузить' : 'Перетащи изображение сюда'}
                </h4>
                <p className="text-white/60 text-sm">
                  или нажми кнопку ниже
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openFileDialog}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload size={16} />
                  Выбрать файл
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // В будущем здесь можно добавить функцию камеры
                    toast.success('Камера скоро будет доступна! 📷');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300"
                >
                  <Camera size={16} />
                  Камера
                </motion.button>
              </div>

              <p className="text-white/40 text-xs mt-2">
                Поддерживаются: JPG, PNG, GIF (до 10MB)
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            Отмена
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}