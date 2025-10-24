import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ Import Link from React Router
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div>
          <h3 className="footer-section-title">NexBuy - Buy your next things</h3>
          <p className="footer-description">Your one-stop shop for all your needs.</p>
        </div>

        <div>
          <h3 className="footer-section-title">Quick Links</h3>
          <ul className="footer-links">
            {/* ✅ Use Link for same-tab, no reload navigation */}
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-section-title">Follow Us</h3>
          <div className="footer-social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Facebook size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-text">
        &copy; {new Date().getFullYear()} NexBuy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
