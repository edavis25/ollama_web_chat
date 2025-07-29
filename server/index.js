import express from 'express';
import axios from 'axios';

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

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
