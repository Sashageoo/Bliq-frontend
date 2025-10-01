import { motion } from 'motion/react';
import { ArrowLeft, Camera, User, Mail, Save, RefreshCw, X, Upload, Folder, Phone, Globe, Link, Shield, Eye, Heart, MapPin, Calendar, Briefcase, Star, Instagram, Twitter, Github, Linkedin, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { StatusBar } from './StatusBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { AppBackground } from './AppBackground';

interface User {
  name: string;
  status: string;
  location: string;
  backgroundImage: string;
  avatarImage: string;
  isOnline: boolean;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  birthDate?: string;
  occupation?: string;
  interests?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  privacy?: {
    showEmail: boolean;
    showPhone: boolean;
    showBirthDate: boolean;
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
  };
  metrics: {
    bliks: number;
    friends: number;
    superpowers: number;
  };
  topSuperpowers: Array<{
    name: string;
    emoji: string;
    value: number;
    energy: number;
  }>;
}

interface SettingsScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: Partial<User>) => void;
  onSidebar?: () => void;
  unsplashTool?: (query: string) => Promise<string>;
}

export function SettingsScreen({ user, onBack, onSave, onSidebar, unsplashTool }: SettingsScreenProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    status: user.status,
    location: user.location,
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    website: user.website || '',
    birthDate: user.birthDate || '',
    occupation: user.occupation || '',
    interests: user.interests || [],
    socialLinks: {
      instagram: user.socialLinks?.instagram || '',
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      github: user.socialLinks?.github || '',
    },
    privacy: {
      showEmail: user.privacy?.showEmail ?? true,
      showPhone: user.privacy?.showPhone ?? false,
      showBirthDate: user.privacy?.showBirthDate ?? true,
      allowFriendRequests: user.privacy?.allowFriendRequests ?? true,
      showOnlineStatus: user.privacy?.showOnlineStatus ?? true,
    },
    avatarImage: user.avatarImage,
    backgroundImage: user.backgroundImage
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState<'avatar' | 'background' | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [customLinks, setCustomLinks] = useState<{ name: string; url: string }[]>([]);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  // Refs для файловых input'ов
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
      toast.success('Интерес добавлен! ✨');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
    toast.success('Интерес удален!');
  };

  const handleAddCustomLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const isExistingLink = customLinks.some(link => 
        link.name.toLowerCase() === newLinkName.trim().toLowerCase()
      );
      
      if (!isExistingLink) {
        setCustomLinks(prev => [...prev, { 
          name: newLinkName.trim(), 
          url: newLinkUrl.trim() 
        }]);
        setNewLinkName('');
        setNewLinkUrl('');
        toast.success('Ссылка добавлена! ✨');
      } else {
        toast.error('Ссылка с таким названием уже существует');
      }
    } else {
      toast.error('Заполни название и URL ссылки');
    }
  };

  const handleRemoveCustomLink = (linkName: string) => {
    setCustomLinks(prev => prev.filter(link => link.name !== linkName));
    toast.success('Ссылка удалена!');
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Имитация сохранения
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...formData,
      customLinks // Сохраняем кастомные ссылки
    };
    
    onSave(updatedUser);
    setIsLoading(false);
    toast.success('Профиль успешно обновлен! ✨');
  };

  const handlePhotoUpload = async (type: 'avatar' | 'background') => {
    setShowImagePicker(type);
    setLoadingImages(true);
    
    try {
      // Получаем свежие изображения из Unsplash для каждого типа
      const searchQueries = type === 'avatar' 
        ? ['professional portrait woman', 'creative portrait', 'business headshot', 'professional man', 'artistic portrait', 'modern portrait']
        : ['cosmic nebula space', 'aurora borealis night', 'cyberpunk neon cityscape', 'abstract gradient purple', 'mountain landscape sunset', 'coral reef underwater'];

      const images: string[] = [];
      
      // Если доступен unsplashTool, используем его
      if (unsplashTool) {
        for (const query of searchQueries) {
          try {
            const imageUrl = await unsplashTool(query);
            images.push(imageUrl);
          } catch (error) {
            console.error(`Ошибка загрузки изображения для запроса "${query}":`, error);
            // Добавляем fallback изображение при ошибке
            const fallbackImage = type === 'avatar' 
              ? 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=400&h=400&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1602981256888-244edc1f444f?w=800&h=600&fit=crop';
            images.push(fallbackImage);
          }
        }
      } else {
        // Fallback к статичным изображениям если unsplashTool недоступен
        const fallbackImages = type === 'avatar' 
          ? [
              'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1595745688820-1a8bca9dd00f?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'
            ]
          : [
              // Новые энергетические фоны для суперсил!
              'https://images.unsplash.com/photo-1602981256888-244edc1f444f?w=800&h=600&fit=crop', // Космическая туманность
              'https://images.unsplash.com/photo-1715619172925-78d1b2022a77?w=800&h=600&fit=crop', // Северное сияние
              'https://images.unsplash.com/photo-1604912364280-4a5f295cd988?w=800&h=600&fit=crop', // Киберпанк город
              'https://images.unsplash.com/photo-1646038572815-43fe759e459b?w=800&h=600&fit=crop', // Абстрактный градиент
              'https://images.unsplash.com/photo-1577642665234-b1abe52cd0ae?w=800&h=600&fit=crop', // Горы на закате
              'https://images.unsplash.com/photo-1719042575585-e9d866f43210?w=800&h=600&fit=crop'  // Коралловый риф
            ];
        images.push(...fallbackImages);
      }

      setAvailableImages(images);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      // Fallback к статичным изображениям при ошибке
      const fallbackImages = type === 'avatar' 
        ? [
            'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1595745688820-1a8bca9dd00f?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'
          ]
        : [
            // Новые энергетические фоны для суперсил!
            'https://images.unsplash.com/photo-1602981256888-244edc1f444f?w=800&h=600&fit=crop', // Космическая туманность
            'https://images.unsplash.com/photo-1715619172925-78d1b2022a77?w=800&h=600&fit=crop', // Северное сияние
            'https://images.unsplash.com/photo-1604912364280-4a5f295cd988?w=800&h=600&fit=crop', // Киберпанк город
            'https://images.unsplash.com/photo-1646038572815-43fe759e459b?w=800&h=600&fit=crop', // Абстрактный градиент
            'https://images.unsplash.com/photo-1577642665234-b1abe52cd0ae?w=800&h=600&fit=crop', // Горы на закате
            'https://images.unsplash.com/photo-1719042575585-e9d866f43210?w=800&h=600&fit=crop'  // Коралловый риф
          ];
      setAvailableImages(fallbackImages);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (showImagePicker === 'avatar') {
      setFormData(prev => ({ ...prev, avatarImage: imageUrl }));
    } else if (showImagePicker === 'background') {
      setFormData(prev => ({ ...prev, backgroundImage: imageUrl }));
    }
    
    setShowImagePicker(null);
    setAvailableImages([]);
    setCustomImageUrl('');
    toast.success('Изображение выбрано! ✨');
  };

  const handleCustomImageSubmit = () => {
    if (!customImageUrl.trim()) {
      toast.error('Введите URL изображения');
      return;
    }

    // Проверяем, что URL выглядит как изображение
    const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp)$/i;
    const isValidImageUrl = imageUrlPattern.test(customImageUrl) || 
                           customImageUrl.includes('unsplash.com') || 
                           customImageUrl.includes('images.') ||
                           customImageUrl.startsWith('data:image/');

    if (!isValidImageUrl) {
      toast.error('Пожалуйста, введите корректный URL изображения');
      return;
    }

    handleImageSelect(customImageUrl);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type?: 'avatar' | 'background') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выбери файл изображения');
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 10MB');
      return;
    }

    setUploadingFile(true);

    try {
      // Конвертируем файл в Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        // Если вызвано из модального окна, используем handleImageSelect
        if (showImagePicker) {
          handleImageSelect(base64String);
        } else {
          // Если вызвано напрямую, определяем тип по параметру
          if (type === 'avatar') {
            setFormData(prev => ({ ...prev, avatarImage: base64String }));
          } else if (type === 'background') {
            setFormData(prev => ({ ...prev, backgroundImage: base64String }));
          }
          
          toast.success('Файл успешно загружен! ✨');
        }
        
        setUploadingFile(false);
      };
      reader.onerror = () => {
        setUploadingFile(false);
        toast.error('Ошибка при загрузке файла');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadingFile(false);
      toast.error('Ошибка при обработке файла');
    }

    // Очищаем input для возможности повторной загрузки того же файла
    event.target.value = '';
  };

  // Функции для открытия файлового диалога
  const handleOpenFileDialog = (type: 'avatar' | 'background' | 'modal') => {
    if (uploadingFile) return;
    
    if (type === 'avatar' && avatarFileInputRef.current) {
      avatarFileInputRef.current.click();
    } else if (type === 'background' && backgroundFileInputRef.current) {
      backgroundFileInputRef.current.click();
    } else if (type === 'modal' && modalFileInputRef.current) {
      modalFileInputRef.current.click();
    }
  };

  const handleRefreshImages = () => {
    if (showImagePicker) {
      handlePhotoUpload(showImagePicker);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* Фото профиля */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePhotoUpload('avatar')}
                className="relative cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                  <img 
                    src={formData.avatarImage} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                  <Camera size={16} className="text-white" />
                </div>
              </motion.div>
              
              {/* Кнопки выбора изображения */}
              <div className="flex gap-3 mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePhotoUpload('avatar')}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    rounded-xl px-4 py-2
                    flex items-center gap-2
                    text-white/90 text-sm
                    hover:bg-white/15 hover:border-white/30
                    transition-all duration-300
                  "
                >
                  <Camera size={14} />
                  Галерея
                </motion.button>
                
                {/* Скрытый input для аватара */}
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'avatar')}
                  className="hidden"
                  disabled={uploadingFile}
                />
                
                <motion.button
                  whileHover={{ scale: uploadingFile ? 1 : 1.05 }}
                  whileTap={{ scale: uploadingFile ? 1 : 0.95 }}
                  onClick={() => handleOpenFileDialog('avatar')}
                  disabled={uploadingFile}
                  className={`
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    rounded-xl px-4 py-2
                    flex items-center gap-2
                    text-white/90 text-sm
                    transition-all duration-300
                    ${uploadingFile 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-white/15 hover:border-white/30 cursor-pointer'
                    }
                  `}
                >
                  {uploadingFile ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Загружаем...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Файл
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Основная информация */}
            <div className="space-y-5">
              {/* Имя */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <User size={16} />
                  Имя
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="Введите ваше имя"
                />
              </div>

              {/* Статус */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Star size={16} />
                  Статус
                </Label>
                <Input
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="Творческий визионер"
                />
              </div>

              {/* Локация */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <MapPin size={16} />
                  Местоположение
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="Город, страна"
                />
              </div>

              {/* Дата рождения */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Calendar size={16} />
                  Дата рождения
                </Label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    min="1900-01-01"
                    className="
                      w-full h-12 px-3 py-2
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      text-white
                      focus:border-white/40 focus:bg-white/15 focus:outline-none
                      rounded-xl
                      cursor-pointer
                    "
                    style={{
                      colorScheme: 'dark'
                    }}
                    placeholder="Выберите дату"
                  />
                </div>
                <p className="text-white/40 text-xs">
                  Нажмите на поле для выбора даты рождения
                </p>
              </div>

              {/* Профессия */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Briefcase size={16} />
                  Профессия
                </Label>
                <Input
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="Ваша профессия или род деятельности"
                />
              </div>

              {/* О себе */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Heart size={16} />
                  О себе
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl min-h-20 resize-none
                  "
                  placeholder="Расскажите о себе, ваших увлечениях и интересах..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Mail size={16} />
                  Электронная почта
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="your@email.com"
                />
              </div>

              {/* Телефон */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Phone size={16} />
                  Телефон
                </Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              {/* Веб-сайт */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Globe size={16} />
                  Веб-сайт
                </Label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Instagram */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Instagram size={16} />
                  Instagram
                </Label>
                <Input
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="@username или https://instagram.com/username"
                />
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Twitter size={16} />
                  Twitter (X)
                </Label>
                <Input
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="@username или https://twitter.com/username"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Linkedin size={16} />
                  LinkedIn
                </Label>
                <Input
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Github size={16} />
                  GitHub
                </Label>
                <Input
                  value={formData.socialLinks.github}
                  onChange={(e) => handleNestedInputChange('socialLinks', 'github', e.target.value)}
                  className="
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    rounded-xl h-12
                  "
                  placeholder="https://github.com/username"
                />
              </div>

              {/* Разделитель */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white/60 text-sm">Кастомные ссылки</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Добавление кастомной ссылки */}
              <div className="space-y-3">
                <Label className="text-white/90 flex items-center gap-2">
                  <Plus size={16} />
                  Добавить свою ссылку
                </Label>
                
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    className="
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      text-white placeholder-white/50
                      focus:border-white/40 focus:bg-white/15
                      rounded-xl h-12
                    "
                    placeholder="Название ссылки (например: Портфолио, YouTube)"
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="
                        flex-1
                        backdrop-blur-xl bg-white/10 
                        border border-white/20
                        text-white placeholder-white/50
                        focus:border-white/40 focus:bg-white/15
                        rounded-xl h-12
                      "
                      placeholder="https://example.com"
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddCustomLink}
                      className="
                        px-4 h-12
                        backdrop-blur-xl bg-blue-500/20 
                        border border-blue-400/30
                        rounded-xl
                        flex items-center justify-center
                        text-blue-300 
                        hover:bg-blue-500/30 hover:border-blue-400/50
                        transition-all duration-300
                      "
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Список кастомных ссылок */}
              {customLinks.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-white/90 text-sm">Ваши ссылки:</Label>
                  {customLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="
                        backdrop-blur-xl bg-white/5 
                        border border-white/10
                        rounded-xl p-3
                        flex items-center justify-between
                      "
                    >
                      <div className="flex-1">
                        <div className="text-white/90 font-medium text-sm">
                          {link.name}
                        </div>
                        <div className="text-white/60 text-xs truncate">
                          {link.url}
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveCustomLink(link.name)}
                        className="
                          w-8 h-8
                          flex items-center justify-center
                          text-red-400 hover:text-red-300
                          hover:bg-red-500/20
                          rounded-lg
                          transition-all duration-200
                        "
                      >
                        <X size={14} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Добавление интереса */}
              <div className="space-y-3">
                <Label className="text-white/90 flex items-center gap-2">
                  <Heart size={16} />
                  Добавить интерес
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="
                      flex-1
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      text-white placeholder-white/50
                      focus:border-white/40 focus:bg-white/15
                      rounded-xl h-12
                    "
                    placeholder="Введите твой интерес..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddInterest}
                    className="
                      px-4 h-12
                      backdrop-blur-xl bg-purple-500/20 
                      border border-purple-400/30
                      rounded-xl
                      flex items-center justify-center
                      text-purple-300 
                      hover:bg-purple-500/30 hover:border-purple-400/50
                      transition-all duration-300
                    "
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Список интересов */}
              {formData.interests.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-white/90">Ваши интересы:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="
                          backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20
                          border border-purple-400/30
                          rounded-full px-4 py-2
                          flex items-center gap-2
                          text-white/90 text-sm
                        "
                      >
                        <span>{interest}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveInterest(interest)}
                          className="
                            w-4 h-4
                            flex items-center justify-center
                            text-white/60 hover:text-red-400
                            transition-colors duration-200
                          "
                        >
                          <X size={12} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Видимость email */}
              <div className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Показывать email
                  </div>
                  <div className="text-white/60 text-sm">
                    Разрешить другим видеть ваш email
                  </div>
                </div>
                <Switch
                  checked={formData.privacy.showEmail}
                  onCheckedChange={(checked) => handleNestedInputChange('privacy', 'showEmail', checked)}
                />
              </div>

              {/* Видимость телефона */}
              <div className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    <Phone size={16} />
                    Показывать телефон
                  </div>
                  <div className="text-white/60 text-sm">
                    Разрешить другим видеть ваш телефон
                  </div>
                </div>
                <Switch
                  checked={formData.privacy.showPhone}
                  onCheckedChange={(checked) => handleNestedInputChange('privacy', 'showPhone', checked)}
                />
              </div>

              {/* Видимость даты рождения */}
              <div className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    Показывать дату рождения
                  </div>
                  <div className="text-white/60 text-sm">
                    Разрешить другим видеть ваш возраст
                  </div>
                </div>
                <Switch
                  checked={formData.privacy.showBirthDate}
                  onCheckedChange={(checked) => handleNestedInputChange('privacy', 'showBirthDate', checked)}
                />
              </div>

              {/* Заявки в друзья */}
              <div className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    <User size={16} />
                    Заявки в друзья
                  </div>
                  <div className="text-white/60 text-sm">
                    Разрешить другим отправлять заявки в друзья
                  </div>
                </div>
                <Switch
                  checked={formData.privacy.allowFriendRequests}
                  onCheckedChange={(checked) => handleNestedInputChange('privacy', 'allowFriendRequests', checked)}
                />
              </div>

              {/* Онлайн статус */}
              <div className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
                <div className="space-y-1">
                  <div className="text-white/90 font-medium flex items-center gap-2">
                    <Eye size={16} />
                    Показывать онлайн статус
                  </div>
                  <div className="text-white/60 text-sm">
                    Показывать когда вы онлайн
                  </div>
                </div>
                <Switch
                  checked={formData.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => handleNestedInputChange('privacy', 'showOnlineStatus', checked)}
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Фон профиля */}
              <div className="space-y-3">
                <Label className="text-white/90 flex items-center gap-2">
                  <Camera size={16} />
                  Фон профиля
                </Label>
                
                <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-white/20 relative cursor-pointer" onClick={() => handlePhotoUpload('background')}>
                  <img 
                    src={formData.backgroundImage} 
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white flex items-center gap-2">
                      <Camera size={20} />
                      <span>Изменить фон</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePhotoUpload('background')}
                    className="
                      flex-1
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      rounded-xl px-4 py-3
                      flex items-center justify-center gap-2
                      text-white/90 text-sm
                      hover:bg-white/15 hover:border-white/30
                      transition-all duration-300
                    "
                  >
                    <Folder size={14} />
                    Выбрать из галереи
                  </motion.button>
                  
                  {/* Скрытый input для фона */}
                  <input
                    ref={backgroundFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'background')}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                  
                  <motion.button
                    whileHover={{ scale: uploadingFile ? 1 : 1.05 }}
                    whileTap={{ scale: uploadingFile ? 1 : 0.95 }}
                    onClick={() => handleOpenFileDialog('background')}
                    disabled={uploadingFile}
                    className={`
                      flex-1
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      rounded-xl px-4 py-3
                      flex items-center justify-center gap-2
                      text-white/90 text-sm
                      transition-all duration-300
                      ${uploadingFile 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-white/15 hover:border-white/30 cursor-pointer'
                      }
                    `}
                  >
                    {uploadingFile ? (
                      <>
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        Загружаем...
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        Загрузить файл
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppBackground imageUrl={formData.backgroundImage}>
      <div className="min-h-screen flex flex-col">
        {/* Статус бар */}
        <StatusBar />

        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="
              w-10 h-10 rounded-full
              backdrop-blur-xl bg-white/10
              border border-white/20
              flex items-center justify-center
              text-white
              hover:bg-white/20
              transition-all duration-300
            "
          >
            <ArrowLeft size={20} />
          </motion.button>

          <h1 className="text-white font-medium text-lg">
            Настройки профиля
          </h1>

          {/* Аватарка пользователя - кликабельная для открытия сайдбара */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSidebar}
            className="
              w-10 h-10 rounded-full
              backdrop-blur-xl bg-white/10
              border border-white/20
              overflow-hidden
              hover:border-white/40
              transition-all duration-300
              relative
            "
          >
            <img 
              src={user.avatarImage} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
            {user.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-black/50 rounded-full" />
            )}
          </motion.button>
        </div>

        {/* Табы и контент с правильной прокруткой */}
        <div className="flex-1 px-6 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            {/* Табы */}
            <TabsList className="
              grid grid-cols-6 
              backdrop-blur-xl bg-white/10 
              border border-white/20 
              rounded-2xl p-1 mb-6
              w-full h-12 flex-shrink-0
            ">
              <TabsTrigger 
                value="general" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Основное"
              >
                <User size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Основное
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Контакты"
              >
                <Mail size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Контакты
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Соцсети"
              >
                <Link size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Соцсети
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="interests" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Интересы"
              >
                <Heart size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Интересы
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Приватность"
              >
                <Shield size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Приватность
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="
                  data-[state=active]:bg-white/20 
                  data-[state=active]:text-white
                  text-white/70 
                  rounded-xl transition-all duration-300
                  h-10 w-full p-0
                  flex items-center justify-center
                  relative group
                "
                title="Оформление"
              >
                <Camera size={16} />
                <div className="
                  absolute -top-8 left-1/2 transform -translate-x-1/2
                  bg-black/80 text-white text-xs py-1 px-2 rounded
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  pointer-events-none whitespace-nowrap
                ">
                  Оформление
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Контент табов с правильной прокруткой */}
            <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 pb-20">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </Tabs>
        </div>

        {/* Кнопка сохранения - зафиксирована внизу */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="
            fixed bottom-0 left-0 right-0
            backdrop-blur-xl bg-black/90
            pt-4 pb-8 px-6
            border-t border-white/10
          "
        >
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="
              w-full h-14
              bg-gradient-to-r from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              border-0 rounded-2xl
              text-white font-medium text-lg
              shadow-lg shadow-blue-500/25
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохраняем...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Save size={20} />
                Сохранить изменения
              </div>
            )}
          </Button>
        </motion.div>

        {/* Модальное окно выбора изображения */}
        {showImagePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePicker(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full max-w-2xl max-h-[80vh] overflow-y-auto
                backdrop-blur-xl bg-white/10 
                border border-white/20 
                rounded-3xl p-6
                scrollbar-hide
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-medium">
                  Выбери {showImagePicker === 'avatar' ? 'аватар' : 'фон'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImagePicker(null)}
                  className="
                    w-8 h-8 rounded-full
                    backdrop-blur-xl bg-white/10
                    border border-white/20
                    flex items-center justify-center
                    text-white/70 hover:text-white
                    hover:bg-white/20
                    transition-all duration-300
                  "
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Кастомный URL */}
              <div className="mb-6">
                <Label className="text-white/90 mb-2 block">Или вставьте URL изображения:</Label>
                <div className="flex gap-2">
                  <Input
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="
                      flex-1
                      backdrop-blur-xl bg-white/10 
                      border border-white/20
                      text-white placeholder-white/50
                      focus:border-white/40 focus:bg-white/15
                      rounded-xl h-12
                    "
                  />
                  <Button
                    onClick={handleCustomImageSubmit}
                    className="
                      px-6 h-12
                      bg-blue-500/20 hover:bg-blue-500/30
                      border border-blue-400/30 hover:border-blue-400/50
                      text-blue-300 rounded-xl
                    "
                  >
                    Применить
                  </Button>
                </div>
              </div>

              {/* Загрузка файла */}
              <div className="mb-6">
                <Label className="text-white/90 mb-2 block">Загрузить файл:</Label>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                  disabled={uploadingFile}
                />
                <Button
                  onClick={() => handleOpenFileDialog('modal')}
                  disabled={uploadingFile}
                  className="
                    w-full h-12
                    backdrop-blur-xl bg-white/10 hover:bg-white/15
                    border border-white/20 hover:border-white/30
                    text-white rounded-xl
                  "
                >
                  {uploadingFile ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Загружаем файл...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload size={16} />
                      Выбрать файл
                    </div>
                  )}
                </Button>
              </div>

              {/* Разделитель */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-white/60 text-sm">или выбери из коллекции</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Кнопка обновления */}
              <div className="flex justify-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefreshImages}
                  disabled={loadingImages}
                  className="
                    px-4 py-2
                    backdrop-blur-xl bg-white/10 hover:bg-white/15
                    border border-white/20 hover:border-white/30
                    text-white rounded-xl
                    flex items-center gap-2
                    transition-all duration-300
                    disabled:opacity-50
                  "
                >
                  <RefreshCw size={16} className={loadingImages ? 'animate-spin' : ''} />
                  {loadingImages ? 'Обновляем...' : 'Обновить коллекцию'}
                </motion.button>
              </div>

              {/* Галерея изображений */}
              {loadingImages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Загружаем изображения...</p>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-4 ${showImagePicker === 'avatar' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {availableImages.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleImageSelect(imageUrl)}
                      className={`
                        relative cursor-pointer rounded-xl overflow-hidden
                        border-2 border-white/20 hover:border-white/40
                        transition-all duration-300
                        ${showImagePicker === 'avatar' ? 'aspect-square' : 'aspect-video'}
                      `}
                    >
                      <img
                        src={imageUrl}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Camera size={16} className="text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppBackground>
  );
}