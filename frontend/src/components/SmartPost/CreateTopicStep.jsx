import React, { useState, useEffect } from 'react';

const CreateTopicStep = ({ onNext, postData }) => {
  const [title, setTitle] = useState(postData.title || '');
  const [selectedType, setSelectedType] = useState(postData.type || '');

  const cardTypes = [
    {
      type: 'Question',
      icon: 'fas fa-question-circle',
      title: 'Ask Question',
      description: 'Get help from the EASIHUB community on implementation errors, integration bugs, or deployment issues.',
      placeholder: 'e.g., How to integrate SAP with Power BI?'
    },
    {
      type: 'Use Case',
      icon: 'fas fa-briefcase',
      title: 'Use Case',
      description: 'Share practical examples of how enterprise software is customized, configured, or deployed.',
      placeholder: 'e.g., Automating invoice validation using RPA'
    },
    {
      type: 'Discussion',
      icon: 'fas fa-comments',
      title: 'Discussion',
      description: 'Engage peers in discussions around best practices, trade-offs, or architecture decisions in enterprise systems.',
      placeholder: 'e.g., Best architecture for hybrid cloud setup?'
    },
    {
      type: 'Article',
      icon: 'fas fa-file-alt',
      title: 'Article',
      description: 'Contribute deep-dive articles or tutorials on enterprise software, use cases, or tool comparisons.',
      placeholder: 'e.g., 7 Lessons Learned from SAP S/4HANA Migration'
    },
    {
      type: 'Job',
      icon: 'fas fa-briefcase-medical',
      title: 'Job',
      description: 'List open positions related to ERP, PLM, CRM, or enterprise tech roles your team is hiring for.',
      placeholder: 'e.g., SAP Consultant – Remote | 6 months'
    },
    {
      type: 'Event',
      icon: 'fas fa-calendar-alt',
      title: 'Event',
      description: 'Announce upcoming webinars, user group sessions, or tech conferences relevant to enterprise platforms.',
      placeholder: 'e.g., Tech Talk: Digital Thread in PLM'
    },
    {
      type: 'Bulletin',
      icon: 'fas fa-bullhorn',
      title: 'Bulletin',
      description: 'Share vendor release notes, patch advisories, or important updates affecting enterprise software users.',
      placeholder: 'e.g., Oracle Patch Update – April 2025'
    }
  ];

  const selectedCard = cardTypes.find(card => card.type === selectedType);
  const canProceed = selectedType && title.trim().length >= 5;

  useEffect(() => {
    const easibotInput = localStorage.getItem('easibot_smart_post_input');
    if (easibotInput && !title) {
      setTitle(easibotInput);
      localStorage.removeItem('easibot_smart_post_input');
    }
  }, [title]);

  const handleCardSelect = (type) => {
    setSelectedType(selectedType === type ? '' : type);
  };

  const handleNext = () => {
    if (canProceed) {
      onNext({ type: selectedType, title });
    }
  };

  return (
    <div className="smart-post-card">
      <div className="select-type">
        <div className="sparkle" style={{ top: '50px', left: '2%' }}>✨</div>
        <div className="sparkle" style={{ top: '140px', right: '4%' }}>✨</div>
        <div className="sparkle" style={{ bottom: '160px', left: '20%' }}>✨</div>
        <div className="sparkle" style={{ bottom: '100px', right: '28%' }}>✨</div>
        <div className="sparkle" style={{ top: '320px', left: '48%' }}>✨</div>
        
        <div className="title-input">
          <label className="title-header"><strong>Give your post a title:</strong></label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={selectedCard?.placeholder || ''}
            className="ai-input"
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              padding: '0.75rem', 
              fontSize: '1rem', 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              marginTop: '0.5rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div className="card-grid">
          {cardTypes.map(card => (
            <div 
              key={card.type}
              className={`card ${selectedType === card.type ? 'selected' : ''}`}
              onClick={() => handleCardSelect(card.type)}
              title={card.description}
            >
              <div className="checkmark"></div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  <i className={`${card.icon} icon`}></i> {card.title}
                </h3>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="button-row">
          <button 
            className="nav-btn" 
            disabled={!canProceed}
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTopicStep;