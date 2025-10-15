import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = 'border-blue-500' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`ease-linear rounded-full border-t-2 border-gray-200 animate-spin ${sizeClasses[size]} ${color}`}
      ></div>
    </div>
  );
};

export default Loader;
