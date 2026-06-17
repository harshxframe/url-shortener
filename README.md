# URL Shortener API

A simple, fast, and lightweight URL shortening service built with Express.js and Node.js. This API allows you to create short URLs with expiration, perfect for sharing long URLs in messages, emails, or social media.

## 🚀 Features

- **Create Short URLs** - Convert long URLs into short, shareable links
- **Expiration Control** - Set custom expiration times for generated URLs (default: 10 days)
- **JWT Authentication** - Secure endpoint with JWT token verification
- **CORS Support** - Cross-origin request handling for frontend integration
- **RESTful API** - Simple and intuitive endpoints
- **Lightweight** - Minimal dependencies and fast response times

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/harshxframe/url-shortener.git
cd url-shortener
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=2000
ALLOWED_HOST=http://localhost:3000
```

**Environment Variables Explanation:**
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 2000)
- `ALLOWED_HOST` - Frontend domain for CORS (configure this to your frontend URL)

### 4. Start the Server
```bash
# Development mode with auto-restart (requires nodemon)
npm start

# Direct Node run
node server.js
```

Server will start on `http://localhost:2000`

---

## 📡 API Endpoints

### 1. Health Check
**Check if the server is running**

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

---

### 2. Generate Short URL
**Create a new shortened URL (Requires JWT Token)**

```http
POST /app/v1/generateUrl
Content-Type: application/json
Authorization: Bearer <YOUR_JWT_TOKEN>
```

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url/path",
  "expireInDays": 30
}
```

**Request Parameters:**
- `url` (required) - The long URL to shorten (must be a valid URL)
- `expireInDays` (optional) - Number of days before the short URL expires (default: 10)

**Response Success (200):**
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

**Response Error (400):**
```json
{
  "error": true,
  "statusCode": 400,
  "message": "Url not found",
  "data": {}
}
```

**Response Error (500):**
```json
{
  "error": true,
  "statusCode": 500,
  "message": "Error while creating URL",
  "data": {}
}
```

---

### 3. Redirect to Original URL
**Retrieve and redirect to the original URL**

```http
GET /:id
```

**Path Parameters:**
- `id` (required) - The short URL ID (e.g., `a1b2c3d4e5`)

**Responses:**
- **302 Found** - Redirects to the original URL
- **404 Not Found** - If ID doesn't exist or URL has expired
- **500 Internal Server Error** - Server error

**Example:**
```
GET /a1b2c3d4e5
```
Redirects to: `https://example.com/very/long/url/path`

---

## 🌐 Frontend Integration Guide

### 1. Environment Setup
Update your frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:2000
```

### 2. Generate Short URL (JavaScript/React Example)

#### Using Fetch API
```javascript
const generateShortUrl = async (longUrl, expireDays = 10) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/app/v1/generateUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}` // Add your JWT token
      },
      body: JSON.stringify({
        url: longUrl,
        expireInDays: expireDays
      })
    });

    const data = await response.json();
    
    if (!data.error) {
      return data.data.url; // Short URL
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error generating short URL:', error);
  }
};

// Usage
const shortUrl = await generateShortUrl('https://example.com/long/url');
console.log('Short URL:', shortUrl);
```

#### Using Axios
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const JWT_TOKEN = localStorage.getItem('jwtToken');

