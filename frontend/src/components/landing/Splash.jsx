import React from 'react';
import './Splash.css';

const Splash = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-container">
          <img src="/logo.jpeg" alt="Gap2Grow" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)' }} />
          <h1 className="splash-title">Gap2Grow</h1>
        </div>
        <div className="splash-spinner"></div>
      </div>
    </div>
  );
};

export default Splash;
