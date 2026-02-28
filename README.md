# 🏢 Society Issue Tracker

A comprehensive **real-time issue tracking and management system** for residential societies with AI-powered priority assignment, role-based dashboards, and instant notifications.

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://www.mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-red?logo=socket.io)](https://socket.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [AI Priority Engine](#-ai-priority-engine)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Dashboard**
  - 👥 **Resident**: Report issues, track tickets, provide feedback
  - 🔧 **Technician**: View assigned jobs, mark as resolved, access location
  - 📊 **Admin**: Monitor all tickets, view feedback, manage assignments

- **AI-Powered Priority System**
  - Automatic issue categorization (Plumbing, Electrical, Lift Maintenance, General)
  - Intelligent priority assignment based on issue type and resident age
  - Smart technician allocation

- **Real-Time Features**
  - Live ticket updates via WebSocket (Socket.io)
  - Instant notifications for new tickets
  - Real-time dashboard synchronization

- **Geolocation & Media**
  - GPS tagging for issue locations
  - Photo evidence upload with compression
  - Google Maps integration for technicians

- **Feedback System**
  - 5-star rating system
  - Resident feedback on completed repairs
  - Admin review of service quality

- **Responsive Design**
  - Mobile-first approach
  - Works seamlessly on phones, tablets, and desktops
  - Touch-friendly interface

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2 | UI library |
| **React Router** | 7.13 | Client-side routing |
| **Framer Motion** | 12.34 | Animations & transitions |
| **Lucide React** | 0.575 | Icon library |
| **Axios** | 1.13 | HTTP client |
| **Socket.io Client** | 4.8 | Real-time communication |
| **Vite** | 7.3 | Build tool |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | Runtime |
| **Express** | 4.22 | Web framework |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.23 | ODM |
| **Socket.io** | 4.8 | Real-time server |
| **CORS** | 2.8 | Cross-origin requests |
| **dotenv** | 16.6 | Environment variables |

---

## 🏗 Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                        │
│  ┌──────────────┬──────────────┬──────────────────┐    │
│  │  Resident    │  Technician  │  Admin Dashboard │    │
│  └──────────────┴──────────────┴──────────────────┘    │
│              ↓ Socket.io | Axios ↓                     │
├─────────────────────────────────────────────────────────┤
│                  Backend (Express)                       │
│  ┌──────────────────────────────────────────────┐      │
│  │   REST API + WebSocket Server (Socket.io)    │      │
│  │   • Issue Management                         │      │
│  │   • AI Priority Engine                       │      │
│  │   • Real-time Notifications                  │      │
│  └──────────────────────────────────────────────┘      │
│              ↓ Mongoose ODM ↓                          │
├─────────────────────────────────────────────────────────┤
│                  Database (MongoDB)                      │
│  ┌──────────────────────────────────────────────┐      │
│  │   • Tickets Collection                       │      │
│  │   • Users Collection                         │      │
│  │   • GeoTags Collection                       │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before installation, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or MongoDB Atlas cloud instance)
- **Git** for version control

### Check Installation
```bash
node --version    # Should be v16+
npm --version     # Should be v7+
```

---

## 🚀 Installation

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/society-issue-tracker.git
cd society-issue-tracker
```

### 2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Setup)
echo "MONGO_URI=your_mongodb_uri" > .env

# Start the server
npm start
# Server runs on http://localhost:3000
```

### 3. **Frontend Setup**
```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

---

## ⚙ Environment Setup

### Backend `.env` File
Create `backend/.env` with:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/society-tracker

# Port Configuration
PORT=3000

# Environment
NODE_ENV=development
```

### MongoDB Atlas Connection
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
4. Add to `.env` file

### Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/society-tracker
```

---

## 💻 Usage

### Running the Application

#### **Terminal 1: Backend Server**
```bash
cd backend
npm start
```
Expected output:
```
✅ DB Connected!
🚀 AI Backend Live: Port 3000
```

#### **Terminal 2: Frontend Development Server**
```bash
cd client
npm run dev
```
Access the app at `http://localhost:5173`

### Building for Production

#### **Frontend Build**
```bash
cd client
npm run build
# Output in client/dist/
```

#### **Deploy**
- Frontend: Deploy `dist/` folder to Vercel, Netlify, or GitHub Pages
- Backend: Deploy to Heroku, Railway, or AWS

---

## 📡 API Endpoints

### **Tickets Management**

#### Get All Tickets
```http
GET /api/tickets
```
**Query Parameters:**
- `residentName` (optional): Filter by resident name

**Response:**
```json
[
  {
    "_id": "...",
    "residentName": "John Doe",
    "residentAge": 45,
    "description": "Water leak in kitchen",
    "status": "Open",
    "category": "Plumbing",
    "priority": "High",
    "assignedTo": "Rajan (Plumber)",
    "image": "base64...",
    "location": "12.9716,77.5946",
    "rating": 0,
    "feedback": "",
    "createdAt": "2025-02-28T10:30:00Z"
  }
]
```

#### Create New Ticket
```http
POST /api/tickets
Content-Type: application/json
```
**Request Body:**
```json
{
  "residentName": "John Doe",
  "residentAge": 45,
  "description": "Water leak in kitchen",
  "image": "base64_encoded_image",
  "location": "12.9716,77.5946"
}
```

