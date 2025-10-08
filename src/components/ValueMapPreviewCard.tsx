import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ValueMapPreviewCardProps {
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
  overallScore: number;
  metrics: {
    superpowers: number;
    bliks: number;
  };
  onClick: () => void;
}

export function ValueMapPreviewCard({
  topSuperpowers,
  overallScore,
  metrics,
  onClick
}: ValueMapPreviewCardProps) {
  // Берем топ-3 суперсилы
  const top3Superpowers = topSuperpowers.slice(0, 3);
  
  // Данные для круговой диаграммы
  const chartData = [
    { name: 'Заполнено', value: overallScore },
    { name: 'Потенциал', value: 100 - overallScore }
  ];
  
  // Цвета для диаграммы - яркий градиент
  const COLORS = {
    filled: '#10b981', // emerald-500
    empty: 'rgba(255, 255, 255, 0.1)'
  };
  
  // Определяем цвет в зависимости от значения
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onClick={onClick}
      className="mb-8 max-w-sm mx-auto sm:max-w-md md:max-w-lg cursor-pointer"
    >
      <div className="backdrop-blur-xl glass-card rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300">
        {/* Главный контент: Диаграмма + Топ-3 */}
        <div className="flex items-center gap-3">
          {/* Круговая диаграмма */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={90} height={90}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={38}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill={COLORS.filled} />
                  <Cell fill={COLORS.empty} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Центральное значение */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <div className="text-[10px] text-white/60">
                  балл
                </div>
              </div>
            </div>
          </div>

          {/* Топ-3 суперсилы */}
          <div className="flex-1 space-y-2">
            {top3Superpowers.map((superpower, index) => (
              <div 
                key={superpower.name}
                className="flex items-center gap-2"
              >
                {/* Эмодзи */}
                <span className="text-lg">{superpower.emoji}</span>
                
                {/* Название */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/90 truncate">
                    {superpower.name}
                  </div>
                </div>
                
                {/* Энергия - компактная шкала чтобы проценты помещались */}
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${superpower.energy}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold w-[22px] text-right flex-shrink-0">
                    {superpower.energy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
