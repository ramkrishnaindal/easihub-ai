import React, { useState } from 'react';
import { getCurrentUser } from '../../utils/userUtils';

const ProfileImage = ({ sender }) => {
  const [imageError, setImageError] = useState(false);
  const currentUser = getCurrentUser();

  const config = {
    user: {
      imageUrl: currentUser?.avatar_template || '',
      fallbackText: 'U',
      fallbackColor: '#4F46E5'
    },
    bot: {
      imageUrl: 'https://cdn.easihub.com/uploads/default/original/1X/ef2da94754050869cd287944bce52d5c30f4ef18.jpeg',
      fallbackText: 'AI',
      fallbackColor: '#10B981'
    }
  };

  const currentConfig = config[sender];

  if (imageError) {
    return (
      <div 
        className="copilot-profile-fallback"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          backgroundColor: currentConfig.fallbackColor,
          flexShrink: 0
        }}
      >
        {currentConfig.fallbackText}
      </div>
    );
  }

  return (
    <img 
      className="copilot-profile-img"
      src={currentConfig.imageUrl}
      alt={sender === 'user' ? 'User' : 'Bot'}
      onError={() => setImageError(true)}
    />
  );
};

export default ProfileImage;