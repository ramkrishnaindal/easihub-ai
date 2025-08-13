import React, { useState } from 'react';
import LauncherPanel from './LauncherPanel';
import SmartPostSteps from './SmartPostSteps';

const SmartPostPage = () => {
  const [showSteps, setShowSteps] = useState(false);

  const handleStartAI = () => {
    setShowSteps(true);
  };

  const handleStartManual = () => {
    // Redirect to Discourse new topic page in new tab
    const baseUrl = process.env.REACT_APP_DISCOURSE_BASE_URL || 'https://easihub.com';
    window.open(`${baseUrl}/new-topic`, '_blank');
  };

  return (
    <div className="ai-body">
      {!showSteps ? (
        <LauncherPanel 
          onStartAI={handleStartAI}
          onStartManual={handleStartManual}
        />
      ) : (
        <SmartPostSteps />
      )}
    </div>
  );
};

export default SmartPostPage;