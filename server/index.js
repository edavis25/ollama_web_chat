import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ollama backend running');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
