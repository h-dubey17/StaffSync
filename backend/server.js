const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Initialize Express App
const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Import Models
const User = require('./models/User');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const Announcement = require('./models/Announcement');
const Training = require('./models/Training');

// 4. Connect to MongoDB Atlas 
// (Make sure to replace the string below with your actual MongoDB connection string)
mongoose.connect('YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// --- API ENDPOINTS ---

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Leave Routes
app.post('/api/leave/apply', async (req, res) => {
  try {
    const newLeave = new Leave(req.body);
    await newLeave.save();
    res.json({ message: 'Leave submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting leave' });
  }
});

app.get('/api/leave/all', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
});

app.put('/api/leave/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Leave.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Leave status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status' });
  }
});

// Attendance Routes
app.post('/api/attendance/checkin', async (req, res) => {
  try {
    const newRecord = new Attendance({
      userId: req.body.userId,
      userName: req.body.userName,
      checkIn: new Date().toLocaleTimeString()
    });
    await newRecord.save();
    res.json({ message: 'Marked Present / Checked In successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error marking attendance' });
  }
});

app.get('/api/attendance/all', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

// Announcement Routes
app.post('/api/announcements/create', async (req, res) => {
  try {
    const newNotice = new Announcement(req.body);
    await newNotice.save();
    res.json({ message: 'Announcement published successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
});

app.get('/api/announcements/all', async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

// Training Routes
app.post('/api/training/create', async (req, res) => {
  try {
    const newTraining = new Training(req.body);
    await newTraining.save();
    res.json({ message: 'Training module created!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating training' });
  }
});

app.get('/api/training/all', async (req, res) => {
  try {
    const modules = await Training.find().sort({ date: -1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trainings' });
  }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));