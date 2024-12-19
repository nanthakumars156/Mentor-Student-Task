require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Mentor = require('./models/mentor');
const Student = require('./models/student');

// Initialize Express App
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/mentor', async (req, res) => {
  try {
    const { name, email } = req.body;
    const mentor = new Mentor({ name, email });
    await mentor.save();
    res.status(201).json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/student', async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = new Student({ name, email });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/assign-mentor', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    student.mentor = mentor._id;
    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/change-mentor', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or Mentor not found' });
    }

    student.mentor = mentor._id;
    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/mentor/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId }).populate('mentor');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/student/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('mentor');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({ mentor: null });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
