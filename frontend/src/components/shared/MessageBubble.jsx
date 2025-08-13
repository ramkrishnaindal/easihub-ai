import React from 'react';
import ProfileImage from './ProfileImage';

const MessageBubble = ({ message }) => {
  const { text, sender, timestamp } = message;
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatText = (text) => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  return (
    <div className={`copilot-message ${sender}`}>
      <ProfileImage sender={sender} />
      <div className="copilot-message-container">
        <div 
          className={`copilot-bubble ${sender}`}
          dangerouslySetInnerHTML={{ __html: formatText(text) }}
        />
        <span className="copilot-timestamp">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;