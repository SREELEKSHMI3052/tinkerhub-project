# 🚀 Deployment Guide

Complete guide for deploying the Society Issue Tracker application to production environments.

## 📋 Table of Contents
- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
- [Post-deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-deployment Checklist

Before deploying to production:

### Code Quality
- [ ] All tests pass
- [ ] No console.logs in production code
- [ ] No hardcoded credentials
- [ ] Code reviewed by team member
- [ ] All dependencies are up to date

### Security
- [ ] Environment variables configured
- [ ] API authentication implemented
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on backend

### Performance
- [ ] Frontend optimized and minified
- [ ] Images compressed
- [ ] API endpoints optimized
- [ ] Database indexes created
- [ ] Caching strategy implemented

### Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] Deployment steps documented
- [ ] Rollback procedure documented

---

## 🎨 Frontend Deployment

### 1. Build Production Bundle
```bash
cd client
npm run build
```
Creates optimized build in `dist/` folder

### 2. Test Build Locally
```bash
npm install -g serve
serve -s dist

# Navigate to http://localhost:3000
```

### Deploy to Vercel (Recommended)
**Easiest option for React apps**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Follow prompts and confirm deployment
```

**Via GitHub:**
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Click Deploy
5. Configure environment variables in Vercel dashboard

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd client
netlify deploy --prod --dir=dist
```

**Or via GitHub:**
1. Push to GitHub
2. Connect repository on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Update package.json
{
  "homepage": "https://username.github.io/society-issue-tracker",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

### Environment Variables for Frontend
Create `.env.production` in `client/`:
```
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## ⚙️ Backend Deployment

### 1. Prepare Backend

```bash
cd backend

# Install dependencies
npm install

# Test locally
npm start

# Create start script in package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Deploy to Heroku

**Prerequisites:**
- Heroku account
- Heroku CLI installed

**Steps:**
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set PORT=3000
heroku config:set CORS_ORIGIN=https://your-frontend-url.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to Railway

**Simple cloud platform**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Set environment variables in dashboard
# View app at generated URL
```

### Deploy to AWS EC2

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/username/society-issue-tracker.git
cd society-issue-tracker/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add: MONGO_URI, CORS_ORIGIN, etc.

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name "society-tracker"
pm2 startup
pm2 save

# Install Nginx as reverse proxy
sudo amazon-linux-extras install nginx1 -y
sudo systemctl start nginx

# Configure Nginx
sudo nano /etc/nginx/nginx.conf
# Add upstream and proxy settings
```

### Deploy to DigitalOcean

```bash
# Create droplet (Ubuntu 20.04 LTS)
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo and install
git clone https://github.com/username/society-issue-tracker.git
cd society-issue-tracker/backend
npm install

# Install PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt install nginx -y
sudo systemctl start nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d your-domain.com
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)

1. **Create Account:**
   - Visit [mongodb.com](https://www.mongodb.com)
   - Sign up for free account

2. **Create Cluster:**
   - Click "Create a Deployment"
   - Choose Free tier
   - Select region closest to your users
   - Click "Create Cluster"

3. **Get Connection String:**
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with user password

4. **Add Environment Variable:**
   ```env
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/society-tracker
   ```

5. **Create Database User:**
   - Go to Database Access
   - Click "Add New Database User"
   - Set username and password
   - Click "Add User"

6. **Configure Network Access:**
   - Go to Network Access
   - Click "Add IP Address"
   - For development: Add current IP
   - For production: Add deployment server IP

### Local MongoDB (Self-hosted)

1. **Install MongoDB Server**

   **Ubuntu/Debian:**
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   apt update
   apt install -y mongodb-org
   systemctl start mongod
   ```

   **Windows:**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Run installer
   - MongoDB runs as Windows Service

2. **Set Connection String:**
   ```env
   MONGO_URI=mongodb://localhost:27017/society-tracker
   ```

---

## 🔐 Environment Variables

### Production `.env` Template

```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/society-tracker

# CORS
CORS_ORIGIN=https://your-frontend-url.com

# JWT (if implemented)
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRY=7d

# Email (if using mail service)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@societytracker.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=society-tracker-prod

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### Setting Variables on Platforms

**Heroku:**
```bash
heroku config:set MONGO_URI=mongodb://...
heroku config:set CORS_ORIGIN=https://your-site.com
```

**Vercel:**
- Go to Project Settings → Environment Variables
- Add variables for each stage (Preview, Production)

**Railway:**
- Go to Variables tab
- Add each variable

---

## 📦 Deployment Platforms Comparison

| Platform | Difficulty | Free Tier | Scalability | Best For |
|----------|-----------|-----------|------------|----------|
| **Vercel** | Easy | Yes | Excellent | Frontend (React) |
| **Netlify** | Easy | Yes | Good | Frontend (React) |
| **Heroku** | Medium | Limited | Good | Backend (Node.js) |
| **Railway** | Easy | Yes | Good | Full Stack |
| **DigitalOcean** | Hard | No ($5/mo) | Excellent | Full Stack |
| **AWS** | Very Hard | Limited | Excellent | Enterprise |

---

## 🔄 Deployment Workflow

### Recommended Setup

```
GitHub Repository
    ↓
    ├─→ Frontend Branch → Vercel (auto-deploy on push)
    ├─→ Backend Branch → Heroku/Railway (auto-deploy on push)
    └─→ Main Branch → Production Release
```

### GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: git push https://heroku.com/... main
```

---

## ✅ Post-deployment

### 1. Verify Deployment

```bash
# Test API endpoints
curl https://your-backend-url.com/api/tickets

# Test WebSocket connection
# Visit frontend and check network tab for Socket.io connection

# Check console for errors
# Visit site and open browser DevTools (F12)
```

### 2. Update DNS Records

**For custom domain:**
```
CNAME: www.yourdomain.com → vercel.com or netlify.com
A: yourdomain.com → IP address of backend
```

### 3. Setup SSL Certificate

**Automatically on Vercel/Netlify**

**Manual Setup (If needed):**
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com
# Install certificate on your server
```

### 4. Configure Monitoring

- **Sentry** for error tracking
- **New Relic** for performance monitoring
- **DataDog** for infrastructure monitoring

```env
SENTRY_DSN=https://your-key@sentry.io/project-id
```

---

## 📊 Monitoring & Maintenance

### Health Checks

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
```

### Monitor Logs

**Heroku:**
```bash
heroku logs --tail --app your-app-name
```

**Railway:**
- Dashboard → Logs tab

**DigitalOcean/AWS:**
```bash
# SSH into server
tail -f /var/log/app.log
```

### Regular Maintenance

- [ ] Keep dependencies updated: `npm update`
- [ ] Monitor database size
- [ ] Clean up old tickets (archive)
- [ ] Check error logs weekly
- [ ] Review performance metrics
- [ ] Update security patches

### Backup Strategy

**MongoDB Atlas:**
- Automatic backups enabled
- Manual backups available

**Self-hosted:**
```bash
# Backup command
mongodump --db society-tracker --out ./backup

# Restore command
mongorestore ./backup/society-tracker
```

---

## 🔧 Troubleshooting

### Frontend not loading
- Check browser console (F12)
- Verify API URL in environment variables
- Check CORS configuration on backend

### API errors
- Check backend logs
- Verify MongoDB connection
- Ensure environment variables are set

### Socket.io not connecting
- Check WebSocket is enabled on server
- Verify Socket.io URL is correct
- Check firewall/proxy settings

### Database connection fails
- Verify MongoDB URI format
- Check IP whitelisting (MongoDB Atlas)
- Ensure user has database access

---

## 📞 Support

- Check deployment platform documentation
- Review application logs
- Verify environment variables
- Test locally before deploying

---

**Last Updated:** February 28, 2026
**Version:** 1.0.0
