import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Select Your Path',
      description: 'Select your desired career path, role, and industry focus'
    },
    {
      number: 2,
      title: 'Upload Skills',
      description: 'Enter your current skills or upload your resume for analysis'
    },
    {
      number: 3,
      title: 'AI Analysis',
      description: 'Our AI analyzes job market trends and industry demands'
    },
    {
      number: 4,
      title: 'Get Insights',
      description: 'Receive personalized insights and your custom learning roadmap'
    }
  ];

  return (
    <section id="howitworks" className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">Get Started in 4 Simple Steps</h2>
          <p className="how-it-works-subtitle">Your journey to skill mastery starts here</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="step-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
