import React from 'react';
import './Loader.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = 'bg-black', 
  text
}) => {
  // Bouncing dots variant
  const dotSizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  const gapClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3',
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className={`flex items-center ${gapClasses[size]}`}>
        <div className={`${dotSizeClasses[size]} ${color} rounded-full bounce-dot bounce-dot-1`}></div>
        <div className={`${dotSizeClasses[size]} ${color} rounded-full bounce-dot bounce-dot-2`}></div>
        <div className={`${dotSizeClasses[size]} ${color} rounded-full bounce-dot bounce-dot-3`}></div>
      </div>
      {text && <p className="text-gray-600 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;
