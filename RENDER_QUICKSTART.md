# 🚀 Quick Start: Render Deployment Guide

A step-by-step guide to deploy your Society Issue Tracker on Render with separate frontend and backend services.

## 🎯 What You'll Get

```
Frontend: https://your-app-frontend.onrender.com
Backend:  https://your-app-backend.onrender.com
```

---

## ✅ Before You Start

1. Create account on [Render.com](https://render.com) (free)
2. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
3. Push code to GitHub
4. Have these URLs ready:
   - GitHub repository URL
   - MongoDB connection string

---

## 📋 Step 1: Deploy Backend Service

### **1.1 Get Your Backend URL (First)**

You need the backend URL to configure the frontend!

1. Go to [render.com](https://render.com)
2. Click **"New+"** → **"Web Service"**
3. Select your GitHub repository
4. Fill in:
   ```
   Service Name: society-tracker-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

5. Click **"Advanced"** and add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/society-tracker
   CORS_ORIGIN=https://LEAVE-BLANK-FOR-NOW (Update later)
   NODE_ENV=production
   ```

6. Click **"Create Web Service"**
7. **Wait 5-10 minutes for deployment**
8. Copy your backend URL like: `https://society-tracker-backend-xxxx.onrender.com`

### **1.2 Update Backend CORS**

1. Go back to your Render backend service
2. Click **"Environment"**
3. Update `CORS_ORIGIN` with your frontend URL (you'll deploy this next)
   ```
   CORS_ORIGIN=https://society-tracker-frontend-xxxx.onrender.com
   ```
4. Your service will auto-redeploy (5 minutes)

---

## 🎨 Step 2: Deploy Frontend Service

### **2.1 Update Frontend Environment**

Before deploying, update `client/.env.production`:

```env
VITE_API_URL=https://society-tracker-backend-xxxx.onrender.com
VITE_SOCKET_URL=https://society-tracker-backend-xxxx.onrender.com
```

(Replace with your actual backend URL from Step 1.1)

### **2.2 Deploy Frontend to Render**

1. Go to [render.com](https://render.com)
2. Click **"New+"** → **"Static Site"**
3. Select your GitHub repository
4. Fill in:
   ```
   Service Name: society-tracker-frontend
   Build Command: cd client && npm install && npm run build
   Publish Directory: client/dist
   ```

5. Click **"Create Static Site"**
6. **Wait 5-10 minutes for deployment**
7. Copy your frontend URL like: `https://society-tracker-frontend-xxxx.onrender.com`

### **2.3 Update Backend with Frontend URL**

1. Go back to Render backend service
2. Click **"Environment"**
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://society-tracker-frontend-xxxx.onrender.com
   ```
4. Wait for auto-redeploy (5 minutes)

---

## ✅ Step 3: Verify Deployment

### **Test Frontend**
```
Visit: https://society-tracker-frontend-xxxx.onrender.com
```

### **Check Browser Console**
1. Visit your frontend
2. Open DevTools (F12)
3. Check Console tab for errors
4. Look for API connection messages

### **Test API Connection**
```bash
# In your browser console, run:
fetch('https://your-backend-url.onrender.com/health')
  .then(r => r.json())
  .then(console.log)

# Should show: {status: "OK", timestamp: "..."}
```

### **Test Socket.io Connection**
1. Open Admin Dashboard
2. Open DevTools → Console
3. Look for Socket.io connection message
4. Create a ticket from Resident dashboard
5. Should see real-time update on Admin dashboard

---

## 🆘 Common Issues & Fixes

### **Issue: CORS errors in console**
```
Cross-Origin Request Blocked
```

**Fix:**
1. Check backend `CORS_ORIGIN` environment variable
2. Make sure it matches your frontend URL exactly
3. Wait 5 minutes for update, then refresh

### **Issue: Socket.io not connecting**
```
WebSocket connection failed
```

**Fix:**
1. Verify `VITE_SOCKET_URL` in `client/.env.production`
2. Should be same as `VITE_API_URL`
3. Must be HTTPS (not HTTP)
4. Check backend logs for errors

### **Issue: API returns 502 error**
```
<502 Bad Gateway>
```

**Fix:**
1. Check backend service logs
2. Verify MongoDB URI is correct
3. Check if MongoDB cluster allows connections from anywhere
4. In MongoDB Atlas → Network Access → Allow from anywhere (temporary)

### **Issue: Frontend build fails**
```
Build failed during deployment
```

**Fix:**
1. Check build logs in Render dashboard
2. Verify `client/.env.production` exists
3. Ensure all environment variables start with `VITE_`
4. Run locally: `npm run build` to debug

---

## 📊 Environment Variables Reference

### **Frontend (`client/.env.production`)**
```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### **Backend (Render Dashboard)**
```env
MONGO_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend-url.onrender.com
NODE_ENV=production
```

---

## 🔄 Updating Your Code

After deployment, when you push changes to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Fix issue"
git push origin main

# Render automatically redeploys within 1-2 minutes
# Check "Events" tab on Render service for deployment status
```

---

## 🎯 Full URLs Structure

```
Your Code (GitHub)
    ↓
Render Detects Push
    ↓
├─ Frontend Static Site
│  └─ Builds: npm run build
│  └─ Deploys dist/ folder
│  └─ URL: https://society-tracker-frontend-xxxx.onrender.com
│
└─ Backend Web Service
   └─ Runs: npm start  
   └─ Connects to MongoDB
   └─ URL: https://society-tracker-backend-xxxx.onrender.com
```

---

## 📝 Deployment Checklist

- [ ] Backend service created and running
- [ ] Backend health check working (`/health` endpoint)
- [ ] MongoDB connection verified
- [ ] Backend URL copied
- [ ] `client/.env.production` updated with backend URL
- [ ] Frontend service created and built
- [ ] Frontend URL copied
- [ ] Backend `CORS_ORIGIN` updated with frontend URL
- [ ] Both services redeployed
- [ ] Frontend loads without errors
- [ ] API requests work
- [ ] Socket.io connected
- [ ] Real-time updates working

---

## 💡 Pro Tips

### **Faster Redeploys**
- Render deploys on every GitHub push automatically
- Check "Events" tab to monitor deployment progress

### **Debugging**
- Backend logs: Render dashboard → Logs tab
- Frontend errors: Browser Console (F12)
- Network errors: Browser Network tab (F12)

### **Keep Services Awake**
- Free tier services spin down after 15 mins of inactivity
- To keep running 24/7, upgrade to paid tier ($7/month each)

### **Custom Domains**
- Add custom domain in Render dashboard
- Point DNS to Render
- Get free SSL/HTTPS certificate

---

## 📞 Troubleshooting Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Help](https://docs.mongodb.com/atlas/)
- [Check Backend Logs](https://render.com/docs/logs)
- [Check Build Logs](https://render.com/docs/build-logs)

---

## 🎉 Success!

Your app is now deployed! Share your URLs:

```
🌐 Frontend: https://your-frontend-url.onrender.com
🔌 Backend:  https://your-backend-url.onrender.com
```

---

**Last Updated:** February 28, 2026
**Status:** Ready for Production ✅
