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
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Helper function to validate and improve tags using OpenAI
async function validateTagsWithAI(tags, title, content) {
  if (!tags || tags.length === 0) return [];
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Given this post title: "${title}" and content: "${content.substring(0, 500)}...", validate and improve these tags: ${tags.join(', ')}. Return only valid, relevant tags for enterprise software topics (ERP, CRM, PLM, etc.), lowercase, hyphenated, max 5 tags. Format as comma-separated list.`
        }],
        max_tokens: 100,
        temperature: 0.3
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiTags = data.choices[0].message.content.trim().split(',').map(tag => tag.trim().toLowerCase());
      return aiTags.slice(0, 5); // Max 5 tags
    }
  } catch (error) {
    console.warn('AI tag validation failed:', error.message);
  }
  
  // Fallback to original tags if AI fails
  return tags.map(tag => tag.toLowerCase().replace(/\s+/g, '-'));
}

// Helper function to create tags if they don't exist
async function createTagsIfNeeded(tags) {
  if (!tags || tags.length === 0) return [];
  
  const validTags = [];
  for (const tag of tags) {
    try {
      const response = await fetch('https://easihub.com/tags.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.DISCOURSE_API_KEY,
          'Api-Username': process.env.DISCOURSE_API_USERNAME,
        },
        body: JSON.stringify({ tag: { id: tag } })
      });
      
      if (response.ok || response.status === 422) { // 422 means tag already exists
        validTags.push(tag);
      }
    } catch (error) {
      console.warn(`Failed to create tag ${tag}:`, error.message);
    }
  }
  return validTags;
}

app.post('/api/posts', async (req, res) => {
  try {
    // Validate and improve tags with AI first
    const aiValidatedTags = await validateTagsWithAI(req.body.tags, req.body.title, req.body.raw);
    // Create tags in Discourse
    const validTags = await createTagsIfNeeded(aiValidatedTags);
    
    const payload = {
      title: req.body.title,
      raw: req.body.raw,
      category: req.body.category,
      archetype: 'regular'
    };
    
    // Add tags if we have valid ones
    if (validTags.length > 0) {
      payload.tags = validTags;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch('https://easihub.com/posts.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.DISCOURSE_API_KEY,
        'Api-Username': process.env.DISCOURSE_API_USERNAME,
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discourse API error:', errorText);
      return res.status(response.status).json({ error: 'Failed to create topic', details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout - easihub.com is not responding' });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Cannot connect to easihub.com - service unavailable' });
    }
    res.status(500).json({ error: error.message });
  }
});

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
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend available at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
});