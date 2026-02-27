const mongoose = require('mongoose');

const geoTagSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true, unique: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
}, { timestamps: true });

module.exports = mongoose.model('GeoTag', geoTagSchema);