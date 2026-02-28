# 🔧 How the Project Works - Detailed Technical Guide

A comprehensive explanation of how the Society Issue Tracker works end-to-end, including data flow, architecture, and component interactions.

## 📚 Table of Contents
- [System Architecture](#system-architecture)
- [Data Flow](#data-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Real-Time Communication](#real-time-communication)
- [AI Priority Engine](#ai-priority-engine)
- [User Flows](#user-flows)
- [Database Schema](#database-schema)
- [Component Lifecycle](#component-lifecycle)

---

## 🏗️ System Architecture

### **High-Level Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        END USER                                  │
│          (Resident, Technician, or Admin)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
    ┌─────────────────────────────────────┐
    │     Frontend Application (React)     │
    │  ├─ Resident Dashboard              │
    │  ├─ Technician Dashboard            │
    │  └─ Admin Dashboard                 │
    └─────┬─────────────────────────┬─────┘
          │ (HTTP Axios)            │ (WebSocket Socket.io)
          │ REST API Calls          │ Real-time Events
    ┌─────┴─────────────────────────┴─────┐
    │   Backend Server (Express.js)        │
    │  ├─ REST API Routes                 │
    │  ├─ AI Priority Engine              │
    │  ├─ Socket.io Server                │
    │  └─ Business Logic                  │
    └─────┬──────────────────────────────┬┘
          │ (Mongoose ODM)              │ (Socket.io Events)
          │ CRUD Operations             │ Broadcast to Clients
    ┌─────┴──────────────────┬──────────┴─────┐
    │   MongoDB Database      │                 │
    │  ├─ Tickets            │  Connected     │
    │  ├─ Users              │  Clients       │
    │  └─ GeoTags            │ (Admin, Tech)  │
    └────────────────────────┴─────────────────┘
```

---

## 📊 Data Flow

### **Complete Ticket Lifecycle**

```
1. RESIDENT SUBMITS ISSUE
   ┌─────────────────────────────────────┐
   │ Fill Form:                          │
   │ - Age                              │
   │ - Description                      │
   │ - Photo                            │
   │ - Location (GPS)                   │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Frontend (ResidentDashboard)        │
   │ - Compress image                    │
   │ - Validate form                     │
   │ - Create FormData                   │
   └────────┬────────────────────────────┘
            │ POST /api/tickets
            │ (with image in Base64)
            ▼
2. BACKEND PROCESSES
   ┌─────────────────────────────────────┐
   │ Backend (server.js)                 │
   │ INPUT: {                            │
   │   residentName,                     │
   │   residentAge,                      │
   │   description,                      │
   │   image (base64),                   │
   │   location (lat,lng)                │
   │ }                                   │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ AI Priority Engine (runAI)          │
   │ - Extract keywords from description │
   │ - Categorize issue:                 │
   │   ✓ "leak/water/pipe" = Plumbing   │
   │   ✓ "light/bulb/power" = Electrical│
   │   ✓ "lift/elevator" = Lift Maint.  │
   │   ✓ else = General                  │
   │ - Set priority:                     │
   │   ✓ High/Low/Medium based on type  │
   │   ✓ Bump to Critical if age >= 65  │
   │ - Assign technician                 │
   └────────┬────────────────────────────┘
            │ OUTPUT: {
            │   category,
            │   priority,
            │   assignedTo
            │ }
            ▼
   ┌─────────────────────────────────────┐
   │ Save to MongoDB                     │
   │ db.tickets.insertOne({              │
   │   ...formData,                      │
   │   category,                         │
   │   priority,                         │
   │   assignedTo,                       │
   │   status: 'Open',                   │
   │   rating: 0,                        │
   │   createdAt: Date.now()             │
   │ })                                  │
   └────────┬────────────────────────────┘
            │
            ▼
3. REAL-TIME BROADCAST
   ┌─────────────────────────────────────┐
   │ io.emit('new_ticket', newTicket)    │
   │ Broadcast to all connected clients  │
   └────────┬────────────────────────────┘
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
 ADMIN   TECH   OTHER RESIDENTS
   │       │       │
   ▼       ▼       ▼
4. FRONTEND UPDATES (Real-time)
   ┌──────────────────────────────────────┐
   │ socket.on('new_ticket', t =>        │
   │   setTickets(prev => [t, ...prev])  │
   │ )                                    │
   │                                      │
   │ Dashboard re-renders automatically   │
   │ New ticket appears at top!          │
   └──────────────────────────────────────┘
            │
            ▼
5. TECHNICIAN UPDATES STATUS
   ┌──────────────────────────────────────┐
   │ Click "MARK AS RESOLVED"            │
   │ PUT /api/tickets/:id/status         │
   │ { status: "Resolved" }              │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │ Backend updates DB & broadcasts      │
   │ io.emit('ticket_updated', t)        │
   └────────┬─────────────────────────────┘
            │
            ▼
6. RESIDENT PROVIDES FEEDBACK
   ┌──────────────────────────────────────┐
   │ Ticket marked as Resolved            │
   │ Rating form appears                  │
   │ Resident rates (1-5 stars)          │
   │ Submits feedback                    │
   │ PUT /api/tickets/:id/feedback       │
   │ { rating, feedback }                │
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────────┐
   │ Backend saves and broadcasts update  │
   │ Admin sees feedback in dashboard     │
   │ io.emit('ticket_updated', t)        │
   └──────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture

### **Component Structure**

```
App.jsx (Main Router)
├─ Login.jsx
│  └─ Role selector (Resident/Technician/Admin)
│  └─ Email & Password form
│
├─ ResidentDashboard.jsx
│  ├─ Report Incident Section
│  │  ├─ Age input
│  │  ├─ Description textarea
│  │  ├─ ImageUploader.jsx (Child component)
│  │  ├─ Geolocation.jsx (Child component)
│  │  └─ Submit button
│  │
│  └─ Activity History Section
│     ├─ My Tickets List
│     ├─ Status Badge
│     ├─ Rating Form (if Resolved)
│     └─ Feedback Display (if rated)
│
├─ TechnicianDashboard.jsx
│  └─ Assigned Tickets List
│     ├─ Ticket Card
│     ├─ "Mark as Resolved" Button
│     ├─ Location Link (Google Maps)
│     └─ Image Display
│
└─ AdminDashboard.jsx
   └─ All Tickets List
      ├─ Ticket Card with Priority Border
      ├─ Assignee Info
      ├─ Image Display
      ├─ Status Badge
      ├─ Resident Feedback Display
      └─ Location Link (Google Maps)
```

### **State Management**

```javascript
// Global State (using React Context + useState)
App.jsx
├─ user: { name: '...' }
├─ role: 'resident' | 'technician' | 'admin'
└─ setUser, setRole (passed to children)

// Component Local State
ResidentDashboard
├─ age, setAge
├─ desc, setDesc
├─ media, setMedia (image base64)
├─ locationCoords, setLocationCoords
├─ status, setStatus (GPS status)
└─ myTickets, setMyTickets

AdminDashboard / TechnicianDashboard
└─ tickets, setTickets (updated via Socket.io)
```

### **Data Flow in Components**

```
User Input
    ↓
[Form Elements]
    ↓
onChange Event
    ↓
setState (Update component state)
    ↓
Button Click
    ↓
Form Submit Handler
    ↓
Axios.post() or axios.put()
    ↓
API Request to Backend
    ↓
[Waiting for Response]
    ↓
Response Received
    ↓
Update State (setMyTickets, setTickets, etc)
    ↓
Component Re-renders
    ↓
UI Updated
```

---

## ⚙️ Backend Architecture

### **API Routes & Handlers**

```javascript
// residentDashboard.jsx
POST /api/tickets
└─ Input: { residentName, residentAge, description, image, location }
└─ Process: Validate → Run AI → Save to DB → Broadcast via Socket.io
└─ Output: { _id, category, priority, assignedTo, ... }
└─ Socket: io.emit('new_ticket', newTicket)

GET /api/tickets?residentName=XYZ
└─ Input: Query parameter (optional resident name)
└─ Process: Find tickets in MongoDB (with optional filter)
└─ Output: Array of ticket objects
└─ Socket: None (pull-based, not push)

PUT /api/tickets/:id/status
└─ Input: { status: 'Resolved' | 'Open' }
└─ Process: Update ticket in DB
└─ Output: Updated ticket object
└─ Socket: io.emit('ticket_updated', updatedTicket)

PUT /api/tickets/:id/feedback
└─ Input: { rating: 1-5, feedback: 'text' }
└─ Process: Update ticket with rating & feedback
└─ Output: Updated ticket object
└─ Socket: io.emit('ticket_updated', updatedTicket)
```

### **Server.js Structure**

```javascript
// 1. SETUP
import express, mongoose, cors, socket.io, dotenv
dotenv.config() // Load environment variables
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: CORS_ORIGIN } })

// 2. MIDDLEWARE
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

// 3. DATABASE CONNECTION
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DB Connected!'))

// 4. AI ENGINE
const runAI = (ticket) => {
  // Analyze description
  // Return { category, priority, assignedTo }
}

// 5. API ROUTES
app.get('/api/tickets', async (req, res) => { ... })
app.post('/api/tickets', async (req, res) => {
  // Run AI on new ticket
  // io.emit('new_ticket') to broadcast
})
app.put('/api/tickets/:id/status', async (req, res) => {
  // io.emit('ticket_updated') to broadcast
})
app.put('/api/tickets/:id/feedback', async (req, res) => {
  // io.emit('ticket_updated') to broadcast
})

// 6. SOCKET.IO HANDLERS
io.on('connection', (socket) => {
  socket.on('disconnect', () => { ... })
})

// 7. START SERVER
server.listen(PORT, () => console.log('🚀 Backend Live'))
```

---

## 📡 Real-Time Communication

### **Socket.io Flow**

```
Frontend (Client 1 - Admin)
    │
    │ socket.io connection
    │ io('http://localhost:3000')
    ▼
Backend Socket.io Server
    ├─ Store socket connection
    ├─ Listen for events from Client 1
    │
    └─ When event occurs (e.g., POST /api/tickets)
       ├─ Process request
       ├─ Update database
       │
       └─ BROADCAST to all connected clients
          │
       ┌──┴──┬──────┬─────┐
       ▼     ▼      ▼     ▼
    Admin  Tech Resident Other

Frontend (All Clients)
    │
    │ socket.on('new_ticket', (ticket) => {
    │   setTickets([ticket, ...prevTickets])
    │ })
    ▼
Dashboard updates immediately
(without page refresh!)
```

### **Example: When Ticket is Created**

**Timeline:**

```
T0: Resident clicks "Broadcast Report"
T1: Frontend validates form (React)
T2: Axios makes POST /api/tickets request
T3: Backend receives request
T4: Backend runs AI engine
T5: Backend saves to MongoDB
T6: Backend broadcasts: io.emit('new_ticket', newTicket)
T7: All connected clients receive event
T8: Frontend updates state: setTickets(prev => [ticket, ...prev])
T9: React re-renders dashboard with new ticket
T10: User sees new ticket appear at top of list

Total time: ~100-500ms (depends on network)
```

---

## 🧠 AI Priority Engine

### **How It Works**

```javascript
const runAI = (ticket) => {
  let category = "General"
  let priority = "Medium"
  let assignedTo = "General Maintenance"
  
  const desc = ticket.description.toLowerCase()
  
  // KEYWORD MATCHING
  if (desc.includes("leak") || desc.includes("water") || desc.includes("pipe")) {
    category = "Plumbing"
    priority = "High"
    assignedTo = "Rajan (Plumber)"
  }
  
  if (desc.includes("light") || desc.includes("power") || desc.includes("bulb")) {
    category = "Electrical"
    priority = "Low"
    assignedTo = "Vikram (Electrician)"
  }
  
  if (desc.includes("lift") || desc.includes("elevator")) {
    category = "Lift Maintenance"
    priority = "High"
    assignedTo = "Suresh (Lift Technician)"
  }
  
  // AGE ESCALATION
  if (ticket.residentAge >= 65) {
    priority = "Critical (Elderly)"
  }
  
  return { category, priority, assignedTo }
}
```

### **Example Outputs**

| Input | AI Logic | Output |
|-------|----------|--------|
| "Water leak in kitchen", Age 45 | Contains "water" & "leak" | Category: Plumbing, Priority: High, Assigned: Rajan |
| "Light bulb needs replacement", Age 65 | Contains "light" + Age >= 65 | Category: Electrical, Priority: Critical (Elderly), Assigned: Vikram |
| "Elevator not working", Age 70 | Contains "elevator" + Age >= 65 | Category: Lift Maintenance, Priority: Critical (Elderly), Assigned: Suresh |
| "Tap is dripping slowly", Age 30 | Generic water issue | Category: General or Plumbing (if "tap" recognized), Priority: Low-Medium |

---

## 👥 User Flows

### **Resident Flow**

```
1. LOGIN
   ├─ Select "Resident" role
   ├─ Enter email (uses as name)
   └─ Click "Sign In"

2. ACCESS RESIDENT DASHBOARD
   ├─ Display: "Resident Hub: [name]"
   ├─ Two columns:
   │  ├─ Left: Report Form
   │  └─ Right: Activity History

3. REPORT ISSUE
   ├─ Enter age
   ├─ Write description
   ├─ Take/upload photo
   ├─ Tag location (GPS)
   └─ Click "Broadcast Report"

4. API CALL
   ├─ POST /api/tickets with all data
   └─ System returns: { id, category, priority, assignedTo }

5. SEE REAL-TIME UPDATE
   ├─ Ticket appears in Activity History
   ├─ Shows status: "Open"
   └─ Displays: Category, Priority, Description

6. TRACK STATUS
   ├─ View activity history
   ├─ See status changes (real-time via Socket.io)
   └─ When status = "Resolved", rating form appears

7. PROVIDE FEEDBACK
   ├─ Select stars (1-5)
   ├─ Write feedback comment
   ├─ Click "Submit Feedback"
   └─ Feedback saved & sent to Admin

8. LOGOUT
   └─ Click "Logout" button
```

### **Technician Flow**

```
1. LOGIN
   ├─ Select "Technician" role
   ├─ Enter email
   └─ Click "Sign In"

2. ACCESS TECHNICIAN DASHBOARD
   ├─ Display all tickets assigned to this technician
   ├─ Tickets auto-assigned by AI based on category
   └─ Shows: Description, Photo, Priority, Status

3. VIEW ASSIGNED TICKET
   ├─ Card shows resident name & age
   ├─ Issue description
   ├─ Evidence photo
   ├─ Priority badge
   └─ Can click "OPEN MAP" to navigate

4. RESOLVE ISSUE
   ├─ Go to location
   ├─ Fix the problem
   ├─ Return to dashboard
   └─ Click "MARK AS RESOLVED"

5. API CALL
   ├─ PUT /api/tickets/:id/status
   ├─ Send: { status: "Resolved" }
   └─ All dashboards update real-time via Socket.io

6. RESIDECT GETS NOTIFIED
   ├─ Resident sees status change real-time
   ├─ Rating form appears
   └─ Resident provides feedback

7. LOGOUT
   └─ Click "Logout"
```

### **Admin Flow**

```
1. LOGIN
   ├─ Select "Admin" role
   ├─ Enter email
   └─ Click "Sign In"

2. ACCESS ADMIN DASHBOARD
   ├─ View ALL tickets (created)
   ├─ Real-time updates for all changes
   └─ Organized by creation time

3. MONITOR TICKETS
   ├─ See ticket details:
   │  ├─ Resident info
   │  ├─ Issue category (assigned by AI)
   │  ├─ Priority level
   │  ├─ Current status
   │  ├─ Assigned technician
   │  └─ Evidence photo
   │
   ├─ Click "OPEN MAP" to see location
   └─ Watch for new tickets in real-time

4. VIEW FEEDBACK
   ├─ When resident provides rating
   ├─ Feedback appears on card
   ├─ Shows: Star rating + Comment
   └─ Can assess technician performance

5. MANAGE SYSTEM
   ├─ Monitor ticket resolution rate
   ├─ Identify bottlenecks
   ├─ Track technician assignments
   └─ Ensure quality service

6. LOGOUT
   └─ Click "Logout"
```

---

## 🗄️ Database Schema

### **Ticket Collection**

```javascript
{
  _id: ObjectId,                    // Unique ID
  residentName: String,             // e.g., "john"
  residentAge: Number,              // e.g., 45
  description: String,              // e.g., "Water leak in kitchen"
  status: String,                   // "Open" | "Resolved"
  category: String,                 // "Plumbing" | "Electrical" | "Lift Maintenance" | "General"
  priority: String,                 // "Low" | "Medium" | "High" | "Critical (Elderly)"
  assignedTo: String,               // "Rajan (Plumber)"
  image: String,                    // Base64 encoded image
  location: String,                 // "12.9716,77.5946" (lat,lng)
  rating: Number,                   // 0 (not rated) | 1-5 (resident rating)
  feedback: String,                 // "Great service!"
  createdAt: Date,                  // Auto-generated
}
```

### **Example Documents**

```javascript
// Ticket 1: Plumbing Issue
{
  _id: ObjectId(...),
  residentName: "john",
  residentAge: 45,
  description: "Water leak in bathroom pipe",
  status: "Resolved",
  category: "Plumbing",
  priority: "High",
  assignedTo: "Rajan (Plumber)",
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  location: "12.9716,77.5946",
  rating: 5,
  feedback: "Excellent work! Fixed quickly.",
  createdAt: ISODate("2025-02-28T10:30:00Z")
}

// Ticket 2: Elderly Resident with Electrical Issue
{
  _id: ObjectId(...),
  residentName: "sarah",
  residentAge: 72,
  description: "Light in bedroom not working",
  status: "Open",
  category: "Electrical",
  priority: "Critical (Elderly)",
  assignedTo: "Vikram (Electrician)",
  image: "data:image/jpeg;base64/...",
  location: "12.9717,77.5947",
  rating: 0,
  feedback: "",
  createdAt: ISODate("2025-02-28T11:15:00Z")
}
```

---

## 🔄 Component Lifecycle

### **ResidentDashboard Lifecycle**

```
1. COMPONENT MOUNTS
   ├─ useState initializes:
   │  ├─ age, desc, media, etc. (form state)
   │  ├─ myTickets = [] (empty)
   │  └─ isMobile, isTablet (responsive)
   │
   └─ useEffect runs (runs once):
      ├─ Calls: fetchHistory() 
      └─ axios.get(/api/tickets?residentName=...)
         └─ Fetches tickets for this resident
         └─ setMyTickets(res.data)

2. COMPONENT RENDERS
   ├─ Display heading with resident name
   ├─ Show form inputs connected to state
   ├─ Display My Tickets list
   ├─ Handle responsive design (mobile/tablet/desktop)

3. USER INTERACTS
   ├─ Type in form fields
      └─ onChange → setState() → component re-renders
   │
   ├─ Click "Take Photo"
      └─ ImageUploader component
         └─ Compresses image
         └─ setMedia(base64)
   │
   ├─ Click "Tag Location"
      └─ Geolocation component
         └─ Gets GPS coords
         └─ setLocationCoords()
   │
   └─ Click "Broadcast Report"
      └─ submitReport() function
         └─ axios.post(/api/tickets, formData)
         └─ Backend processes, runs AI
         └─ Response: new ticket object
         └─ setMyTickets([newTicket, ...prevTickets])
         └─ "MyTickets" list updates immediately!

4. REAL-TIME UPDATES VIA SOCKET.IO
   ├─ When ticket status changes (technician resolves)
   ├─ Backend broadcasts: io.emit('ticket_updated', t)
   ├─ But this component does NOT listen to socket
   ├─ So status update only appears if component re-fetches
   │  (User doesn't see live update in ResidentDashboard)
   └─ But AdminDashboard DOES listen:
      └─ socket.on('ticket_updated')
         └─ Sees update immediately

5. USER PROVIDES FEEDBACK
   ├─ When resident's ticket is "Resolved"
   ├─ Rating form appears
   ├─ Resident rates and submits
   └─ axios.put(/api/tickets/:id/feedback)
      └─ Backend updates & broadcasts
      └─ AdminDashboard sees feedback real-time

6. COMPONENT UNMOUNTS
   ├─ User clicks Logout
   └─ useEffect cleanup runs (if any)
      └─ Close connections
```

---

## 🎯 Key Takeaways

### **Frontend → Backend Communication**

1. **REST API (Axios - Pull)**: Used for fetching and initial creation
   - GET /api/tickets - Fetch data on demand
   - POST /api/tickets - Create new ticket
   - PUT /api/tickets/:id - Update ticket

2. **WebSocket (Socket.io - Push)**: Used for real-time updates
   - new_ticket - Broadcast when new ticket created
   - ticket_updated - Broadcast when status changes
   - No polling needed - instant updates!

### **Data Flow Summary**

```
Resident Input
    ↓ (Frontend: React Form)
Component State (React)
    ↓ (Frontend: Axios POST)
REST API Request
    ↓ (Backend: Express)
Database Write (MongoDB)
    ↓ (Backend: Socket.io)
Real-time Broadcast to all connected clients
    ↓ (Frontend: Socket.on listener)
State Update (React)
    ↓ (Frontend: React Re-render)
UI Updates Instantly
```

### **Why This Architecture?**

✅ **REST API for reliability** - HTTP is more reliable than WebSocket
✅ **Socket.io for real-time** - Instant updates without polling
✅ **Separation of concerns** - Frontend/Backend/Database independent
✅ **Scalable** - Can deploy on separate servers
✅ **Responsive** - Users see instant updates with no delay
✅ **AI-powered** - Automatic categorization and assignment

---

**Last Updated:** February 28, 2026
**Status:** Complete Guide ✅
