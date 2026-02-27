import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Ticket from './models/Ticket.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ DB Connected!'));

// --- AI PRIORITY ENGINE ---
const runAI = (t) => {
  let cat = "General", prio = "Medium", worker = "General Maintenance";
  const desc = t.description.toLowerCase();
  
  if (desc.includes("leak") || desc.includes("water") || desc.includes("pipe")) { 
    cat = "Plumbing"; worker = "Rajan (Plumber)"; prio = "High"; 
  }
  if (desc.includes("light") || desc.includes("power") || desc.includes("bulb")) { 
    cat = "Electrical"; worker = "Vikram (Electrician)"; prio = "Low"; 
  }
  // NEW: Lift classification
  if (desc.includes("lift") || desc.includes("elevator")) { 
    cat = "Lift Maintenance"; worker = "Suresh (Lift Technician)"; prio = "High"; 
  }
  
  if (t.residentAge >= 65) prio = "Critical (Elderly)";
  return { cat, prio, worker };
};

app.get('/api/tickets', async (req, res) => {
  const query = req.query.residentName ? { residentName: req.query.residentName } : {};
  res.json(await Ticket.find(query).sort({ createdAt: -1 }));
});

app.post('/api/tickets', async (req, res) => {
  const { residentName, residentAge, description, image, location } = req.body;
  const newTicket = new Ticket({ residentName, residentAge, description, image, location });
  const ai = runAI(newTicket);
  newTicket.category = ai.cat; newTicket.priority = ai.prio; newTicket.assignedTo = ai.worker;
  await newTicket.save();
  io.emit('new_ticket', newTicket);
  res.json(newTicket);
});

app.put('/api/tickets/:id/status', async (req, res) => {
  const t = await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  io.emit('ticket_updated', t);
  res.json(t);
});

app.put('/api/tickets/:id/feedback', async (req, res) => {
  const t = await Ticket.findByIdAndUpdate(req.params.id, { rating: req.body.rating, feedback: req.body.feedback }, { new: true });
  io.emit('ticket_updated', t);
  res.json(t);
});

server.listen(3000, () => console.log('🚀 AI Backend Live: Port 3000'));