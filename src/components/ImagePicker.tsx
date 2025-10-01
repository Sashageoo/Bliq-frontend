import { motion } from 'motion/react';
import { X, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface ImagePickerProps {
  type: 'avatar' | 'background';
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
  unsplashTool: (query: string) => Promise<string>;
}

export function ImagePicker({ type, onSelect, onClose, unsplashTool }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    setLoading(true);
    try {
      const queries = type === 'avatar' 
        ? ['professional portrait', 'business person', 'creative professional', 'young professional', 'tech person', 'designer portrait']
        : ['abstract gradient', 'mountain landscape', 'ocean sunset', 'forest nature', 'night sky', 'urban sunset'];
      
      const imagePromises = queries.map(query => unsplashTool(query));
      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      // Fallback изображения
      const fallbackImages = type === 'avatar' 
        ? [
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1539571696285-e7d0ca935c65?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face'
          ]
        : [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1482192505345-5655af888206?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop'
          ];
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [type]);

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
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">
            {type === 'avatar' ? 'Выбери фото профиля' : 'Выбери фоновое изображение'}
          </h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={loadImages}
              disabled={loading}
              className="text-white/70 hover:text-white p-1 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/70 hover:text-white p-1"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/70 ml-3">Загружаем изображения...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {images.map((imageUrl, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(imageUrl)}
                className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <img
                  src={imageUrl}
                  alt={`Option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-all duration-300" />
              </motion.button>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            onClick={loadImages}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            disabled={loading}
          >
            {loading ? 'Загружаем...' : 'Обновить'}
          </Button>
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