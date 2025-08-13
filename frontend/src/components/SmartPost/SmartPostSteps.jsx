import React, { useState } from 'react';
import CreateTopicStep from './CreateTopicStep';
import DescribeTopicStep from './DescribeTopicStep';
import ReviewSubmitStep from './ReviewSubmitStep';

const SmartPostSteps = () => {
  const [currentStep, setCurrentStep] = useState('create');
  const [postData, setPostData] = useState({
    type: '',
    title: '',
    description: ''
  });

  const steps = [
    { id: 'create', label: '📝 Create Topic', disabled: false },
    { id: 'describe', label: '📄 Describe Topic', disabled: currentStep === 'create' },
    { id: 'submit', label: '✅ Review & Submit', disabled: currentStep !== 'submit' }
  ];

  const handleNext = (data) => {
    setPostData(prev => ({ ...prev, ...data }));
    if (currentStep === 'create') setCurrentStep('describe');
    else if (currentStep === 'describe') setCurrentStep('submit');
  };

  const handleBack = () => {
    if (currentStep === 'describe') setCurrentStep('create');
    else if (currentStep === 'submit') setCurrentStep('describe');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'create':
        return <CreateTopicStep onNext={handleNext} postData={postData} />;
      case 'describe':
        return <DescribeTopicStep onNext={handleNext} onBack={handleBack} postData={postData} />;
      case 'submit':
        return <ReviewSubmitStep onBack={handleBack} postData={postData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="ai-sub-tabs">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`ai-tab ${currentStep === step.id ? 'active' : ''} ${step.disabled ? 'disabled' : ''}`}
            onClick={() => !step.disabled && setCurrentStep(step.id)}
          >
            {step.label}
          </div>
        ))}
      </div>
      {renderStep()}
    </div>
  );
};

export default SmartPostSteps;