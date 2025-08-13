import React from 'react';

const LandingPage = ({ onOptionSelect }) => {
  const options = [
    {
      id: 'smartPostPage',
      icon: 'fas fa-pen',
      title: 'Smart Post',
      description: 'Auto-generate structured posts with titles, tags, and descriptions.'
    },
    {
      id: 'searchAssistPage',
      icon: 'fas fa-search',
      title: 'Search Assist',
      description: 'Explore community wisdom, bulletins, and enterprise insights with AI.'
    },
    {
      id: 'copilotPage',
      icon: 'fas fa-comments',
      title: 'Copilot',
      description: 'Get step-by-step help, onboarding tips, and quick actions.'
    },
    {
      id: 'askDocsPage',
      icon: 'fas fa-file-alt',
      title: 'Ask with Docs',
      description: 'Search within documentation and get summarized answers.'
    }
  ];

  return (
    <div className="ai-content-section">
      <div className="main-landing-container">
        <h1>Welcome 👋</h1>
        <div className="ai-hero-section">
          <h2 className="ai-intro-headline">
            Meet <span className="highlight">EASIBOT</span>
          </h2>
          <div className="ai-intro-wrapper">
            <p className="ai-intro-subtitle">
              Your AI-powered assistant for ERP, CRM, PLM, SCM, BI, HCM & more —
              crafted to help you explore, contribute, and grow on
              <span className="highlight">EASIHUB</span>.
              From structured post creation to smart documentation and AI-driven
              search, EASIBOT accelerates your enterprise learning journey.
            </p>
            <img 
              src="https://cdn.easihub.com/uploads/default/original/1X/6244acc629fbf32028dd7c3558961b975bde2628.jpeg"
              alt="EASIBOT Avatar"
              className="easihub-avatar" 
            />
          </div>
        </div>
        <div className="ai-grid">
          {options.map(option => (
            <div 
              key={option.id}
              className="ai-option" 
              onClick={() => onOptionSelect(option.id)}
              title={option.description}
            >
              <i className={option.icon}></i> {option.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;