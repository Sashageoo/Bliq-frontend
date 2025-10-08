import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function CustomSelect({ value, onChange, options, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Находим выбранную опцию
  const selectedOption = options.find(opt => opt.value === value);

  // Закрываем при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрываем при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Кнопка выбора */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-3
          px-4 py-3 rounded-xl
          text-white font-medium
          transition-all duration-200
          cursor-pointer
        "
        style={{
          background: 'linear-gradient(135deg, rgba(75, 70, 105, 0.90) 0%, rgba(55, 65, 90, 0.93) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(192, 132, 252, 0.35)',
          boxShadow: isOpen 
            ? '0 0 0 3px rgba(168, 85, 247, 0.3), 0 4px 16px rgba(192, 132, 252, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 4px 16px rgba(192, 132, 252, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Иконка и текст выбранной опции */}
        <div className="flex items-center gap-2">
          {selectedOption?.icon && <selectedOption.icon size={16} />}
          <span>{selectedOption?.label || 'Выбрать...'}</span>
        </div>

        {/* Стрелка */}
        <ChevronDown 
          size={16} 
          className="transition-transform duration-200"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Выпадающий список */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="
              absolute top-full left-0 right-0 mt-2
              rounded-xl overflow-hidden
              z-50
            "
            style={{
              background: 'linear-gradient(135deg, rgba(60, 60, 80, 0.98) 0%, rgba(45, 55, 75, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(192, 132, 252, 0.35)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(192, 132, 252, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Список опций */}
            <div className="py-1 max-h-64 overflow-y-auto scrollbar-hide">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const Icon = option.icon;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    className="
                      w-full flex items-center gap-2
                      px-4 py-2.5
                      text-left font-medium
                      transition-all duration-150
                      cursor-pointer
                    "
                    style={{
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(168, 85, 247, 0.35) 50%, rgba(192, 132, 252, 0.4) 100%)'
                        : 'transparent',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {/* Галочка для выбранной опции */}
                    <span 
                      className="flex-shrink-0 transition-all duration-150"
                      style={{
                        width: '16px',
                        color: isSelected ? '#c084fc' : 'transparent'
                      }}
                    >
                      ✓
                    </span>

                    {/* Иконка опции */}
                    {Icon && (
                      <Icon 
                        size={16} 
                        style={{
                          color: isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.7)'
                        }}
                      />
                    )}

                    {/* Текст опции */}
                    <span
                      style={{
                        color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        fontWeight: isSelected ? 600 : 500
                      }}
                    >
                      {option.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
