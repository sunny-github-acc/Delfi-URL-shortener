import express from 'express';

const app = express();
const PORT = 8000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'world!' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
