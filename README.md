````markdown
# 🌐 URL Shortener
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0.5-brightgreen)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-v7.2.0-orange)](https://redis.io/)
[![React](https://img.shields.io/badge/React-v18.2.0-blue)](https://reactjs.org/)
---
## 🔹 Project Overview
A **full-stack URL shortener** (like TinyURL / Bit.ly) with:
- Shortening of **any valid URL**  
- **Fast redirects** using Redis caching  
- Click **analytics dashboard**  
- Scalable backend optimized for **read-heavy traffic**  
---
## 🔹 Features

- Generate unique short URLs for **any URL**  
- Ultra-fast redirects with **Redis caching**  
- Click tracking and analytics dashboard  
- Validation for invalid URLs  
- Handles **high traffic efficiently**  
- Optional: URL expiry and rate limiting support  

---

## 🔹 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Cache | Redis |
| Frontend | React.js |
| API Testing | Postman / Axios |

---

## 🔹 Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone <your-repo-url>
cd url-shortener
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

* Ensure **MongoDB** is running
* Ensure **Redis** is running

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4️⃣ Start Backend

```bash
cd backend
node src/app.js
```

* Backend runs on `http://localhost:3000`
* Frontend runs on `http://localhost:3001` (if port conflict occurs)

---

## 🔹 Usage

### Shorten a URL

1. Open the frontend in the browser
2. Enter any valid URL → Click **Shorten**
3. Get a short URL like:

```
http://localhost:3000/Ab3xK9q
```

### Redirect

* Open the short URL → Redirects instantly to the original URL
* First click populates **Redis cache**; subsequent clicks are served from cache

### Analytics Dashboard

* Enter the short code → View:

  * Original URL
  * Short code
  * Total clicks
  * Creation date

---

## 🔹 Project Architecture

```
          Frontend (React)
                |
        [API Requests]
                |
         Node.js / Express
         /               \
     Redis Cache        MongoDB
   (Fast Redirects)    (Persistent Storage)
```

**Flow:**

1. User requests a short URL
2. Backend checks **Redis** → cache hit → redirect instantly
3. Cache miss → Backend queries **MongoDB**, saves result to Redis, redirects
4. Clicks increment asynchronously
5. Analytics API fetches click counts

---

## 🔹 Testing

1. Submit any URL → Shorten → Copy generated short URL
2. Click the short URL → Should redirect correctly
3. Check Redis:

```bash
redis-cli GET <shortCode>
```

4. Check MongoDB click counts:

```bash
db.urls.find({ shortCode: "<shortCode>" })
```

5. Analytics dashboard → Enter short code → Verify clicks
6. Test invalid URL / shortCode → Should return proper error

---

## 🔹 Future Enhancements

* Rate limiting per IP to prevent abuse
* URL expiration (TTL)
* Async click tracking for high traffic
* Fully styled frontend (Tailwind/Chakra UI)
* Cloud deployment (AWS / Vercel / Heroku)

---

## 🔹 License

MIT License © 2026

---
