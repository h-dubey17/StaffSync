const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

mongoose.connect('mongodb+srv://hrishika_17:StaffSync1234@cluster0.cuenhzf.mongodb.net/staffsync?retryWrites=true&w=majority', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
})
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});