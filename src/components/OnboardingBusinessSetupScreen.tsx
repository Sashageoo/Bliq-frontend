import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, ArrowRight, Building2, Shield, Crown, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BusinessInfo {
  companyName: string;
  industry: string;
  founded: string;
  employees: string;
  revenue: string;
  description: string;
  website: string;
  phone: string;
  email: string;
}

interface OnboardingBusinessSetupScreenProps {
  onNext: (businessInfo: BusinessInfo) => void;
  onBack: () => void;
  onSkip: () => void;
}

const INDUSTRIES = [
  'Технологии и IT',
  'Финансы и банковские услуги',
  'Здравоохранение',
  'Образование',
  'Розничная торговля',
  'Производство',
  'Строительство',
  'Маркетинг и реклама',
  'Консалтинг',
  'Недвижимость',
  'Туризм и гостеприимство',
  'Медиа и развлечения',
  'Транспорт и логистика',
  'Энергетика',
  'Сельское хозяйство',
  'Другое'
];

const EMPLOYEE_RANGES = [
  '1-10 сотрудников',
  '11-50 сотрудников',
  '51-200 сотрудников',
  '201-500 сотрудников',
  '501-1000 сотрудников',
  '1000+ сотрудников'
];

const REVENUE_RANGES = [
  'До 1 млн ₽',
  '1-10 млн ₽',
  '10-100 млн ₽',
  '100 млн - 1 млрд ₽',
  'Свыше 1 млрд ₽',
  'Не указывать'
];

export function OnboardingBusinessSetupScreen({
  onNext,
  onBack,
  onSkip
}: OnboardingBusinessSetupScreenProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    industry: '',
    founded: '',
    employees: '',
    revenue: '',
    description: '',
    website: '',
    phone: '',
    email: ''
  });

  const [step, setStep] = useState<'basic' | 'details' | 'verification'>('basic');

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBasicNext = () => {
    if (!businessInfo.companyName || !businessInfo.industry) {
      toast.error('Заполни название компании и отрасль');
      return;
    }
    setStep('details');
  };

  const handleDetailsNext = () => {
    setStep('verification');
  };

  const handleComplete = () => {
    if (!businessInfo.email) {
      toast.error('Укажи email для верификации');
      return;
    }
    onNext(businessInfo);
  };

  const handleVerificationRequest = () => {
    toast.success('Заявка на верификацию отправлена! Мы свяжемся с тобой в течение 2-3 рабочих дней.');
  };

  const handleDocumentUpload = () => {
    toast.success('Документ загружен! Это ускорит процесс верификации.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={step === 'basic' ? onBack : () => setStep(step === 'details' ? 'basic' : 'details')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Пропустить
        </Button>
      </div>

      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'basic' ? 'bg-blue-400' : 'bg-blue-400'}`}></div>
          <div className={`w-8 h-0.5 transition-colors ${step !== 'basic' ? 'bg-blue-400' : 'bg-muted'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'details' ? 'bg-blue-400' : step === 'verification' ? 'bg-blue-400' : 'bg-muted'}`}></div>
          <div className={`w-8 h-0.5 transition-colors ${step === 'verification' ? 'bg-blue-400' : 'bg-muted'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'verification' ? 'bg-blue-400' : 'bg-muted'}`}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto w-full">
          
          {step === 'basic' && (
            <>
              {/* Basic Info */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Расскажи о компании</h1>
                <p className="text-muted-foreground">
                  Основная информация поможет пользователям лучше понять твой бизнес
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Название компании *</Label>
                  <Input
                    id="companyName"
                    placeholder="Например, Bliq Technologies"
                    value={businessInfo.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Отрасль *</Label>
                  <Select onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выбери отрасль" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Краткое описание</Label>
                  <Input
                    id="description"
                    placeholder="Чем занимается ваша компания?"
                    value={businessInfo.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button 
                  onClick={handleBasicNext}
                  className="w-full gradient-button"
                  size="lg"
                >
                  Продолжить
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 'details' && (
            <>
              {/* Detailed Info */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Дополнительная информация</h1>
                <p className="text-muted-foreground">
                  Эти данные помогут пользователям лучше понять масштаб вашего бизнеса
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="founded">Год основания</Label>
                    <Input
                      id="founded"
                      placeholder="2020"
                      value={businessInfo.founded}
                      onChange={(e) => handleInputChange('founded', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employees">Команда</Label>
                    <Select onValueChange={(value) => handleInputChange('employees', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Размер" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYEE_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="revenue">Выручка (необязательно)</Label>
                  <Select onValueChange={(value) => handleInputChange('revenue', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Выбери диапазон" />
                    </SelectTrigger>
                    <SelectContent>
                      {REVENUE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Веб-сайт</Label>
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                    value={businessInfo.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button 
                  onClick={handleDetailsNext}
                  className="w-full energy-button"
                  size="lg"
                >
                  Продолжить
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}

          {step === 'verification' && (
            <>
              {/* Verification */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Верификация компании</h1>
                <p className="text-muted-foreground">
                  Подтверди, что ты представляешь настоящую компанию
                </p>
              </div>

              {/* Verification Options */}
              <div className="space-y-4 mb-8">
                <Card className="glass-card">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">Бесплатная верификация</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Отправим запрос на верификацию. Рассмотрение 2-3 рабочих дня.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleVerificationRequest}
                          className="w-full"
                        >
                          Подать заявку
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card border-orange-500/30">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Crown className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">Премиум-верификация</h3>
                          <div className="px-2 py-1 bg-orange-500/20 rounded-full">
                            <span className="text-xs text-orange-300">₽2,999/мес</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Мгновенная верификация + расширенная аналитика + приоритетная поддержка
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full border-orange-500/50 hover:bg-orange-500/10"
                        >
                          Подключить Премиум
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div>
                  <Label htmlFor="email">Email для связи *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={businessInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон компании</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (999) 123-45-67"
                    value={businessInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Document Upload */}
              <Card className="glass-card mb-8">
                <div className="p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Документы компании (необязательно)</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Загрузи документы для ускорения верификации: ОГРН, устав, справку из банка
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDocumentUpload}
                    >
                      Загрузить документы
                    </Button>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={handleComplete}
                className="w-full gradient-button"
                size="lg"
              >
                Завершить настройку
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}