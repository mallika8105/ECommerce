import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative p-6 border w-full max-w-[900px] shadow-2xl rounded-lg bg-white translate-y-0 scale-100 opacity-100 transition-all my-8">
          {/* Close button - positioned absolutely in top-right corner */}
          <button 
            onClick={onClose} 
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 rounded-full p-2.5 shadow-lg border-2 border-white text-white transition-all duration-200 z-10 hover:scale-110"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="mt-2 text-gray-600 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
