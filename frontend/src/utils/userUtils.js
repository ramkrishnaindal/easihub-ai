// Utility functions for user management

export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = (userData) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    window.currentUser = userData;
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const initializeUserFromQuery = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const avatarTemplate = urlParams.get('avatar_template');
  
  if (username || avatarTemplate) {
    const userData = {
      username: username || 'Guest',
      avatar_template: avatarTemplate || ''
    };
    setCurrentUser(userData);
  }
};

export const getUserAvatar = () => {
  const user = getCurrentUser();
  return user?.avatar_template || '';
};

export const getUsername = () => {
  const user = getCurrentUser();
  return user?.username || 'Guest';
};