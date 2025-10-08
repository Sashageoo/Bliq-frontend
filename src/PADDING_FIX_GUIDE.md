# 🎯 КРИТИЧЕСКИ ВАЖНО: Правила Padding для Bliq

## ❌ ПРОБЛЕМА: Смещение контента влево

Эта проблема возникает из-за неправильного применения padding к контейнерам с overflow и отсутствия центрирования.

## ✅ ПРАВИЛЬНАЯ СТРУКТУРА (ЭТАЛОН из BlikDetailScreen)

```tsx
// ✅ ИДЕАЛЬНАЯ СТРУКТУРА - ИСПОЛЬЗУЙ ИМЕННО ЭТУ!
<div className="min-h-screen relative overflow-hidden flex flex-col">
  <div className="relative z-10 flex-1 flex flex-col min-h-0">
    <StatusBar />
    <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ minHeight: 0 }}>
      {/* 🎯 КЛЮЧЕВОЙ МОМЕНТ: max-w-lg mx-auto px-4 */}
      <div className="max-w-lg mx-auto px-4 pt-1 md:max-w-xl lg:max-w-2xl md:px-6 lg:px-8">
        {/* ВСЁ СОДЕРЖИМОЕ СТРАНИЦЫ ВНУТРИ ЭТОГО КОНТЕЙНЕРА */}
        
        {/* Навигация */}
        <div className="flex items-center justify-between h-16">
          {/* ... */}
        </div>
        
        {/* Горизонтальный скролл с -mx-4 для выхода за границы */}
        <div className="-mx-4">
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex gap-3">
              {/* карточки */}
            </div>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="pb-24">
          {/* контент */}
        </div>
      </div>
    </div>
  </div>
</div>
```

### 🔑 Ключевые принципы:

1. **StatusBar напрямую**, БЕЗ обертки
2. **ЦЕНТРИРОВАНИЕ** через `max-w-lg mx-auto px-4` - ЭТО РЕШАЕТ ВСЁ!
3. **Адаптивные max-width**: `md:max-w-xl lg:max-w-2xl xl:max-w-7xl`
4. **Padding ТОЛЬКО на центрированном контейнере**
5. **НЕТ** `w-full`, `max-w-full`, `overflow-x-hidden` на главных контейнерах
6. **Горизонтальный скролл**: используй `-mx-4` + `overflow-x-auto px-4`
7. **⚠️ КРИТИЧНО**: НЕ добавляй вложенное `max-w-* mx-auto` внутри центрированного контейнера - это создаёт двойное центрирование и смещение!

## 🔧 ИСПРАВЛЕНИЯ ПО КОМПОНЕНТАМ

### FeedScreen - ЭТАЛОННАЯ СТРУКТУРА

```tsx
// ❌ НЕПРАВИЛЬНО - СМЕЩАЕТСЯ ВЛЕВО
<div className="min-h-screen relative">
  <StatusBar />
  <div className="px-4">  {/* ❌ Padding снаружи! */}
    <div className="flex items-center h-16">
      {/* контент */}
    </div>
  </div>
  <div className="px-4">  {/* ❌ Еще один px-4! */}
    {/* блики */}
  </div>
</div>

// ✅ ПРАВИЛЬНО - КАК В BlikDetailScreen
<div className="min-h-screen relative overflow-hidden flex flex-col">
  <div className="relative z-10 flex-1 flex flex-col min-h-0">
    <StatusBar />
    <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ minHeight: 0 }}>
      {/* 🎯 ВСЁ ВНУТРИ ЦЕНТРИРОВАННОГО КОНТЕЙНЕРА */}
      <div className="max-w-lg mx-auto px-4 pt-1 md:max-w-xl lg:max-w-2xl md:px-6 lg:px-8">
        {/* Навигация */}
        <div className="flex items-center justify-between h-16">
          {/* ... */}
        </div>
        
        {/* Горизонтальный скролл */}
        <div className="mt-4">
          <div className="-mx-4">
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3">
                {/* карточки */}
              </div>
            </div>
          </div>
        </div>
        
        {/* ⚠️ ВАЖНО: НЕ добавляй вложенное max-w-* mx-auto! */}
        {/* ❌ НЕПРАВИЛЬНО: <div className="max-w-lg mx-auto"> */}
        {/* ✅ ПРАВИЛЬНО: */}
        <div className="pb-24 pt-6">
          <div className="block md:hidden">
            {/* блики для мобильных */}
          </div>
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {/* блики для десктопа */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Горизонтальный скролл

```tsx
// ❌ НЕПРАВИЛЬНО - padding на контейнере с overflow
<div className="px-4 pb-4">
  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-3">

// ✅ ПРАВИЛЬНО - padding ВНУТРИ контейнера с overflow
<div className="pb-4">
  <div className="overflow-x-auto scrollbar-hide px-4">
    <div className="flex gap-3">
```

### SuperpowerHubScreen

```tsx
// ❌ НЕПРАВИЛЬНО
<div className="relative z-10">
  <StatusBar />
  <div className="flex items-center justify-between p-4">

// ✅ ПРАВИЛЬНО
<StatusBar />
<div className="relative z-10">
  <div className="px-4 pt-4">
    <div className="flex items-center justify-between">
```

## 📋 ЧЕКЛИСТ ПЕРЕД КОММИТОМ

- [ ] StatusBar без обертки
- [ ] Padding только на внутренних контейнерах
- [ ] НЕТ `w-full` на главных контейнерах
- [ ] НЕТ `overflow-x-hidden` (он уже в `html, body`)
- [ ] Горизонтальный скролл: padding ВНУТРИ `overflow-x-auto`
- [ ] Центрирование через `max-w-* mx-auto px-*`

## 🚨 ЗАПРЕЩЕННЫЕ ПАТТЕРНЫ

```tsx
// ❌ НЕ ДЕЛАЙ ТАК
<div className="w-full max-w-full overflow-x-hidden">
<div className="w-full">
  <StatusBar />
</div>

// ❌ НЕ ДЕЛАЙ ТАК - padding снаружи overflow
<div className="px-4">
  <div className="overflow-x-auto">

// ❌ НЕ ДЕЛАЙ ТАК - избыточные обертки
<div className="relative z-10 w-full max-w-full">
  <div className="w-full">
```

## ✅ РАЗРЕШЕННЫЕ ПАТТЕРНЫ

```tsx
// ✅ ПРАВИЛЬНО - минималистичная структура
<div className="min-h-screen relative">
  <StatusBar />
  <div className="relative z-10">

// ✅ ПРАВИЛЬНО - padding внутри overflow
<div className="overflow-x-auto scrollbar-hide px-4">
  <div className="flex gap-3">

// ✅ ПРАВИЛЬНО - центрирование
<div className="max-w-lg mx-auto px-4">
```

## 💡 ПОЧЕМУ ЭТО ВАЖНО?

1. **Избыточные обертки** создают конфликты стилей
2. **`w-full` + `overflow`** создает горизонтальный сдвиг
3. **Padding снаружи overflow** нарушает ширину контейнера
4. **Базовые стили** уже в `globals.css` (html, body имеют `overflow-x: hidden`)

## 🎨 АДАПТИВНОСТЬ

```tsx
// ✅ ПРАВИЛЬНО - адаптивные max-width
<div className="max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4">
  {/* контент автоматически центрируется и масштабируется */}
</div>
```

---

**ЗАПОМНИ:** Простота = Надежность! 

Если сомневаешься - посмотри на `BlikDetailScreen.tsx` - это эталон правильной структуры.
