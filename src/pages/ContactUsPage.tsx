import React from 'react';
import './ContactUsPage.css';

const ContactUsPage: React.FC = () => {
  return (
    <div className="contact-us-container">
      <h1 className="contact-us-title">Contact Us</h1>
      <section className="contact-us-info">
        <p>We'd love to hear from you! Please reach out to us using the information below:</p>
        <div className="contact-details">
          <p><strong>Email:</strong> <a href="mailto:support@nexbuy.com">support@nexbuy.com</a></p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Address:</strong> 123 NexBuy Street, Suite 100, City, State, 12345</p>
        </div>
      </section>
      <section className="contact-us-form">
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default ContactUsPage;
