import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  residentName: { type: String, required: true },
  residentAge: { type: Number, default: 30 }, 
  description: { type: String, required: true },
  status: { type: String, default: 'Open' },
  category: { type: String, default: 'Pending AI' },
  priority: { type: String, default: 'Medium' },
  assignedTo: { type: String, default: 'Pending AI' },
  image: { type: String, default: '' },
  location: { type: String, default: 'Not tagged' },
  rating: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', TicketSchema);