const express = require('express');
const { verifyToken, isStudentOrInstructor } = require('../middlewares/authMiddleware');
const LiveClass = require('../models/LiveClass');

const router = express.Router();

// Create a new live class (only accessible by instructors)
router.post('/', verifyToken, isStudentOrInstructor, async (req, res) => {
  try {
    const { title, instructor, startTime, endTime } = req.body;

    if (!title || !instructor || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new live class
    const liveClass = new LiveClass({
      title,
      instructor,
      startTime,
      endTime,
      classId: `class-${Date.now()}`,  // Generate a unique class ID
    });

    await liveClass.save();
    res.status(201).json(liveClass);
  } catch (error) {
    console.error('Error creating live class:', error);
    res.status(500).json({ error: 'Failed to create live class' });
  }
});

// Join class (accessible by both students and instructors)
router.post('/:classId/join', verifyToken, isStudentOrInstructor, async (req, res) => {
  try {
    const { classId } = req.params;

    const liveClass = await LiveClass.findOne({ classId });

    if (!liveClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Ensure the user is not already a participant
    if (liveClass.participants.includes(req.user.userId)) {
      return res.status(400).json({ error: 'You have already joined this class' });
    }

    // Add the user to the class participants
    liveClass.participants.push(req.user.userId);  // Assuming req.user.userId contains the user's ID
    await liveClass.save();

    res.status(200).json(liveClass);
  } catch (error) {
    console.error('Error joining live class:', error);
    res.status(500).json({ error: 'Failed to join class' });
  }
});

module.exports = router;