#### Update Ticket Status
```http
PUT /api/tickets/:id/status
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "Resolved"
}
```

#### Submit Feedback
```http
PUT /api/tickets/:id/feedback
Content-Type: application/json
```
**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Great service! Thank you."
}
```

---

## 🧠 AI Priority Engine

The system uses **intelligent automation** to classify and prioritize issues:

### **Category Detection**
| Keyword | Category | Priority | Assigned To |
|---------|----------|----------|-------------|
| leak, water, pipe | Plumbing | High | Rajan (Plumber) |
| light, power, bulb | Electrical | Low | Vikram (Electrician) |
| lift, elevator | Lift Maintenance | High | Suresh (Lift Technician) |
| Others | General | Medium | General Maintenance |

### **Priority Escalation**
- **Elderly Residents** (Age ≥ 65): Priority bumped to **"Critical (Elderly)"**
- Ensures urgent attention for senior citizens

### Example Flow
```
1. Resident reports: "Water leak in bathroom"
   ↓
2. AI detects: "water" keyword
   ↓
3. Category: Plumbing
4. Priority: High
5. Assigned to: Rajan (Plumber)
```

---

## 📂 Project Structure

```
society-issue-tracker/
│
├── backend/
│   ├── models/
│   │   ├── Ticket.js          # Ticket schema
│   │   ├── User.js            # User schema
│   │   ├── GeoTag.js          # Location data
│   │   └── Technician.js      # Technician info
│   │
│   ├── server.js              # Express & Socket.io setup
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.jsx  # Photo upload with compression
│   │   │   └── Geolocation.jsx    # GPS tagging
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Authentication
│   │   │   ├── ResidentDashboard.jsx  # Resident interface
│   │   │   ├── AdminDashboard.jsx     # Admin panel
│   │   │   └── TechnicianDashboard.jsx # Technician dispatch
│   │   │
│   │   ├── api/
│   │   │   └── auth.js           # API calls
│   │   │
│   │   ├── App.jsx              # Main component & routing
│   │   ├── main.jsx             # Entry point
│   │   ├── theme.js             # UI theme & styling
│   │   └── responsive.js        # Responsive design utilities
│   │
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
│
├── README.md                    # This file
├── .gitignore                   # Git ignore rules
└── LICENSE                      # MIT License
```

---

## 🎨 Design Features

### **Theme**
- Modern dark theme with gradient accents
- Blue-Cyan gradient for primary actions
- Glassmorphism effects
- Smooth animations with Framer Motion

### **Responsive Breakpoints**
```css
Mobile:  ≤ 640px   (phones)
Tablet:  ≤ 1024px  (tablets)
Desktop: > 1024px  (computers)
```

### **UI Components**
- Animated cards with motion effects
- Real-time status indicators
- Priority badges with color coding
- Interactive forms with validation

---

## 🔐 Security Notes

- **CORS enabled** for cross-origin requests
- **Base64 image encoding** for secure file handling
- **MongoDB connection** via environment variables
- **No sensitive data** in frontend code

**To implement:**
- Add JWT authentication
- Validate all inputs on backend
- Implement rate limiting
- Add HTTPS in production

---

## 📊 Real-Time Features Demo

### **Live Updates Example**
```javascript
// Resident creates ticket
socket.emit('new_ticket', ticketData)
  ↓
// Admin & Technician receive instant update
io.emit('new_ticket', ticketData)
  ↓
// Dashboards refresh automatically without page reload
```

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running locally OR
- Check MongoDB Atlas connection string in `.env`

### **CORS Error**
```
Access-Control-Allow-Origin error
```
**Solution:**
- Verify backend CORS configuration
- Ensure `http://localhost:5173` is allowed

### **Socket.io Connection Failed**
```
Socket not connected
```
**Solution:**
- Ensure backend server is running on port 3000
- Check browser console for detailed errors

### **Port Already in Use**
```bash
# Change backend port
PORT=3001 npm start

# Update frontend API calls
```

---

## 🚀 Future Enhancements

- [ ] JWT authentication & user registration
- [ ] Payment integration for premium features
- [ ] SMS/Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video call support for remote assessment
- [ ] Issue prediction using ML
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Export reports as PDF

---

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/society-issue-tracker.git
```

2. **Create feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make changes & commit**
```bash
git add .
git commit -m "Add amazing feature"
```

4. **Push to branch**
```bash
git push origin feature/amazing-feature
```

5. **Open Pull Request**

### **Code Guidelines**
- Use ES6+ syntax
- Follow React hooks best practices
- Add comments for complex logic
- Test before submitting PR
- Follow existing code style

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 👨‍💻 Author

**Society Issue Tracker** - Built with ❤️ for efficient residential management

---

## 📞 Support & Contact

- 📧 Email: support@societytracker.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/society-issue-tracker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/society-issue-tracker/discussions)

---

## 🎯 Quick Links

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Socket.io Guide](https://socket.io/docs)

---

**Last Updated:** February 28, 2026
**Status:** ✅ Active & Maintained

```
 ___________
< Happy Coding! >
 -----------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
