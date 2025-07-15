const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const router = express.Router();

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
router.get('/selected-courses', async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId).populate('courses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const selectedCourses = user.courses;
    res.json(selectedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
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
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Validate inputs
    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing userId or courseId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate entries
    const isAlreadyInCart = user.cart.includes(courseId);
    if (isAlreadyInCart) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    // Add to cart
    user.cart.push(courseId);
    await user.save();

    res.json({ message: "Course added to cart successfully" });
  } catch (err) {
    console.error("Error in /cart route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.get('/cart-details/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.cart);
  } catch (err) {
    console.error("Error in /cart route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.post('/remove-from-cart', async (req, res) => {
  try {
    console.log(req.body);
    const { userId, courseId } = req.body;
    

    // Validate inputs
    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing userId or courseId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from cart
    user.cart = user.cart.filter((course) => course.toString() !== courseId);
    await user.save();

    res.json({ message: "Course removed from cart successfully" });

  } catch (err) {
    console.error("Error in /cart route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post('/buy-course', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Remove from cart
    user.cart = user.cart.filter(c => c.toString() !== courseId);

    // Avoid duplicate enrollments
    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
    }
    // Avoid duplicate student entry
    if (!course.students.includes(userId)) {
      course.students.push(userId);
    }
   

    // Save both documents
    await user.save();
    await course.save();

    res.json({ message: 'Course bought successfully' });
  } catch (err) {
    console.error('Buy course error:', err);
    res.status(500).json({ message: 'Server Error' });
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
