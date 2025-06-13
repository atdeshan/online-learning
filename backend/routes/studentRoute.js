const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const router = express.Router();

//in home page searching
router.get('/courses', async (req, res) => {
    try {
    const search = req.query.search || '';
    const query = search
      ? { title: { $regex: search, $options: 'i' } } // Case-insensitive search
      : {};

    const courses = await Course.find(query); // Assuming Course is your Mongoose model
    res.json(courses);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

//cource details page
router.get('/course/:id',async (req,res) =>{
  try{
    const course = await Course.findById(req.params.id);
    if(!course){
      return res.status(404).json({messsage:"couse not found"});
    }
    res.json(course);
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server Error"});
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
    res.status(500).json({message:"Server Erroe"});
  }
})


module.exports = router;
