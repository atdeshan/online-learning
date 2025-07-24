const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const router = express.Router();

router.get('/:id/courses', async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'Teachers') return res.status(403).json({ message: 'Access denied' });

    const courses = await Course.find({ instructor: user._id });
    res.json(courses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/:id/courses', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'Teachers') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      instructor: user._id,
      thumbnail: "default.jpg" // TEMP value or handle file upload
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id/course_details', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/teacher/:teacherId',async (req,res) =>{
  try{
    const teacher = await User.findById(req.params.teacherId);
    if(!teacher){
      return res.status(404).json({message:"Teacher not found"});
    }
    res.json(teacher)
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server Error"});
  }
})

module.exports = router;