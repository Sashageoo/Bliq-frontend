import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
        shadow-lg shadow-purple-500/25
        flex items-center justify-center
        text-white
        hover:shadow-xl hover:shadow-purple-500/40
        transition-all duration-300
      "
    >
      <motion.div
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Plus size={24} />
      </motion.div>
      
      {/* Пульсирующее свечение */}
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="
          absolute inset-0 rounded-full
          bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
          -z-10
        "
      />
    </motion.button>
  );
}