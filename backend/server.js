const Attendance = require('./models/Attendance');
const Announcement = require('./models/Announcement');
const Training = require('./models/Training');

// Attendance API
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

// Announcements API
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

// Training API
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

// HR / Manager Leave Status Update Route
app.put('/api/leave/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Leave.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Leave status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status' });
  }
});