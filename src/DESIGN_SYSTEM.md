# 🎨 Дизайн-система Bliq

## Общие принципы

### Цветовая палитра
- **Основной фиолетовый**: `#5B4381` (темный, элегантный)
- **Вторичный фиолетовый**: `#5C3F69` (глубокий, насыщенный)
- **Акцентный**: `#c084fc` (яркий, для hover состояний)
- **Фон**: `#1a1b23` (темная тема)

### Эффекты
- **Backdrop blur**: `blur(16px)` - для стеклянных эффектов
- **Shadow**: Многослойные тени для глубины
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` для плавности

---

## 🔘 Фирменные кнопки Bliq

### 1. Основная кнопка (Primary) - `.bliq-primary-button`

**Использование**: Кнопка "Принять" в разделе Блики, основные действия

**CSS класс**: `.bliq-primary-button`

**Параметры**:
```css
background: linear-gradient(135deg, #5B4381 0%, #5C3F69 100%);
border: none;
color: white;
font-weight: 600;
box-shadow: 
  0 4px 16px rgba(91, 67, 129, 0.4),
  0 2px 8px rgba(92, 63, 105, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Hover состояние**:
```css
background: linear-gradient(135deg, #6d4d99 0%, #7055a1 100%);
transform: translateY(-1px);
box-shadow: 
  0 6px 24px rgba(91, 67, 129, 0.5),
  0 3px 12px rgba(92, 63, 105, 0.4),
  0 0 30px rgba(109, 77, 153, 0.25),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

**Active состояние**:
```css
transform: translateY(0) scale(0.98);
```

---

### 2. Стеклянная кнопка (Glass) - `.bliq-glass-button`

**Использование**: Вторичные действия, кнопки в модальных окнах

**Параметры**:
```css
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
background: linear-gradient(135deg, 
  rgba(139, 92, 246, 0.15) 0%,
  rgba(168, 85, 247, 0.12) 50%,
  rgba(192, 132, 252, 0.15) 100%
);
border: 1px solid rgba(168, 85, 247, 0.3);
color: rgba(255, 255, 255, 0.95);
font-weight: 600;
box-shadow: 
  0 2px 8px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

**Hover состояние**:
```css
background: linear-gradient(135deg, 
  rgba(139, 92, 246, 0.22) 0%,
  rgba(168, 85, 247, 0.18) 50%,
  rgba(192, 132, 252, 0.22) 100%
);
border-color: rgba(168, 85, 247, 0.5);
box-shadow: 
  0 4px 16px rgba(139, 92, 246, 0.2),
  0 0 24px rgba(168, 85, 247, 0.15),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);
transform: translateY(-1px);
```

---

### 3. Кнопка отклонения (Decline) - `.bliq-decline-button`

**Использование**: Кнопка "Отклонить" в разделе Блики, деструктивные действия

**Параметры**:
```css
background: linear-gradient(135deg, 
  rgba(30, 30, 45, 0.95) 0%,
  rgba(35, 35, 50, 0.9) 100%
);
border: 1px solid rgba(255, 255, 255, 0.1);
color: rgba(255, 255, 255, 0.8);
font-weight: 600;
box-shadow: 
  0 2px 8px rgba(0, 0, 0, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

**Hover состояние**:
```css
background: linear-gradient(135deg, 
  rgba(40, 40, 55, 0.98) 0%,
  rgba(45, 45, 60, 0.95) 100%
);
border-color: rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.95);
box-shadow: 
  0 4px 12px rgba(0, 0, 0, 0.25),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
transform: translateY(-1px);
```

---

### 4. Кнопка управления (Control) - Стиль для иконок действий

**Использование**: Кнопка корзины, иконки управления в хедерах, контрольные кнопки

**Параметры**:
```css
padding: 0.5rem; /* 8px */
border-radius: 0.75rem; /* 12px */
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.8);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Hover состояние**:
```css
background: rgba(255, 255, 255, 0.15);
color: rgba(255, 255, 255, 1);
transform: scale(1.05);
/* Опционально можно добавить легкую анимацию, например rotate для корзины */
transform: scale(1.05) rotate(5deg);
```

**Примеры иконок**: Trash2, X, Settings, More, Info

---

### 5. Навигационная кнопка - `.bliq-nav-button`

**Использование**: Кнопки в табах, навигация

**Параметры (неактивная)**:
```css
background: transparent;
border: none;
color: rgba(255, 255, 255, 0.7);
font-weight: 600;
transition: all 0.3s ease;
```

**Hover состояние**:
```css
background: rgba(255, 255, 255, 0.1);
color: rgba(255, 255, 255, 0.9);
```

**Active состояние (`.active`)**:
```css
background: linear-gradient(135deg, 
  rgba(139, 92, 246, 0.25) 0%,
  rgba(139, 92, 246, 0.2) 50%,
  rgba(236, 72, 153, 0.25) 100%
);
color: white;
box-shadow: 
  0 2px 8px rgba(139, 92, 246, 0.15),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);
```

