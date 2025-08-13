const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.post('/api/chat/stream', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const response = await fetch('https://easihub.com/chat_api/chat/stream', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer easihub-4f00fa05-d242-4ac7-9872-904e4391be0b'
      },
      body: JSON.stringify(req.body)
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return res.status(response.status).json({ error: `HTTP error! status: ${response.status}`, details: errorText });
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/doc-api/*', async (req, res) => {
  try {
    const endpoint = req.params[0];
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': req.get('User-Agent') || 'Mozilla/5.0',
      'Referer': 'https://easihub.com/',
      'Origin': 'https://easihub.com'
    };
    
    // Forward authorization headers if present
    if (req.get('Authorization')) {
      headers['Authorization'] = req.get('Authorization');
    }
    if (req.get('Cookie')) {
      headers['Cookie'] = req.get('Cookie');
    }
    
    const response = await fetch(`https://easihub.com/doc-api/api/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
});