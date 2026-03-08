import React, { useState } from 'react';
import './NavigationBar.css';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (sectionId) => {
    setMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="/logo.jpeg" alt="Gap2Grow Logo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', marginRight: '12px' }} />
          <span className="navbar-title">Gap2Grow</span>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <a href="#" className="nav-link" onClick={() => handleNavClick('home')}>
              Home
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavClick('features')}>
              Features
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavClick('howitworks')}>
              How It Works
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavClick('contact')}>
              Contact
            </a>
          </div>

          <button className="nav-signin-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
