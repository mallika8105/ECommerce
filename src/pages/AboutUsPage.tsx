import React from 'react';
import './AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">About Us</h1>
      <section className="about-us-mission">
        <h2>Our Mission</h2>
        <p>
          At NexBuy, our mission is to provide a seamless and enjoyable online shopping experience.
          We are dedicated to offering high-quality products, exceptional customer service, and a platform
          that connects customers with the items they love.
        </p>
      </section>
      <section className="about-us-values">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Customer Focus:</strong> We prioritize our customers' needs and strive to exceed their expectations.</li>
          <li><strong>Quality:</strong> We are committed to offering only the best products from trusted suppliers.</li>
          <li><strong>Innovation:</strong> We continuously seek new ways to improve our platform and services.</li>
          <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
          <li><strong>Community:</strong> We believe in building a strong community around our brand and supporting our customers.</li>
        </ul>
      </section>
      <section className="about-us-team">
        <h2>Our Story</h2>
        <p>
          Founded in 2023, NexBuy started with a vision to simplify online shopping.
          What began as a small idea has grown into a thriving marketplace, thanks to our
          dedicated team and loyal customers. We are passionate about what we do and
          are constantly working to bring you the best products and services.
        </p>
      </section>
      <section className="about-us-contact">
        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? We'd love to hear from you!
          Please visit our <a href="/contact">Contact Page</a> or email us at <a href="mailto:support@nexbuy.com">support@nexbuy.com</a>.
        </p>
      </section>
      <section className="about-us-footer-links">
        <h2>Important Links</h2>
        <ul>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUsPage;
