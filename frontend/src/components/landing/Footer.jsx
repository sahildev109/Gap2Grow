import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { name: 'LinkedIn', icon: '🔗', url: '#' },
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Facebook', icon: 'f', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column footer-brand">
            <div className="footer-logo">G2G</div>
            <h3 className="footer-brand-name">Gap2Grow</h3>
            <p className="footer-tagline">Bridging careers since 2024</p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#">Features</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-column footer-social">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-icons">
              {socialIcons.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  className="social-icon"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Gap2Grow. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
