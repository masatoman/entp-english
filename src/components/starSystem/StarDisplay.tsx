import React from 'react';
import { StarData } from '../../types/starSystem';
import { formatTimeUntilRecovery, getNextStarRecoveryTime } from '../../utils/starUtils';

interface StarDisplayProps {
  stars: StarData;
  showRecoveryTime?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  stars,
  showRecoveryTime = true,
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const renderStars = () => {
    const filledStars = Array(stars.current).fill('⭐️');
    const emptyStars = Array(stars.max - stars.current).fill('⚪');
    
    return (
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        {filledStars.map((star, index) => (
          <span key={`filled-${index}`} className="animate-pulse">
            {star}
          </span>
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
