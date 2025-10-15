import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[type];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white flex items-center space-x-3 ${typeStyles[type]} z-50`}
      role="alert"
    >
      <Icon size={20} />
      <p>{message}</p>
      <button onClick={handleClose} className="ml-auto">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
