import React, { useEffect } from "react";
import AIPanel from "./components/AIPanel";
import { initializeUserFromQuery, getCurrentUser, setCurrentUser } from "./utils/userUtils";

// API base URL - since frontend is served from backend, use relative paths
window.API_BASE_URL = '/api';

function App() {
  useEffect(() => {
    initializeUserFromQuery();
    
    // Ensure window.currentUser is set for backward compatibility
    const user = getCurrentUser();
    if (user) {
      window.currentUser = user;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AIPanel />
    </div>
  );
}

export default App;
