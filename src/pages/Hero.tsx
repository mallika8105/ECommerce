import React, { useState, useEffect } from 'react';
import './Hero.css'; // Import the custom CSS file

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    '/Hero1.png',
    '/Hero2.png',
    '/Hero3.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <section className="hero-section">
      <img
        src={carouselImages[currentImageIndex]}
        alt="Promotional Banner"
        className="hero-image"
      />
    </section>
  );
};

export default Hero;
