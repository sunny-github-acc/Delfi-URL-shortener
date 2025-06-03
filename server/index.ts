import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
dotenv.config();

const PORT = 8000;
const MONGO_URI = 'mongodb://mongo:27017/urlshortener';
const { env: { MONGO_LOCAL } } = process;

mongoose.connect(MONGO_LOCAL || MONGO_URI)
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const urlSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

function generateKey(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

app.post('/api/shorten', async (req: Request, res: Response) => {
  const originalUrl = req.body.url;

  if (!originalUrl) {
    res.status(400).json({ error: 'No URL provided' });
    return;
  }

  // Check if URL already exists
  let existing = await Url.findOne({ originalUrl });
  if (existing) {
    const shortUrl = `${req.protocol}://${req.get('host')}/${existing.key}`;
    res.json({ shortUrl });
    return;
  }

  // Generate unique key
  let key;
  let exists;

  do {
    key = generateKey();
    exists = await Url.findOne({ key });
  } while (exists);

  // Save new URL
  const newUrl = new Url({ key, originalUrl });
  await newUrl.save();

  const shortUrl = `${req.protocol}://${req.get('host')}/${key}`;
  res.json({ shortUrl });
});

app.get('/:key', async (req: Request, res: Response) => {
  const { key } = req.params;
  const urlEntry = await Url.findOne({ key });

  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.get('/api/original/:key', async (req: Request, res: Response) => {
  const { key } = req.params;
  const urlEntry = await Url.findOne({ key });

  if (urlEntry) {
    res.json({ originalUrl: urlEntry.originalUrl });
  } else {
    res.status(404).json({ error: 'URL not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
