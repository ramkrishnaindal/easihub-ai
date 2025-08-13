import React from 'react';

const LauncherPanel = ({ onStartAI, onStartManual }) => {
  return (
    <div className="launcher-panel">
      <div className="sparkle" style={{ top: '50px', left: '8%' }}>✨</div>
      <div className="sparkle" style={{ top: '140px', right: '12%' }}>✨</div>
      <div className="sparkle" style={{ bottom: '160px', left: '20%' }}>✨</div>
      <div className="sparkle" style={{ bottom: '100px', right: '28%' }}>✨</div>
      <div className="sparkle" style={{ top: '320px', left: '48%' }}>✨</div>
      
      <h1>Let's begin your next post!</h1>
      <p>Use the power of AI to guide you through posting questions, jobs, or use cases quickly and easily.</p>
      
      <button className="btn-get-started" onClick={onStartAI}>
        Get started using AI
      </button>
      <button className="btn-without-ai" onClick={onStartManual}>
        I'll do it without AI
      </button>
      
      <div className="disclaimer">
        Beta feature powered by EASIBOT (uses OpenAI API). Your use of this feature will be
        subject to <a href="https://openai.com/policies/usage-policies" target="_blank" rel="noopener noreferrer">OpenAI's Usage Policy</a>
        and our <a href="#">Privacy Terms</a>.
      </div>
    </div>
  );
};

export default LauncherPanel;