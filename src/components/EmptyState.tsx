import React from 'react';
import { PackageX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No items found.',
  icon = <PackageX size={48} className="text-gray-400" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      {icon}
      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
