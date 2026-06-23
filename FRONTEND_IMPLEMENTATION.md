# 🚀 URL Shortener Frontend Implementation Guide

**Version:** 1.0.0  
**Last Updated:** June 2026  
**API Base URL:** `http://localhost:2000` (Development) | Update for production

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [API Integration](#api-integration)
4. [Service Layer](#service-layer)
5. [Component Examples](#component-examples)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### Minimum Setup (5 minutes)

```javascript
// 1. Set API URL in your .env file
REACT_APP_API_URL=http://localhost:2000

// 2. Make a request
const response = await fetch(`${process.env.REACT_APP_API_URL}/app/v1/generateUrl`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com', expireInDays: 10 })
});
const data = await response.json();
```

---

## ⚙️ Environment Setup

### For React Projects

**Create `.env` file in root:**
```env
REACT_APP_API_URL=http://localhost:2000
REACT_APP_API_TIMEOUT=10000
```

**Create `.env.production` for production:**
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_TIMEOUT=15000
```

### For Vue Projects

**.env.local:**
```env
VUE_APP_API_URL=http://localhost:2000
VUE_APP_API_TIMEOUT=10000
```

### For Angular Projects

**environment.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:2000',
  apiTimeout: 10000
};
```

### For Next.js Projects

**.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:2000
```

---

## 🔗 API Integration

### Response Format (All Endpoints)

```json
{
  "error": false,
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data here
  }
}
```

### Endpoint 1: Health Check

**Purpose:** Verify API is running

```http
GET /health
```

**Response:**
```json
{
  "error": false,
  "statusCode": 200,
  "message": "Health is Ok!",
  "data": {}
}
```

**Example:**
```javascript
const checkHealth = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
  const data = await response.json();
  console.log(data.message); // "Health is Ok!"
};
```

---

### Endpoint 2: Generate Short URL

**Purpose:** Create a shortened URL from a long URL

```http
POST /app/v1/generateUrl
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url/path",
  "expireInDays": 30
}
```

**Request Parameters:**

| Parameter | Type | Required | Default | Range | Notes |
|-----------|------|----------|---------|-------|-------|
| `url` | string | ✅ Yes | — | — | Must start with `http://` or `https://` |
| `expireInDays` | number | ❌ No | 10 | 1-365 | Days until URL expires |

**Success Response (200):**
```json
{
  "error": false,
  "statusCode": 200,
  "message": "URL saved successfully",
  "data": {
    "url": "http://localhost:2000/a1b2c3d4e5",
    "expireInDays": 30
  }
}
```

**Error Response (400) - Invalid URL:**
```json
{
  "error": true,
  "statusCode": 400,
  "message": "Url not found",
  "data": {}
}
```

**Error Response (500) - Server Error:**
```json
{
  "error": true,
  "statusCode": 500,
  "message": "Error while creating URL",
  "data": {}
}
```

**Example:**
```javascript
const generateShortUrl = async (longUrl, expireDays = 10) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/app/v1/generateUrl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: longUrl,
        expireInDays: expireDays
      })
    });

    const data = await response.json();
    
    if (!data.error) {
      return { success: true, shortUrl: data.data.url };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

---

### Endpoint 3: Redirect to Original URL

**Purpose:** Access short URL and redirect to original

```http
GET /:id
```

**Path Parameters:**

| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| `id` | string | ✅ Yes | `a1b2c3d4e5` |

**Responses:**

- **302 Found** - Redirects to original URL
- **404 Not Found** - ID doesn't exist or URL expired
- **500 Internal Server Error** - Server error

**Example:**
```javascript
// Automatic redirect
const redirectToOriginal = (shortId) => {
  window.location.href = `${process.env.REACT_APP_API_URL}/${shortId}`;
};

// Manual link
<a href="http://localhost:2000/a1b2c3d4e5" target="_blank">
  Open Short URL
