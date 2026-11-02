const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  checkIn: { type: String, required: true },
  checkOut: { type: String, default: 'Not Checked Out' },
  status: { type: String, default: 'Present' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);