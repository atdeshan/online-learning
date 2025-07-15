const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name, role,qualification, bio, adminCode} = req.body;
  
  // Basic validation
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashed, 
      name, 
      role, 
      qualification, 
      bio, 
      adminCode 
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // For debugging
    res.status(500).send('Server Error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, 'secretkey123f', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});





module.exports = router;
