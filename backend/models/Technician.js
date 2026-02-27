const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, enum: ['plumbing', 'electrical', 'carpentry', 'lift maintenance'], required: true },
  contactNumber: { type: String },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Technician', technicianSchema);