</a>
```

---

## 📦 Service Layer

### Using Fetch API (Recommended for simple projects)

**Create `services/urlService.js`:**

```javascript
const API_URL = process.env.REACT_APP_API_URL;

export const urlService = {
  async generateShortUrl(longUrl, expireDays = 10) {
    try {
      const response = await fetch(`${API_URL}/app/v1/generateUrl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl, expireInDays: expireDays })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message);
      }
      
      return data.data;
    } catch (error) {
      throw new Error(`Failed to generate short URL: ${error.message}`);
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      return !data.error;
    } catch {
      return false;
    }
  },

  redirectToOriginal(shortId) {
    window.location.href = `${API_URL}/${shortId}`;
  }
};
```

### Using Axios (Recommended for complex projects)

**Create `services/urlService.js`:**

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const urlService = {
  async generateShortUrl(longUrl, expireDays = 10) {
    const response = await API.post('/app/v1/generateUrl', {
      url: longUrl,
      expireInDays: expireDays
    });
    
    if (response.data.error) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  async checkHealth() {
    try {
      const response = await API.get('/health');
      return !response.data.error;
    } catch {
      return false;
    }
  },

  redirectToOriginal(shortId) {
    window.location.href = `${process.env.REACT_APP_API_URL}/${shortId}`;
  }
};
```

**Install Axios:**
```bash
npm install axios
```

---

## 🎨 Component Examples

### Example 1: React Functional Component with Hooks

```jsx
import { useState } from 'react';
import { urlService } from '../services/urlService';

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [expireDays, setExpireDays] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const result = await urlService.generateShortUrl(longUrl, expireDays);
      setShortUrl(result.url);
    } catch (err) {
      setError(err.message || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>🔗 URL Shortener</h1>
      
      <form onSubmit={handleShorten}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="longUrl">Enter Long URL:</label>
          <input
            id="longUrl"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="expireDays">Expires In (Days):</label>
          <input
            id="expireDays"
            type="number"
            min="1"
            max="365"
            value={expireDays}
            onChange={(e) => setExpireDays(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !longUrl}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          ❌ {error}
        </div>
      )}

      {shortUrl && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 10px 0' }}>✅ Short URL created!</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={shortUrl}
              readOnly
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: '8px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Expires in {expireDays} days
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### Example 2: React Component with useEffect (Advanced)

```jsx
import { useState, useEffect } from 'react';
import { urlService } from '../services/urlService';

export default function UrlShortenerAdvanced() {
  const [formData, setFormData] = useState({ url: '', expireDays: 10 });
  const [state, setState] = useState({
    loading: false,
    error: '',
    shortUrl: '',
    isHealthy: false,
    history: []
  });

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await urlService.checkHealth();
      setState(prev => ({ ...prev, isHealthy }));
    };
    checkHealth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '', shortUrl: '' }));

    try {
      const result = await urlService.generateShortUrl(formData.url, formData.expireDays);
      setState(prev => ({
        ...prev,
        shortUrl: result.url,
        history: [result.url, ...prev.history].slice(0, 5)
      }));
      setFormData({ url: '', expireDays: 10 });
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔗 URL Shortener</h1>

      {!state.isHealthy && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '15px' }}>
          ⚠️ API is not responding. Please check the backend server.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Long URL:</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            required
            disabled={state.loading}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Expires In (Days):</label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.expireDays}
            onChange={(e) => setFormData(prev => ({ ...prev, expireDays: Number(e.target.value) }))}
            disabled={state.loading}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={state.loading || !state.isHealthy || !formData.url}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: state.loading || !state.isHealthy ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.loading || !state.isHealthy ? 'not-allowed' : 'pointer'
          }}
        >
          {state.loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>

      {state.error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>
          ❌ {state.error}
        </div>
      )}

      {state.shortUrl && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '15px' }}>
          <p>✅ Short URL: <strong>{state.shortUrl}</strong></p>
          <button onClick={() => navigator.clipboard.writeText(state.shortUrl)}>Copy</button>
        </div>
      )}

      {state.history.length > 0 && (
        <div>
          <h3>Recent URLs:</h3>
          <ul>
            {state.history.map((url, idx) => (
              <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### Example 3: Vue.js Component

```vue
<template>
  <div class="url-shortener">
    <h1>🔗 URL Shortener</h1>

    <form @submit.prevent="handleShorten">
      <div class="form-group">
        <label for="longUrl">Enter Long URL:</label>
        <input
          id="longUrl"
          v-model="longUrl"
          type="url"
          placeholder="https://example.com"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="expireDays">Expires In (Days):</label>
        <input
          id="expireDays"
          v-model.number="expireDays"
          type="number"
          min="1"
          max="365"
          :disabled="loading"
        />
      </div>

      <button type="submit" :disabled="loading || !longUrl">
        {{ loading ? 'Creating...' : 'Shorten URL' }}
      </button>
    </form>

    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>

    <div v-if="shortUrl" class="success">
      <p>✅ Short URL: <strong>{{ shortUrl }}</strong></p>
      <button @click="copyToClipboard">Copy</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'UrlShortener',
  setup() {
    const longUrl = ref('');
    const shortUrl = ref('');
    const expireDays = ref(10);
    const loading = ref(false);
    const error = ref('');

    const generateShortUrl = async () => {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await fetch(`${apiUrl}/app/v1/generateUrl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: longUrl.value,
            expireInDays: expireDays.value
          })
        });

        const data = await response.json();

        if (data.error) {
          error.value = data.message;
          shortUrl.value = '';
        } else {
          shortUrl.value = data.data.url;
          error.value = '';
          longUrl.value = '';
        }
      } catch (err) {
        error.value = 'Network error';
      }
    };

    const handleShorten = async () => {
      loading.value = true;
      try {
        await generateShortUrl();
      } finally {
        loading.value = false;
      }
    };

    const copyToClipboard = () => {
      navigator.clipboard.writeText(shortUrl.value);
      alert('Copied to clipboard!');
    };

    return {
      longUrl,
      shortUrl,
      expireDays,
      loading,
      error,
      handleShorten,
      copyToClipboard
    };
  }
};
</script>

<style scoped>
.url-shortener {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-top: 15px;
}

.success {
  padding: 15px;
  background-color: #d4edda;
  border-radius: 4px;
  margin-top: 15px;
}
</style>
```

---

## 🚨 Error Handling

### Common Error Scenarios

**1. Invalid URL Format**

```javascript
try {
  await urlService.generateShortUrl('not-a-valid-url');
} catch (error) {
  console.error(error); // "Url not found"
}

// FIX: Always include http:// or https://
await urlService.generateShortUrl('https://example.com');
```

**2. Network Error**

```javascript
const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

// Usage
await withRetry(() => urlService.generateShortUrl(url));
```

**3. API Timeout**

```javascript
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Usage
const response = await fetchWithTimeout(`${API_URL}/app/v1/generateUrl`, {...});
```

---

## ✅ Best Practices

### 1. Always Validate Input

```javascript
const validateUrl = (url) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

const handleSubmit = (url) => {
  if (!validateUrl(url)) {
    setError('Please enter a valid URL starting with http:// or https://');
    return;
  }
  // Proceed with API call
};
```

### 2. Implement Loading States

```javascript
const [state, setState] = useState({
  isLoading: false,
  isError: false,
  data: null
});

// During request
setState({ isLoading: true, isError: false, data: null });

// On success
setState({ isLoading: false, isError: false, data: result });

// On error
setState({ isLoading: false, isError: true, data: null });
```

### 3. Cache Results

```javascript
const useUrlShortener = () => {
  const [cache, setCache] = useState({});

  const generateShortUrl = async (longUrl, expireDays = 10) => {
    const key = `${longUrl}-${expireDays}`;
    
    if (cache[key]) {
      return cache[key];
    }

    const result = await urlService.generateShortUrl(longUrl, expireDays);
    setCache(prev => ({ ...prev, [key]: result }));
    return result;
  };

  return { generateShortUrl };
};
```

### 4. Copy to Clipboard

```javascript
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

### 5. Use Constants for Configuration

```javascript
// config.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    GENERATE: '/app/v1/generateUrl',
    HEALTH: '/health'
  },
  DEFAULTS: {
    EXPIRE_DAYS: 10,
    TIMEOUT: 10000
  },
  VALIDATION: {
    MIN_EXPIRE: 1,
    MAX_EXPIRE: 365
  }
};

// usage in component
import { API_CONFIG } from '../config';
const expireMin = API_CONFIG.VALIDATION.MIN_EXPIRE;
```

---

## 🔍 Troubleshooting

### Issue: CORS Error

**Error Message:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**
1. Verify `ALLOWED_HOST` in backend `.env` matches your frontend URL
2. Restart the backend server after changing `.env`
3. Check that your frontend URL is exactly as configured

```javascript
// Frontend: http://localhost:3000
// Backend .env: ALLOWED_HOST=http://localhost:3000
```

### Issue: "URL not found" Error

**Error Message:**
```json
{
  "error": true,
  "message": "Url not found"
}
```

**Solutions:**
1. Ensure URL starts with `http://` or `https://`
2. Check URL is complete and valid
3. Test URL format:

```javascript
try {
  new URL(userInput);
  console.log('Valid URL');
} catch {
  console.log('Invalid URL');
}
```

### Issue: URLs Expire Immediately

**Symptoms:** Generated URLs stop working after a few hours

**Solutions:**
1. Increase `expireInDays` parameter
2. Check database isn't being cleared
3. Verify system time is correct

```javascript
// Always provide a reasonable expiration
const result = await urlService.generateShortUrl(url, 30); // 30 days
```

### Issue: Slow Response Times

**Solutions:**

```javascript
// 1. Check network latency
console.time('URL Generation');
const result = await urlService.generateShortUrl(url);
console.timeEnd('URL Generation');

// 2. Implement request timeout
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// 3. Add request caching
const memoize = (fn) => {
  const cache = {};
  return (url) => cache[url] || (cache[url] = fn(url));
};
```

### Issue: Redirect Not Working

**Solutions:**

```javascript
// 1. Use window.location.href (full page reload)
window.location.href = shortUrl;

// 2. Use target="_blank" for new tab
<a href={shortUrl} target="_blank" rel="noopener noreferrer">
  Open URL
</a>

// 3. Verify short ID is correct
const redirectToOriginal = (shortId) => {
  const shortUrl = `${process.env.REACT_APP_API_URL}/${shortId}`;
  console.log('Redirecting to:', shortUrl);
  window.location.href = shortUrl;
};
```

---

## 📞 Support & Resources

### Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Check API | `/health` | GET |
| Create Short URL | `/app/v1/generateUrl` | POST |
| Redirect | `/:id` | GET |

### Testing Tools

- **Postman:** Import and test all endpoints
- **cURL:** Command-line testing
- **Browser DevTools:** Network tab to inspect requests/responses

### Frontend Framework Guides

- **React:** Use hooks (useState, useEffect)
- **Vue:** Use reactive() and ref()
- **Angular:** Use HttpClientModule
- **Svelte:** Use reactive declarations

---

## 📝 Checklist Before Deployment

- [ ] API Base URL configured correctly
- [ ] Environment variables set up
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Input validation working
- [ ] Timeout handling in place
- [ ] Copy-to-clipboard functionality
- [ ] Health check on app load
- [ ] CORS configuration verified
- [ ] Tested with real backend

---

**Happy Shortening! 🚀**

For issues or questions, contact the backend team or check the main README.md
