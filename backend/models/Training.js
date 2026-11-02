const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  trainerName: { type: String, required: true },
  assignedTo: { type: String, default: 'All Employees' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Training', trainingSchema);