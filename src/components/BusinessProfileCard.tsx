import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, Verified, Users, TrendingUp, Calendar, Globe, Mail, Phone, Shield } from 'lucide-react';

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
  verified: boolean;
  verificationDate?: string;
}

interface BusinessProfileCardProps {
  businessInfo: BusinessInfo;
  metrics: {
    bliks: number;
    friends: number;
    superpowers: number;
  };
  isOwner?: boolean;
  onRequestVerification?: () => void;
}

export function BusinessProfileCard({ 
  businessInfo, 
  metrics, 
  isOwner = false,
  onRequestVerification,
  onUpgradeToPremium
}: BusinessProfileCardProps) {
  return (
    <Card className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-semibold">{businessInfo.companyName}</h3>
              {businessInfo.verified && (
                <div className="flex items-center space-x-1">
                  <Verified className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-blue-400">Верифицирован</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {businessInfo.industry}
              </Badge>
              {businessInfo.founded && (
                <span className="text-sm text-muted-foreground">
                  Основан в {businessInfo.founded}
                </span>
              )}
            </div>
            
            {businessInfo.description && (
              <p className="text-sm text-muted-foreground max-w-md">
                {businessInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-2 gap-4">
        {businessInfo.employees && (
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Команда:</span>
            <span>{businessInfo.employees}</span>
          </div>
        )}
        
        {businessInfo.revenue && businessInfo.revenue !== 'Не указывать' && (
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Выручка:</span>
            <span>{businessInfo.revenue}</span>
          </div>
        )}
        
        {businessInfo.website && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a 
              href={businessInfo.website.startsWith('http') ? businessInfo.website : `https://${businessInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {businessInfo.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        
        {businessInfo.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a 
              href={`mailto:${businessInfo.email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {businessInfo.email}
            </a>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-around py-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{metrics.bliks}</div>
          <div className="text-xs text-muted-foreground">Блики</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{metrics.superpowers}</div>
          <div className="text-xs text-muted-foreground">Суперсилы</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{metrics.friends}</div>
          <div className="text-xs text-muted-foreground">Подписчики</div>
        </div>
      </div>

      {/* Actions for Owner */}
      {isOwner && (
        <div className="space-y-3 pt-4 border-t border-border/50">
          {!businessInfo.verified && (
            <Button 
              onClick={onRequestVerification}
              variant="outline"
              size="sm"
              className="w-full border-green-500/50 hover:bg-green-500/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Подать заявку на верификацию
            </Button>
          )}
        </div>
      )}

      {/* Verification Status */}
      {businessInfo.verified && businessInfo.verificationDate && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          Верифицирован {businessInfo.verificationDate}
        </div>
      )}
    </Card>
  );
}