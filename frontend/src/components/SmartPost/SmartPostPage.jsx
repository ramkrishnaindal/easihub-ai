import React, { useState } from 'react';
import LauncherPanel from './LauncherPanel';
import SmartPostSteps from './SmartPostSteps';

const SmartPostPage = () => {
  const [showSteps, setShowSteps] = useState(false);

  const handleStartAI = () => {
    setShowSteps(true);
  };

  const handleStartManual = () => {
    // Navigate to new topic page since we don't have a popup
    window.location.href = '/new-topic';
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