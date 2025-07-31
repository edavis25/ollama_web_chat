import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const promptPath = path.join(process.cwd(), '', 'system_prompt.txt');
function getSystemPrompt() {
  try {
    return fs.readFileSync(promptPath, 'utf8');
  } catch (e) {
    console.error(e)
    return '';
  }
}

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
  const systemPrompt = getSystemPrompt();
  console.log('System prompt:', systemPrompt);
  try {
    const ollamaRes = await axios.post('http://localhost:11434/api/chat', {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    }, { responseType: 'stream' });

    let fullResponse = '';
    ollamaRes.data.on('data', chunk => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message && data.message.content) {
            console.log(data.message.content);
            fullResponse += data.message.content;
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
    res.status(500).json({ error: 'Failed to chat with model' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