const generateShortUrl = async (longUrl, expireDays = 10) => {
  try {
    const response = await axios.post(
      `${API_URL}/app/v1/generateUrl`,
      {
        url: longUrl,
        expireInDays: expireDays
      },
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`
        }
      }
    );

    if (!response.data.error) {
      return response.data.data.url;
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
};
```

### 3. Redirect User (Automatic)
Simply use the short URL in a link or redirect:

```jsx
// In a React component
const handleRedirect = (shortId) => {
  window.location.href = `${process.env.REACT_APP_API_URL}/${shortId}`;
};

// Or in a link
<a href={`http://localhost:2000/${shortId}`}>
  Open Short URL
</a>
```

### 4. Display Short URL
```jsx
import { useState } from 'react';

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [expireDays, setExpireDays] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:2000/app/v1/generateUrl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          url: longUrl,
          expireInDays: expireDays
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        setShortUrl(data.data.url);
      }
    } catch (err) {
      setError('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleShorten}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="365"
          placeholder="Expire in days"
          value={expireDays}
          onChange={(e) => setExpireDays(Number(e.target.value))}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortUrl && (
        <div>
          <p>Short URL: <a href={shortUrl}>{shortUrl}</a></p>
          <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🔐 Authentication

The `/app/v1/generateUrl` endpoint requires JWT authentication. Add the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**To obtain a JWT token:**
- Implement user login/authentication on your backend
- Generate JWT tokens during user authentication
- Send tokens from frontend with each request to `/generateUrl`

---

## 📦 Response Format

All API responses follow a consistent format:

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

**Response Fields:**
- `error` (boolean) - Indicates if there's an error
- `statusCode` (number) - HTTP status code
- `message` (string) - Human-readable message
- `data` (object) - Response data (empty object `{}` if no data)

---

## 🛠️ Project Structure

```
url-shortener/
├── src/
│   ├── app.js              # Express app initialization
│   ├── middleware.js       # CORS and error handling
│   ├── controller/         # Request handlers
│   │   ├── generateUrl.js
│   │   └── readUrl.js
│   ├── route/              # API routes
│   │   ├── generateUrl.js
│   │   └── readUrl.js
│   ├── service/            # Business logic
│   │   └── urlService.js
│   ├── model/              # Data models
│   │   └── urlModel.js
│   └── utils/              # Utility functions
│       ├── NedbInstance.js
│       ├── calculateTTL.js
│       ├── isUrlValid.js
│       ├── responseBody.js
│       └── urlNotFound.js
├── server.js               # Server entry point
├── package.json            # Dependencies
├── .env                    # Environment variables
└── README.md               # This file
```

---

## 🚨 Common Issues & Solutions

### CORS Error
**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** 
- Ensure `ALLOWED_HOST` in `.env` matches your frontend URL
- Restart the server after changing `.env`

### Unauthorized (401)
**Problem:** "Unauthorized" response when generating URLs

**Solution:**
- Verify JWT token is valid
- Ensure Authorization header is in the correct format: `Bearer <token>`
- Check token hasn't expired

### Invalid URL Error
**Problem:** "Url not found" error when sending valid URL

**Solution:**
- Ensure URL starts with `http://` or `https://`
- URL should be a complete, valid URL format
- Example: `https://example.com` (not just `example.com`)

### URL Expires After Short Time
**Problem:** Generated short URLs stop working

**Solution:**
- Check expiration time in database
- URL expires after the specified `expireInDays`
- Default is 10 days, increase `expireInDays` when generating if needed

---

## 📊 Database

The service uses **NeDB** (Node Embedded Database) for data persistence:
- Lightweight NoSQL database
- Perfect for small to medium projects
- Data stored in `url.db` file
- No external database needed

---

## 🧪 Testing the API

### Using cURL
```bash
# Health check
curl http://localhost:2000/health

# Generate short URL
curl -X POST http://localhost:2000/app/v1/generateUrl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://github.com/harshxframe/url-shortener",
    "expireInDays": 30
  }'

# Access short URL
curl -L http://localhost:2000/abc123def45
```

### Using Postman
1. Create new POST request to `http://localhost:2000/app/v1/generateUrl`
2. Set header: `Authorization: Bearer <JWT_TOKEN>`
3. Set body (JSON):
   ```json
   {
     "url": "https://example.com/long/url",
     "expireInDays": 10
   }
   ```
4. Send and check response

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

ISC License - See LICENSE file for details

---

## 👤 Author

**Harsh Verma** - [GitHub](https://github.com/harshxframe)

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [issue](https://github.com/harshxframe/url-shortener/issues)
- Check existing documentation
- Review example code above

---

## 🔄 Version History

- **v1.0.0** - Initial release with core features

---

**Happy URL Shortening! 🚀**
