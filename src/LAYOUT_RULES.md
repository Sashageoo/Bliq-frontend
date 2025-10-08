# 🎯 КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА ВЕРСТКИ BLIQ

## ❌ ЧТО НЕЛЬЗЯ ДЕЛАТЬ

### 1. НЕ добавляй избыточные классы ширины
```tsx
// ❌ НЕПРАВИЛЬНО
<div className="w-full max-w-full">
<div className="w-full overflow-x-hidden">

// ✅ ПРАВИЛЬНО  
<div className="glass-card">
```

### 2. НЕ используй negative margins для выравнивания контента
```tsx
// ❌ НЕПРАВИЛЬНО - сдвигает весь контент
<div className="-ml-4">

// ✅ ПРАВИЛЬНО - только для визуального выравнивания кнопок
<button className="-ml-2"> {/* OK для кнопки "Назад" */}
```

### 3. НЕ добавляй max-width к элементам с overflow
```css
/* ❌ НЕПРАВИЛЬНО */
.overflow-x-auto {
  max-width: 100%;
}

/* ✅ ПРАВИЛЬНО */
.overflow-x-auto {
  overflow-x: auto;
}
```

## ✅ ПРАВИЛЬНЫЕ ПАТТЕРНЫ

### 1. Горизонтальный скролл
```tsx
// ✅ ПРОВЕРЕННАЯ СТРУКТУРА
<div className="px-4">  {/* padding снаружи */}
  <div className="overflow-x-auto scrollbar-hide">  {/* скролл внутри */}
    <div className="flex gap-3">  {/* flex контейнер */}
      {items.map(item => <Item key={item.id} />)}
    </div>
  </div>
</div>
```

### 2. Главные контейнеры экранов
```tsx
// ✅ БАЗОВАЯ СТРУКТУРА - НИЧЕГО ЛИШНЕГО
<div className="min-h-screen relative">
  <div className="relative z-10">
    {content}
  </div>
</div>
```

### 3. Карточки контента
```tsx
// ✅ ПРОСТАЯ СТРУКТУРА
<div className="glass-card rounded-xl overflow-hidden">
  {/* НЕ добавляй w-full, max-w-full, overflow-hidden */}
  {content}
</div>
```

## 🔧 ГЛОБАЛЬНЫЕ ПРАВИЛА

### globals.css - базовые правила
```css
html, body {
  overflow-x: hidden;  /* Предотвращаем горизонтальный скролл */
  margin: 0;
  padding: 0;
  width: 100%;
}

#root {
  overflow-x: hidden;
  width: 100%;
}
```

### Utilities - минимальные правила
```css
.overflow-x-auto {
  overflow-x: auto;
  /* НЕ добавляй max-width или другие ограничения! */
}

.scrollbar-hide {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

## 🎨 АДАПТИВНОСТЬ

### Сетка для бликов
```css
.bliks-grid {
  display: grid;
  gap: 1.5rem;
  width: 100%;
  /* БЕЗ max-width на базовом уровне */
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 768px) {
  .bliks-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 600px;  /* max-width только для конкретных breakpoints */
    margin: 0 auto;
  }
}
```

## 🚨 ПРОВЕРКА ПЕРЕД КОММИТОМ

Перед добавлением классов спроси себя:
1. ❓ Действительно ли нужен `w-full`?  
2. ❓ Нужен ли `max-w-full`?
3. ❓ Создаст ли `overflow-x-hidden` проблемы?
4. ❓ Правильно ли расположены padding и overflow?

**ПРАВИЛО БОЛЬШОГО ПАЛЬЦА:** Если не уверен - НЕ добавляй!

## 📝 ПРИМЕРЫ ИСПРАВЛЕНИЙ

### До (НЕПРАВИЛЬНО)
```tsx
<div className="w-full overflow-x-hidden">
  <div className="w-full max-w-full">
    <div className="overflow-x-auto px-4">
      <div className="flex gap-3 -mx-2 px-2">
        {items}
      </div>
    </div>
  </div>
</div>
```

### После (ПРАВИЛЬНО)
```tsx
<div className="px-4">
  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-3">
      {items}
    </div>
  </div>
</div>
```

---

**ЗАПОМНИ:** Простота - лучший друг верстки! 🎯
