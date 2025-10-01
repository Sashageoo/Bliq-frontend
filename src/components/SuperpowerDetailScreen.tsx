import { motion } from 'motion/react';
import { ArrowLeft, Share2, Plus, Image, Video, FileText } from 'lucide-react';
import { AppBackground } from './AppBackground';

interface Blik {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string;
  timestamp: string;
  likes: number;
}

interface SuperpowerDetailProps {
  name: string;
  emoji: string;
  description: string;
  bliks: number;
  energy: number;
  bliksList: Blik[];
  backgroundImage?: string;
  onBack: () => void;
  onAddBlik: () => void;
  onShare: () => void;
}

export function SuperpowerDetailScreen({
  name,
  emoji,
  description,
  bliks,
  energy,
  bliksList,
  onBack,
  onAddBlik,
  onShare
}: SuperpowerDetailProps) {
  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return 'from-emerald-400 to-green-500';
    if (energy >= 60) return 'from-green-400 to-yellow-400';
    if (energy >= 40) return 'from-yellow-400 to-orange-400';
    if (energy >= 20) return 'from-orange-400 to-red-400';
    return 'from-red-600 to-red-800';
  };

  const getBlikIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'text': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Заголовок */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="text-white p-2"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="text-white p-2"
          >
            <Share2 size={24} />
          </motion.button>
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Описание и метрики */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 p-6 mb-6"
        >
          <p className="text-white/80 mb-4">{description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{bliks}</div>
              <div className="text-sm text-white/70">Бликов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{energy}%</div>
              <div className="text-sm text-white/70">Энергия</div>
            </div>
          </div>

          {/* Прогресс-бар энергии */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${getEnergyColor(energy)} rounded-full relative`}
            >
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddBlik}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              text-white py-3 px-4 rounded-xl
              hover:shadow-lg hover:shadow-purple-500/25
              transition-all duration-300
            "
          >
            <Plus size={20} />
            Добавить блик
          </motion.button>
        </motion.div>

        {/* Галерея бликов */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">📸 Галерея бликов</h2>
          <div className="space-y-4">
            {bliksList.map((blik, index) => (
              <motion.div
                key={blik.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="
                  backdrop-blur-xl bg-white/10 dark:bg-black/20 
                  rounded-2xl border border-white/20 
                  p-4 hover:bg-white/15 dark:hover:bg-black/30 
                  transition-all duration-300
                  group cursor-pointer
                "
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    {getBlikIcon(blik.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-2">{blik.content}</p>
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>{blik.timestamp}</span>
                      <span>❤️ {blik.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {bliksList.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-white/60 mb-4">Пока нет бликов для этой суперсилы</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddBlik}
                className="
                  bg-gradient-to-r from-purple-500 to-pink-500
                  text-white py-2 px-6 rounded-xl
                  hover:shadow-lg hover:shadow-purple-500/25
                  transition-all duration-300
                "
              >
                Добавить первый блик
              </motion.button>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}