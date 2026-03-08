import React from 'react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-headline">Bridge the Gap Between Your Skills and Your Dream Job</h1>
          <p className="hero-description">
            Gap2Grow analyzes your skills, compares them with industry demands, and creates a 
            personalized learning roadmap to accelerate your career growth. Start your journey today.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary" onClick={() => navigate('/login')}>
              Get Started
            </button>
            <button className="hero-btn hero-btn-secondary" onClick={() => navigate('/login')}>
              Upload Resume
            </button>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="illustration-container">
            <div className="illustration-element element-1"></div>
            <div className="illustration-element element-2"></div>
            <div className="illustration-element element-3"></div>
            <div className="illustration-element element-4"></div>
            <div className="illustration-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <div className="graphic-curve"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
