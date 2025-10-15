import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 md:p-8 mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-4">E-commerce</h3>
          <p className="text-gray-400">Your one-stop shop for all your needs.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} E-commerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
