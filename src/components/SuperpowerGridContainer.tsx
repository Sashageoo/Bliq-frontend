import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SuperpowerGridContainerProps {
  children: React.ReactNode;
  viewMode: 'grid' | 'list';
  className?: string;
}

export function SuperpowerGridContainer({ 
  children, 
  viewMode, 
  className = '' 
}: SuperpowerGridContainerProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Определяем настройки сетки в зависимости от размера экрана
  const getGridSettings = () => {
    if (viewMode === 'list') {
      return {
        containerClass: 'flex flex-col gap-3',
        maxWidth: 'max-w-2xl',
        itemClass: ''
      };
    }

    // Адаптивные настройки для grid режима
    if (windowWidth >= 1920) {
      return {
        containerClass: 'grid grid-cols-6 gap-6 auto-rows-fr',
        maxWidth: 'max-w-7xl',
        itemClass: 'max-w-64'
      };
    }
    if (windowWidth >= 1536) {
      return {
        containerClass: 'grid grid-cols-5 gap-5 auto-rows-fr',
        maxWidth: 'max-w-6xl',
        itemClass: 'max-w-60'
      };
    }
    if (windowWidth >= 1280) {
      return {
        containerClass: 'grid grid-cols-4 gap-4 auto-rows-fr',
        maxWidth: 'max-w-5xl',
        itemClass: 'max-w-56'
      };
    }
    if (windowWidth >= 1024) {
      return {
        containerClass: 'grid grid-cols-3 gap-4 auto-rows-fr',
        maxWidth: 'max-w-4xl',
        itemClass: 'max-w-52'
      };
    }
    if (windowWidth >= 768) {
      return {
        containerClass: 'grid grid-cols-3 gap-4 auto-rows-fr',
        maxWidth: 'max-w-3xl',
        itemClass: 'max-w-48'
      };
    }
    if (windowWidth >= 640) {
      return {
        containerClass: 'grid grid-cols-3 gap-3 auto-rows-fr',
        maxWidth: 'max-w-2xl',
        itemClass: 'max-w-44'
      };
    }
    
    return {
      containerClass: 'grid grid-cols-2 gap-3 auto-rows-fr',
      maxWidth: 'max-w-md',
      itemClass: 'max-w-40'
    };
  };

  const settings = getGridSettings();

  return (
    <div className={`w-full flex justify-center px-6 pb-20 ${className}`}>
      <div className={`w-full ${settings.maxWidth}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={settings.containerClass}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className={`w-full ${settings.itemClass} justify-self-center`}>
              {React.cloneElement(child as React.ReactElement, { 
                screenWidth: windowWidth,
                index
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}