---

## 📐 Размеры и отступы

### Кнопки
- **Padding**: `12px 24px` (стандарт)
- **Padding (компактная)**: `8px 16px`
- **Border radius**: `12px` (стандарт), `16px` (большая)
- **Gap между иконкой и текстом**: `8px`

### Типографика
- **Font weight**: `600` (medium bold)
- **Font size**: `16px` (стандарт), `14px` (компактная)
- **Line height**: `1.5`

---

## 🎯 Примеры использования

### Кнопки управления (иконки действий)
```tsx
// Кнопка "Корзина" (Trash)
<button className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 transition-all">
  <Trash2 size={20} />
</button>

// Кнопка "Отметить все как прочитанные" (CheckCheck)
<button className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 transition-all">
  <CheckCheck size={20} />
</button>

// Кнопка "Назад" (ArrowLeft)
<button className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
  <ArrowLeft size={20} />
</button>
```

### Блики - кнопки действий
```tsx
// Кнопка "Принять"
<button className="bliq-primary-button px-6 py-3 rounded-xl">
  <Check className="w-5 h-5" />
  <span>Принять</span>
</button>

// Кнопка "Отклонить"
<button className="bliq-decline-button px-6 py-3 rounded-xl">
  <X className="w-5 h-5" />
  <span>Отклонить</span>
</button>
```

### Навигация
```tsx
<button className={`bliq-nav-button px-4 py-2 rounded-lg ${isActive ? 'active' : ''}`}>
  Входящие
</button>
```

### Модальные окна
```tsx
<button className="bliq-glass-button px-6 py-3 rounded-xl">
  Применить
</button>
```

---

## 🚀 Бизнес-профили

### Основная бизнес-кнопка
```css
background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
box-shadow: 
  0 4px 20px rgba(168, 85, 247, 0.4),
  0 0 30px rgba(236, 72, 153, 0.2),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

### Стеклянная бизнес-кнопка
```css
backdrop-filter: blur(16px);
background: linear-gradient(135deg, 
  rgba(255, 255, 255, 0.15) 0%,
  rgba(255, 255, 255, 0.05) 100%
);
border: 1px solid rgba(255, 255, 255, 0.3);
```

---

## ✨ Специальные эффекты

### Градиентные контейнеры иконок
```css
/* Фиолетовый */
.icon-gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
}

/* Розовый */
.icon-gradient-pink {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbcfe8 100%);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
}

/* Оранжевый */
.icon-gradient-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
}
```

---

## 📱 Адаптивность

### Мобильные устройства (< 640px)
- Уменьшенные отступы: `padding: 10px 20px`
- Размер шрифта: `14px`
- Border radius: `10px`

### Планшеты (640px - 1024px)
- Стандартные размеры
- Hover эффекты активны

### Десктоп (> 1024px)
- Полные размеры
- Все hover и transition эффекты
- Дополнительные анимации при наведении

---

## 🎨 Цветовые константы

```javascript
const BLIQ_COLORS = {
  // Основные цвета кнопок
  primary: {
    base: '#5B4381',
    secondary: '#5C3F69',
    hover: '#6d4d99',
    hoverSecondary: '#7055a1',
  },
  
  // Glass эффекты
  glass: {
    background: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(168, 85, 247, 0.3)',
    hover: 'rgba(139, 92, 246, 0.22)',
  },
  
  // Decline кнопка
  decline: {
    base: 'rgba(30, 30, 45, 0.95)',
    hover: 'rgba(40, 40, 55, 0.98)',
  },
  
  // Control кнопки (иконки управления)
  control: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    text: 'rgba(255, 255, 255, 0.8)',
    hover: {
      background: 'rgba(255, 255, 255, 0.15)',
      text: 'rgba(255, 255, 255, 1)',
    }
  }
};
```

---

## 📝 Checklist для новых кнопок

### Основные кнопки (Primary/Glass/Decline)
- [ ] Градиент от темного к светлому (135deg)
- [ ] Box shadow с 2-3 слоями
- [ ] Inset shadow для глубины
- [ ] Transition на 0.3s с cubic-bezier
- [ ] Transform на hover (-1px translateY)
- [ ] Border-radius 12px или 16px
- [ ] Font-weight 600
- [ ] Backdrop blur для glass эффектов
- [ ] Адаптивные размеры для мобильных

### Кнопки управления (Control/Icons)
- [ ] Backdrop blur (16px)
- [ ] Полупрозрачный белый фон (0.1 opacity)
- [ ] Белая рамка (0.2 opacity)
- [ ] Transition на 0.3s с cubic-bezier
- [ ] Transform scale(1.05) на hover
- [ ] Опциональный rotate для анимации
- [ ] Border-radius 12px (0.75rem)
- [ ] Padding 8px (0.5rem)

---

**Дата последнего обновления**: 5 октября 2025  
**Версия**: 1.1.0 - Добавлены кнопки управления (Control)
