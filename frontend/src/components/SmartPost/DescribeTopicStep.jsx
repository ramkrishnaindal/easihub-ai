import React, { useState, useEffect } from 'react';

const DescribeTopicStep = ({ onNext, onBack, postData }) => {
  const [fields, setFields] = useState({});

  const getFieldsForType = (type) => {
    const fieldConfigs = {
      'Question': [
        { id: 'step2Desc', label: 'Step 2: Problem Details', placeholder: 'Describe domain/software/tech area, version, specific error, API or module you\'re working with...' },
        { id: 'step3', label: 'Step 3: Attempted Solutions', placeholder: 'What configurations, code, logic or solution have you already attempted and what were the results?' }
      ],
      'Use Case': [
        { id: 'step2Desc', label: 'Step 2: Problem & Objective', placeholder: 'Explain the business or technical challenge, and your goal or what needed to be solved...' },
        { id: 'step3', label: 'Step 3: Solution & Implementation', placeholder: 'Describe APIs, scripts, tools, configuration, or integrations used to implement the solution...' }
      ],
      'Discussion': [
        { id: 'step2Desc', label: 'Step 2: Background & Context', placeholder: 'Briefly explain the system, problem, or scenario you\'re thinking through...' },
        { id: 'step3', label: 'Step 3: Insight You\'re Seeking', placeholder: 'Are you seeking opinions, strategies, architecture trade-offs, or experience-based input?' }
      ],
      'Article': [
        { id: 'step2Desc', label: 'Step 2: Article Content or External URL', placeholder: 'Write your content here (Markdown/HTML) or paste an article URL (e.g., https://yourdomain.com/article123)' }
      ],
      'Event': [
        { id: 'step2Desc', label: 'Step 2: Event Overview or URL', placeholder: 'Provide event details or paste registration link...' }
      ],
      'Bulletin': [
        { id: 'step2Desc', label: 'Step 2: Bulletin Summary', placeholder: 'Summarize the purpose of this bulletin. Example: "Oracle released a quarterly patch update affecting middleware."' },
        { id: 'step3', label: 'Step 3: Important Details or Impact', placeholder: 'Provide links, release notes, impacted versions, or timing. Include key highlights or urgency.' }
      ],
      'Job': [
        { id: 'step2Desc', label: 'Step 2: Responsibilities', placeholder: 'List duties and job role expectations...' },
        { id: 'step3', label: 'Step 3: Qualifications/Apply Info', placeholder: 'Application link, email, or required skills...' }
      ]
    };

    return fieldConfigs[type] || [];
  };

  const currentFields = getFieldsForType(postData.type);

  useEffect(() => {
    // Initialize fields with existing data
    const initialFields = {};
    currentFields.forEach(field => {
      initialFields[field.id] = postData.description || '';
    });
    setFields(initialFields);
  }, [postData.type]);

  const handleFieldChange = (fieldId, value) => {
    setFields(prev => ({ ...prev, [fieldId]: value }));
  };

  const canProceed = currentFields.every(field => 
    fields[field.id] && fields[field.id].length > 10
  );

  const handleNext = () => {
    if (canProceed) {
      const description = Object.values(fields).filter(Boolean).join('\n');
      onNext({ description });
    }
  };

  return (
    <div className="smart-post-card">
      <div className="step">
        <h2 className="heading">{postData.type} – Describe Your Post</h2>
        
        <div className="step-fields">
          {currentFields.map(field => (
            <div key={field.id} className="field-group">
              <label className="textarea-desc">{field.label}</label>
              <textarea 
                className="textarea-box"
                placeholder={field.placeholder}
                value={fields[field.id] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                rows={4}
              />
            </div>
          ))}
        </div>
        
        <div className="button-row">
          <button className="nav-btn" onClick={onBack}>← Back</button>
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

export default DescribeTopicStep;