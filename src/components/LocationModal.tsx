import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button'; // Assuming Button component is available

interface LocationModalProps {
  onClose: () => void;
  onLocationUpdate: (location: string) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ onClose, onLocationUpdate }) => {
  const [pincode, setPincode] = useState('');

  const handleApply = () => {
    if (pincode.trim()) {
      onLocationUpdate(`India ${pincode.trim()}`);
    } else {
      // Optionally handle empty pincode or show error
      alert('Please enter a pincode.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose your location</h2>
        <p className="text-gray-600 mb-6">Select a delivery location to see product availability and delivery options</p>

        <Button
          variant="primary"
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold py-3 px-4 rounded-lg mb-4"
        >
          Sign in to see your addresses
        </Button>

        <div className="text-center text-gray-500 mb-4">or enter an Indian pincode</div>

        <div className="flex space-x-2">
          <input
            type="number" // Changed to type="number"
            placeholder="Enter pincode"
            className="flex-grow border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pincode}
            onChange={(e) => {
              console.log('Pincode input changed:', e.target.value); // Added console log for debugging
              setPincode(e.target.value);
            }}
          />
          <Button
            variant="secondary"
            onClick={handleApply}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold py-3 px-4 rounded-lg"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
