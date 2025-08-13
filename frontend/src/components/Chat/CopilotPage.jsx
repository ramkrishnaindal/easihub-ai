import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from '../shared/MessageBubble';

const CopilotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const sessionId = useRef(`user_${Math.random().toString(36).substr(2, 16)}_${Date.now()}`);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer easihub-4f00fa05-d242-4ac7-9872-904e4391be0b'
        },
        body: JSON.stringify({
          session_id: sessionId.current,
          query: currentInput
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      const lines = responseText.split('\n');
      let fullResponse = '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            console.log('Parsed data:', data);
            if (data.chunk && data.type === 'content') {
              fullResponse += data.chunk;
            }
          } catch (e) {
            console.warn('Failed to parse JSON:', line, e);
          }
        }
      }

      console.log('Full response:', fullResponse);
      const botMessage = { 
        text: fullResponse || 'No response received', 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = { 
        text: `Error: ${error.message}`, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-container" style={{ height: '100%' }}>
      <div className="chat-header">
        <h2>You're talking with <strong>EASIbot</strong></h2>
        <span>ENTERPRISE AI</span>
      </div>
      
      <div className="chat-body" ref={chatBodyRef}>
        <div className="chat-message-ai">
          <h3>Hi there!</h3>
          <p>Welcome to <strong>EASIHUB</strong>!</p>
          <p>You're now talking with <strong>EASIbot</strong> — your exclusive AI companion, purpose-built for enterprise application professionals.</p>
          <p>Whether you're a <strong>developer, consultant, architect, or project manager</strong>, I'm here to help you:</p>
          <ul className="custom-list">
            <li>Find solutions across ERP, CRM, PLM, SCM, MES, HCM, and more</li>
            <li>Break down complex implementation questions</li>
            <li>Guide you to the right use cases, discussions, or expert threads</li>
            <li>Or just spark new ideas as you explore your enterprise tech stack</li>
          </ul>
          <p><em>I'm still an experimental AI, so please go easy on me, but I'm learning quickly and will keep getting better with time!</em></p>
          <p>💡 Unlike general-purpose AIs, I'm trained exclusively on enterprise software topics. So go ahead—ask me about APIs, upgrades, workflows, or integration!</p>
          <p>🛠️ Powered by <strong>EASIHUB</strong> — built for enterprise minds like yours.</p>
        </div>
        <div className="chat-image">
          <img src="https://cdn.easihub.com/uploads/default/original/1X/712760a2a2948e30b7e889b5ded00d990ebbcd41.jpeg" alt="EASIbot" />
        </div>
        
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="copilot-message bot">
            <div className="copilot-profile-fallback" style={{
              width: '32px',
              height: '32px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              backgroundColor: '#10B981',
              flexShrink: 0
            }}>AI</div>
            <div className="copilot-message-container">
              <div className="copilot-bubble bot">Typing...</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything ..." 
        />
        <button type="button" onClick={sendMessage}>Send ✈️</button>
      </div>
    </div>
  );
};

export default CopilotPage;