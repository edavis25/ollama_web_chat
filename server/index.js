import express from 'express';
import axios from 'axios';
import { formatPrompt } from './promptFormatter.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const ollamaRes = await axios.get('http://localhost:11434/api/tags');
    if (ollamaRes.status === 200) {
      res.json({ status: 'ok' });
    } else {
      res.status(503).json({ status: 'Ollama server unreachable' });
    }
  } catch (e) {
    res.status(503).json({ status: 'Ollama server unreachable' });
  }
});

// lists the locally installed models
app.get('/api/models', async (req, res) => {
  try {
    const ollamaRes = await axios.get('http://localhost:11434/api/tags');
    const data = ollamaRes.data;
    res.json({ models: data.models || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { model, messages } = req.body;
  if (!model || !messages) {
    return res.status(400).json({ error: 'Model and messages are required' });
  }

  try {
    const prompt = formatPrompt({ model, messages });

    const ollamaRes = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt,
      // todo handle openai format (conflict with "prompt" -vs- "messages" key?)
      // messages: [
      //   { role: 'system', content: systemPrompt },
      //   ...messages
      // ]
    }, { responseType: 'stream' });

    let fullResponse = '';
    ollamaRes.data.on('data', chunk => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.response) {
            fullResponse += data.response;
          }
        } catch (e) {
          console.error('Error parsing response from Ollama:', e);
        }
      }
    });
    ollamaRes.data.on('end', () => {
      res.json({ response: fullResponse });
    });
    ollamaRes.data.on('error', () => {
      res.status(500).json({ error: 'Failed to chat with model (stream error)' });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to chat with model' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
