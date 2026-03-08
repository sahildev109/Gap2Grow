import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: 'Resume Analyzer',
      description: "Upload your resume and our AI instantly extracts your skills, experience, and expertise with precision.",
      icon: '📄'
    },
    {
      id: 2,
      title: 'Skill Gap Analysis',
      description: 'Compare your current skills with industry job requirements and identify gaps instantly.',
      icon: '🎯'
    },
    {
      id: 3,
      title: 'Market Intelligence',
      description: "Discover trending skills in your desired field and see what employers are seeking right now.",
      icon: '📊'
    },
    {
      id: 4,
      title: 'Learning Roadmap',
      description: 'Get a personalized, step-by-step learning plan tailored to your career goals and timeline.',
      icon: '🛣️'
    },
    {
      id: 5,
      title: 'AI Career Report',
      description: 'Generate detailed career analysis reports with insights and actionable recommendations.',
      icon: '📈'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Powerful Features Built for Students</h2>
          <p className="features-subtitle">
            Everything you need to bridge your skill gap and land your dream job
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={feature.id} className="feature-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="feature-icon-container">
                <div className="feature-icon">{feature.icon}</div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <a href="#" className="feature-link">Learn more →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
