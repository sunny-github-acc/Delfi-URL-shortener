import { useState } from 'react';
import './App.css';

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedError, setShortenedError] = useState('');
  const [retrieveError, setRetrieveError] = useState('');

  const handleShorten = async () => {
    setShortenedError('');
  
    if (!inputUrl.trim()) {
      setShortenedError('Please enter a URL');
      return;
    }

    if (!isValidUrl(inputUrl)) {
      setShortenedError('Please enter a valid URL');
      return;
    }

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      setShortUrl(data.shortUrl);
      setOriginalUrl('');
      setRetrieveError('');
    } catch (err) {
      setShortenedError('Failed to shorten URL');
      console.error('Shorten failed:', err);
    }
  };

  const handleRetrieve = async () => {
    if (!inputKey.trim()) {
      setRetrieveError('Please enter a short key');
      return;
    }

    try {
      const res = await fetch(`/api/original/${inputKey}`);
      if (!res.ok) throw new Error('URL not found');

      const data = await res.json();
      setOriginalUrl(data.originalUrl);
      setRetrieveError('');
    } catch (err) {
      setOriginalUrl('');
      setRetrieveError('No URL found for this key');
    }
  };

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>URL Shortener</h2>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter a long URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
        />
        <button onClick={handleShorten} style={{ padding: '0.5rem 1rem' }}>
          Shorten
        </button>
      </div>

      {shortUrl && (
        <div style={{ marginTop: '1rem' }}>
          Short URL:{' '}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </div>
      )}

      {shortenedError && (
        <div style={{ marginTop: '1rem', color: 'red' }}>{shortenedError}</div>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>Retrieve Original URL</h3>
      <div>
        <input
          type="text"
          placeholder="Enter short key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          style={{ padding: '0.5rem', width: '150px', marginRight: '0.5rem' }}
        />
        <button onClick={handleRetrieve} style={{ padding: '0.5rem 1rem' }}>
          Retrieve
        </button>
      </div>

      {originalUrl && (
        <div style={{ marginTop: '1rem' }}>
          Original URL:{' '}
          <a href={originalUrl} target="_blank" rel="noreferrer">
            {originalUrl}
          </a>
        </div>
      )}

      {retrieveError && (
        <div style={{ marginTop: '1rem', color: 'red' }}>{retrieveError}</div>
      )}
    </div>
  );
}

export default App;
