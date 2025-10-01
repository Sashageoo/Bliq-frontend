import React from 'react';

interface AppBackgroundProps {
  children: React.ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="min-h-screen relative">
      {/* Более яркий и живой фон */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, 
            #1a1b23 0%,     /* основной фон - менее мрачный */
            #2a2a3e 25%,    /* фиолетово-серый */
            #3a3452 50%,    /* средний фиолетовый */
            #2d3748 75%,    /* сине-серый */
            #1a202c 100%    /* темно-синий */
          )`
        }}
      />

      {/* Яркие энергетические свечения */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 900px 700px at 20% 30%, 
              rgba(192, 132, 252, 0.22) 0%,    /* яркое фиолетовое свечение */
              transparent 50%
            ),
            radial-gradient(ellipse 700px 900px at 80% 70%, 
              rgba(236, 72, 153, 0.18) 0%,    /* розовое свечение */
              transparent 50%
            ),
            radial-gradient(ellipse 500px 500px at 50% 10%, 
              rgba(245, 158, 11, 0.12) 0%,    /* оранжевое свечение */
              transparent 50%
            ),
            radial-gradient(ellipse 600px 400px at 10% 80%, 
              rgba(6, 182, 212, 0.15) 0%,    /* голубое свечение */
              transparent 50%
            ),
            radial-gradient(ellipse at center, 
              rgba(168, 85, 247, 0.08) 0%,    /* центральное свечение */
              transparent 60%
            )
          `,
          opacity: 0.9
        }}
      />

      {/* Энергетические частицы и блестки */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(3px 3px at 25% 35%, rgba(192, 132, 252, 0.8) 0%, transparent 50%),
            radial-gradient(2px 2px at 75% 25%, rgba(236, 72, 153, 0.7) 0%, transparent 50%),
            radial-gradient(2px 2px at 85% 85%, rgba(245, 158, 11, 0.8) 0%, transparent 50%),
            radial-gradient(3px 3px at 15% 75%, rgba(6, 182, 212, 0.6) 0%, transparent 50%),
            radial-gradient(1px 1px at 50% 15%, rgba(168, 85, 247, 0.5) 0%, transparent 50%),
            radial-gradient(2px 2px at 90% 50%, rgba(34, 197, 94, 0.6) 0%, transparent 50%),
            radial-gradient(1px 1px at 30% 90%, rgba(239, 68, 68, 0.5) 0%, transparent 50%)
          `,
          opacity: 0.8
        }}
      />

      {/* Дополнительные живые акценты */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            linear-gradient(45deg, 
              transparent 0%, 
              rgba(192, 132, 252, 0.05) 30%, 
              transparent 70%
            ),
            linear-gradient(-45deg, 
              transparent 0%, 
              rgba(6, 182, 212, 0.04) 40%, 
              transparent 80%
            )
          `,
          opacity: 0.6
        }}
      />

      {/* Контент поверх фона */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}