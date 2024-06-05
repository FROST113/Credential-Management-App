const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res, next) => {
    const { username, password, role, ou, division } = req.body;
  
    try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = await User.create({ username, password: hashedPassword, role, ou, division });
  
      // Generate JWT
      const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
      });
  
      // Respond with the token
      res.status(201).json({ token, userId: newUser._id, username: newUser.username, role: newUser.role });
    } catch (error) {
      // Handle errors
      next(error);
    }
  };

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    // Respond with the token
    res.status(200).json({ token, userId: user._id, username: user.username, role: user.role });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

module.exports = { register, login };