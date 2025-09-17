import React from 'react';
import { StarData } from '../../types/starSystem';
import { formatTimeUntilRecovery, getNextStarRecoveryTime } from '../../utils/starUtils';

interface StarDisplayProps {
  stars: StarData;
  showRecoveryTime?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const import React from 'react';
import { StarData } from '../../types/starSystem';
import { formatTimeUntilRecovery, getNextStarRecoveryTime } from '../../utils/starUtils';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarDisplayProps {
  stars: StarData;
  showRecoveryTime?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  compact?: boolean;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  stars,
  showRecoveryTime = true,
  size = 'medium',
  className = '',
  compact = false
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5', 
    large: 'w-6 h-6'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: stars.max }, (_, index) => (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              index < stars.current
                ? 'text-purple-500 fill-purple-500 animate-pulse'
                : 'text-gray-300'
            )}
          />
        ))}
        <Badge 
          variant="outline" 
          className={cn("ml-2 font-mono", textSizeClasses[size])}
        >
          {stars.current}/{stars.max}
        </Badge>
      </div>
    );
  };

  const recoveryTime = formatTimeUntilRecovery(getNextStarRecoveryTime(stars));

  if (compact) {
    return (
      <div className={cn("flex flex-col", className)}>
        {renderStars()}
        {showRecoveryTime && stars.current < stars.max && (
          <Badge 
            variant="secondary" 
            className={cn("mt-1 w-fit", textSizeClasses[size])}
          >
            {recoveryTime === '満タン' ? '満タン' : `${recoveryTime}で回復`}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">スタミナ</span>
          </div>
          
          {renderStars()}
          
          {showRecoveryTime && stars.current < stars.max && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">次回復:</span>
              <Badge variant="outline" className="text-xs font-mono">
                {recoveryTime === '満タン' ? '満タン' : `${recoveryTime}後`}
              </Badge>
            </div>
          )}
          
          {stars.current === 0 && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
              スタミナが不足しています
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
        ))}
        {emptyStars.map((star, index) => (
          <span key={`empty-${index}`} className="opacity-30">
            {star}
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({stars.current}/{stars.max})
        </span>
      </div>
    );
  };

  const recoveryTime = formatTimeUntilRecovery(getNextStarRecoveryTime(stars));

  return (
    <div className={`flex flex-col ${className}`}>
      {renderStars()}
      {showRecoveryTime && stars.current < stars.max && (
        <div className="text-xs text-gray-500 mt-1">
          {recoveryTime === '満タン' ? '満タン' : `${recoveryTime}で回復`}
        </div>
      )}
    </div>
  );
};
