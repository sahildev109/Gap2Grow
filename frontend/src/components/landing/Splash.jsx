import React from 'react';
import './Splash.css';

const Splash = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo">G2G</div>
          <h1 className="splash-title">Gap2Grow</h1>
        </div>
        <div className="splash-spinner"></div>
      </div>
    </div>
  );
};

export default Splash;
