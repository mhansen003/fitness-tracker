const User = require('../models/User');
const { authMiddleware } = require('../utils/auth');
const connectDB = require('../config/database');

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  // Apply auth middleware
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  try {
    if (req.method === 'GET') {
      // Get profile
      const user = await User.findById(req.userId).select('-password -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });

    } else if (req.method === 'PUT') {
      // Update profile
      const { gender, age, height, weight } = req.body;

      // Validation
      if (age && (age < 1 || age > 120)) {
        return res.status(400).json({ message: 'Age must be between 1 and 120' });
      }
      if (height && (height < 50 || height > 300)) {
        return res.status(400).json({ message: 'Height must be between 50 and 300 cm' });
      }
      if (weight && (weight < 20 || weight > 500)) {
        return res.status(400).json({ message: 'Weight must be between 20 and 500 kg' });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update profile fields
      if (gender !== undefined) user.profile.gender = gender;
      if (age !== undefined) user.profile.age = age;
      if (height !== undefined) user.profile.height = height;
      if (weight !== undefined) user.profile.weight = weight;

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile
        }
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = handler;
