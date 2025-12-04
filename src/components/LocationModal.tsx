import React, { useState } from 'react';
import { X, MapPin, Navigation, CheckCircle } from 'lucide-react';
import Button from './Button';

interface LocationModalProps {
  onClose: () => void;
  onLocationUpdate: (location: string) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ onClose, onLocationUpdate }) => {
  const [pincode, setPincode] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (pincode.trim()) {
      // Validate Indian pincode (6 digits)
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (pincodeRegex.test(pincode.trim())) {
        onLocationUpdate(`India ${pincode.trim()}`);
        setError('');
      } else {
        setError('Please enter a valid 6-digit pincode');
      }
    } else {
      setError('Please enter a pincode');
    }
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates to get pincode
          // For now, we'll simulate this
          setTimeout(() => {
            setIsDetecting(false);
            // Simulated pincode - in production, use reverse geocoding API
            onLocationUpdate('India (Auto-detected)');
          }, 1000);
        },
        (error) => {
          setIsDetecting(false);
          setError('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      setIsDetecting(false);
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto relative animate-slideUp">
        {/* Header */}
        <div className="relative border-b border-gray-100 p-5 pb-3">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-xl">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Select Delivery Location</h2>
              <p className="text-xs text-gray-500 mt-1">Choose where you want your order delivered</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Auto-detect location button */}
          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Detecting your location...</span>
              </>
            ) : (
              <>
                <Navigation size={20} />
                <span>Use My Current Location</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Pincode input section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Enter Pincode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="e.g., 110001"
                maxLength={6}
                className={`w-full pl-12 pr-4 py-3 border-2 ${
                  error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                } rounded-xl focus:outline-none focus:ring-2 ${
                  error ? 'focus:ring-red-200' : 'focus:ring-blue-200'
                } transition-all duration-200 text-lg font-medium text-gray-900`}
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setPincode(value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
              />
              {pincode && !error && pincode.length === 6 && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <CheckCircle className="text-green-500" size={20} />
                </div>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                <span className="text-red-500">⚠</span> {error}
              </p>
            )}
            <p className="text-[11px] text-gray-500">
              Enter a 6-digit Indian pincode to check product availability and delivery options
            </p>
          </div>

          {/* Apply button */}
          <Button
            variant="primary"
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Apply Pincode
          </Button>

          {/* Info section */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-2">
                  <MapPin className="text-blue-600" size={16} />
                </div>
              </div>
              <div className="text-xs text-blue-900">
                <p className="font-semibold mb-1">Why do we need your location?</p>
                <p className="text-blue-700 text-[11px]">
                  To show you the most accurate product availability, delivery timelines, and shipping options for your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LocationModal;
