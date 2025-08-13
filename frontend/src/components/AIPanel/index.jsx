import React, { useState } from 'react';
import AIHeader from './AIHeader';
import LandingPage from './LandingPage';
import TabbedPages from './TabbedPages';
import './AIPanel.css';

const AIPanel = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('');

  const handleOptionSelect = (pageId) => {
    setCurrentView('tabbed');
    setActiveTab(pageId);
  };

  return (
    <div className="ai-panel-fullscreen">
      <AIHeader />
      <div className="ai-panel-content">
        {currentView === 'landing' ? (
          <LandingPage onOptionSelect={handleOptionSelect} />
        ) : (
          <TabbedPages activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default AIPanel;