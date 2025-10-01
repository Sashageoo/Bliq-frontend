import React from 'react';

interface DynamicBatteryProps {
  level: number; // 0-100
  className?: string;
  style?: React.CSSProperties;
}

export function DynamicBattery({ level, className = '', style }: DynamicBatteryProps) {
  // Ограничиваем уровень от 0 до 100
  const normalizedLevel = Math.max(0, Math.min(100, level));
  
  // Определяем цвет на основе уровня
  const getColor = () => {
    if (normalizedLevel >= 80) return '#10b981'; // emerald-500 - отличная энергия
    if (normalizedLevel >= 60) return '#eab308'; // yellow-500 - средняя энергия
    if (normalizedLevel >= 40) return '#f97316'; // orange-500 - низкая энергия
    return '#ef4444'; // red-500 - критическая энергия
  };

  const fillColor = getColor();
  
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Корпус батарейки */}
      <rect
        x="2"
        y="6"
        width="18"
        height="12"
        rx="2"
        ry="2"
        stroke={fillColor}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Положительный контакт */}
      <rect
        x="22"
        y="9"
        width="1"
        height="6"
        rx="0.5"
        fill={fillColor}
      />
      
      {/* Заполнение батарейки */}
      <rect
        x="3"
        y="7"
        width={`${(normalizedLevel / 100) * 16}`}
        height="10"
        rx="1"
        fill={fillColor}
        opacity="0.8"
      />
      
      {/* Дополнительное свечение при высоком заряде */}
      {normalizedLevel >= 80 && (
        <rect
          x="3"
          y="7"
          width={`${(normalizedLevel / 100) * 16}`}
          height="10"
          rx="1"
          fill={fillColor}
          opacity="0.3"
          filter="blur(1px)"
        />
      )}
    </svg>
  );
}