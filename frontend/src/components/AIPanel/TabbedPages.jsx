import React from 'react';
import SmartPostPage from '../SmartPost/SmartPostPage';
import SearchAssistPage from '../Chat/SearchAssistPage';
import CopilotPage from '../Chat/CopilotPage';
import AskDocsPage from '../Chat/AskDocsPage';

const TabbedPages = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'smartPostPage', label: '📝 Smart Post', component: SmartPostPage },
    { id: 'searchAssistPage', label: '🔍 Search Assist', component: SearchAssistPage },
    { id: 'copilotPage', label: '💬 Copilot', component: CopilotPage },
    { id: 'askDocsPage', label: '📘 Ask with Docs', component: AskDocsPage }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div>
      <div className="ai-top-tabs">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="ai-content-section" style={{ display: 'block' }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default TabbedPages;