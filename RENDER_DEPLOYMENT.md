# 🔗 Frontend-Backend Connection Guide & Render Deployment

This document explains how the frontend and backend communicate and how to deploy them separately on Render.

## 📡 Communication Architecture

### **How Frontend & Backend Connect**

The application uses **two channels of communication**:

#### 1. **HTTP Requests (REST API) - Axios**
```
Frontend (React)
    ↓
  Axios HTTP Requests
    ↓
Backend Express Server
    ↓
MongoDB
```

**Used for:**
- Creating tickets: `POST /api/tickets`
- Fetching tickets: `GET /api/tickets`
- Updating status: `PUT /api/tickets/:id/status`
- Submitting feedback: `PUT /api/tickets/:id/feedback`

**Example:**
```javascript
// Frontend: client/src/pages/ResidentDashboard.jsx
const res = await axios.post('http://localhost:3000/api/tickets', { 
  residentName: user.name, 
  residentAge: Number(age), 
  description: desc, 
  image: media, 
  location: locationCoords 
});
```

#### 2. **WebSocket Connection (Socket.io) - Real-Time Updates**
```
Frontend (React)
    ↓
  Socket.io WebSocket
    ↓
Backend Socket.io Server
    ↓
All Connected Clients (Real-time Broadcast)
```

**Used for:**
- Real-time ticket creation notifications
- Live ticket status updates
- Instant dashboard synchronization

**Example:**
```javascript
// Backend: backend/server.js
io.emit('new_ticket', newTicket);  // Broadcast to all clients
socket.on('new_ticket', t => setTickets(prev => [t, ...prev]));  // Frontend receives
```

---

## 🏗️ Current Local Connection Setup

### **Frontend Configuration (Local)**
```javascript
// client/src/pages/ResidentDashboard.jsx
const res = await axios.get(`http://localhost:3000/api/tickets?residentName=${user.name}`);

// client/src/pages/AdminDashboard.jsx
const socket = io('http://localhost:3000');
socket.on('new_ticket', t => setTickets(prev => [t, ...prev]));
```

### **Backend Configuration (Local)**
```javascript
// backend/server.js
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
server.listen(3000, () => console.log('🚀 AI Backend Live: Port 3000'));
```

---

## 🚀 Deploying Separately on Render

### **Deployment Architecture**
```
GitHub Repository (Your Code)
    ├── Frontend Branch
    │   └── Deployed to Render
    │       └── https://your-frontend.onrender.com
    │
    └── Backend Branch
        └── Deployed to Render
            └── https://your-backend.onrender.com
```

---

## 📋 Step 1: Prepare Backend for Render

### **1.1 Update Backend Files**

#### Create `backend/.env.render`
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/society-tracker
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.onrender.com
```

#### Update `backend/server.js` - Enable Dynamic CORS
```javascript
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Ticket from './models/Ticket.js';

dotenv.config();
const app = express();

// ✅ UPDATED: Dynamic CORS based on environment
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);

// ✅ UPDATED: Socket.io with production CORS
const io = new Server(server, { 
  cors: { 
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ DB Connected!'));

// ... rest of your code
```

#### Update `backend/package.json` - Add Render Start Script
```json
{
  "name": "society-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "express": "^4.22.1",
    "mongoose": "^8.23.0",
    "socket.io": "^4.8.3"
  }
}
```

---

## 📋 Step 2: Prepare Frontend for Render

### **2.1 Create Environment Variables**

#### Create `client/.env.production`
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
```

#### Create `client/.env.development`
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### **2.2 Update Frontend Code to Use Environment Variables**

#### Update `client/src/pages/ResidentDashboard.jsx`
```javascript
// Old code:
const res = await axios.get(`http://localhost:3000/api/tickets?residentName=${user.name}`);

// New code:
const API_URL = import.meta.env.VITE_API_URL;
const res = await axios.get(`${API_URL}/api/tickets?residentName=${user.name}`);
```

#### Update `client/src/pages/AdminDashboard.jsx`
```javascript
// Old code:
const socket = io('http://localhost:3000');

// New code:
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL);
```

#### Update `client/src/pages/TechnicianDashboard.jsx`
```javascript
// Old code:
const socket = io('http://localhost:3000');

// New code:
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL);
```

#### Create `client/src/api/config.js` (Centralized API Config)
```javascript
// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Example usage in components:
// import { API_BASE_URL, SOCKET_URL } from '../api/config';
// const res = await axios.get(`${API_BASE_URL}/api/tickets`);
// const socket = io(SOCKET_URL);
```

### **2.3 Update `client/package.json` - Add Build Script**
```json
{
  "name": "client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.6",
    "framer-motion": "^12.34.3",
    "lucide-react": "^0.575.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.13.1",
    "socket.io-client": "^4.8.3",
    "vite": "^7.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.0"
  }
}
```

---

## 🎯 Step 3: Deploy Backend to Render

### **3.1 Push Backend to GitHub**
```bash
cd backend

git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### **3.2 Create Render Web Service (Backend)**

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New+" → "Web Service"**
4. **Connect GitHub Repository**
   - Select your `society-issue-tracker` repo
   - Choose GitHub account to connect
5. **Configure Service**
   - Service Name: `society-issue-tracker-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Region: Select closest to users (e.g., Singapore, Frankfurt)

6. **Set Environment Variables**
   - Click "Environment" in left menu
   - Add variables:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/society-tracker
     CORS_ORIGIN=https://your-frontend.onrender.com
     NODE_ENV=production
     ```

7. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - You'll get URL: `https://society-issue-tracker-backend.onrender.com`

### **3.3 Verify Backend is Running**
```bash
curl https://society-issue-tracker-backend.onrender.com/health

# Should return:
# {"status":"OK","timestamp":"2025-02-28T..."}
```

