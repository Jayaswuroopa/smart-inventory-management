const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, name, email, role) => {
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email,
      password: hashed,
      role: role || 'staff'
    });
    const token = generateToken(user._id, user.name, user.email, user.role);
    res.status(201).json({ token, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: 'Invalid email or password' });

    const token = generateToken(user._id, user.name, user.email, user.role);
    res.json({ token, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;