---

## 🎨 Step 4: Deploy Frontend to Render

### **4.1 Push Frontend to GitHub**
```bash
cd client

git add .
git commit -m "Configure frontend for Render deployment"
git push origin main
```

### **4.2 Create Render Static Site (Frontend)**

1. **Go to [render.com](https://render.com)**
2. **Click "New+" → "Static Site"**
3. **Connect GitHub Repository**
   - Select your `society-issue-tracker` repo
4. **Configure Service**
   - Service Name: `society-issue-tracker-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`
   - Root Directory: `.` (leave as is)

5. **Set Environment Variables**
   - Add in "Environment" section:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     VITE_SOCKET_URL=https://your-backend-url.onrender.com
     ```

6. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)
   - You'll get URL: `https://society-issue-tracker-frontend.onrender.com`

---

## ✅ Step 5: Verify Both Services

### **Testing Communication**

1. **Open Frontend**
   ```
   https://society-issue-tracker-frontend.onrender.com
   ```

2. **Open DevTools (F12)**
   - Check Console for errors
   - Go to Network tab
   - Look for API requests to your backend URL
   - Check WebSocket connection

3. **Test Functionality**
   - Login with test credentials
   - Create a new ticket
   - Verify real-time updates on Admin dashboard

### **Check Backend Logs**
```bash
# On Render dashboard
Backend Service → Logs tab
# Look for:
# ✅ DB Connected!
# 🚀 AI Backend Live: Port 3000
# No CORS errors
```

---

## 🔄 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User's Browser                             │
│         https://your-frontend.onrender.com                    │
│                  (React Application)                          │
└───────────────────┬──────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼ (HTTP REST)           ▼ (WebSocket)
        │                       │
┌───────────────────────────────────────────────────────────────┐
│              https://your-backend.onrender.com                │
│          (Express.js + Socket.io Server)                      │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼ (Mongoose)
        ┌───────────────────────┐
        │   MongoDB Atlas       │
        │  (Cloud Database)     │
        └───────────────────────┘
```

---

## 🆘 Troubleshooting Common Issues

### **Issue 1: CORS Error**
```
Cross-Origin Request Blocked
```

**Solution:**
1. Update `CORS_ORIGIN` in backend `.env`:
   ```env
   CORS_ORIGIN=https://your-frontend.onrender.com
   ```
2. Update backend CORS configuration in `server.js`
3. Redeploy backend

### **Issue 2: Socket.io Connection Failed**
```
WebSocket connection failed
```

**Solution:**
1. Verify `VITE_SOCKET_URL` in frontend `.env.production`:
   ```env
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```
2. Ensure backend Socket.io is configured correctly
3. Check browser DevTools Console for exact error

### **Issue 3: API Requests Timing Out**
```
Network Error: Request Timeout
```

**Solution:**
1. Check if backend service is running
2. Verify MongoDB connection:
   ```bash
   # In Render backend logs
   ✅ DB Connected!
   ```
3. Increase timeout in axios calls:
   ```javascript
   axios.defaults.timeout = 10000; // 10 seconds
   ```

### **Issue 4: Environment Variables Not Working**
**Solution:**
1. In frontend: Use `import.meta.env.VITE_*` (not `process.env`)
2. Verify variables are set in Render dashboard
3. Rebuild and redeploy

---

## 📝 Quick Deployment Checklist

### **Before Deploying Frontend**
- [ ] Environment variables set in `client/.env.production`
- [ ] API URLs updated in component files
- [ ] `npm run build` works locally
- [ ] No hardcoded localhost URLs
- [ ] Socket.io connection updated

### **Before Deploying Backend**
- [ ] Environment variables in `backend/.env`
- [ ] CORS origin updated
- [ ] `npm start` works locally
- [ ] MongoDB connection string valid
- [ ] Health check endpoint works

### **After Deployment**
- [ ] Test login functionality
- [ ] Create a test ticket
- [ ] Verify real-time updates
- [ ] Check browser console for errors
- [ ] Monitor backend logs for errors

---

## 🔄 Continuous Deployment on Render

### **Automatic Redeploy on Push**

Render automatically redeploys when you push to main branch:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Render automatically detects push and redeploys
# Check Render Dashboard → Events for deployment status
```

---

## 💡 Environment Variables Reference

### **Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
```

### **Backend (Render Environment)**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/society-tracker
CORS_ORIGIN=https://your-frontend.onrender.com
NODE_ENV=production
PORT=3000
```

---

## 📊 Render Service Comparison

| Type | Cost | Best For | Auto Deploy |
|------|------|----------|------------|
| **Web Service** | $7/mo+ | Backend (Express) | ✅ Yes |
| **Static Site** | Free | Frontend (React) | ✅ Yes |
| **PostgreSQL** | $7/mo+ | Database | ✅ Backups |
| **Redis** | $7/mo+ | Caching | ✅ Yes |

**Your Setup:**
- Frontend: Static Site (Free)
- Backend: Web Service ($7/mo)
- Database: MongoDB Atlas (Free tier available)

---

## 🎯 Expected URLs After Deployment

```
Frontend URL: https://society-issue-tracker-frontend.onrender.com
Backend API:  https://society-issue-tracker-backend.onrender.com
```

Update these URLs in:
- Frontend environment variables
- Frontend component API calls
- Any documentation

---

## 📞 Support & Resources

- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Socket.io CORS Configuration](https://socket.io/docs/v4/handling-cors/)
- [Express CORS Guide](https://expressjs.com/en/resources/middleware/cors.html)

---

**Last Updated:** February 28, 2026
**Status:** Ready for Render Deployment ✅
