const Activity = require('../models/Activity');
const User = require('../models/User');
const { authMiddleware } = require('../utils/auth');
const { calculateActivityCalories } = require('../utils/calorieCalculator');
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
      // Get activities with optional date filtering
      const { startDate, endDate } = req.query;

      let query = { userId: req.userId };

      if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = new Date(startDate);
        if (endDate) query.startTime.$lte = new Date(endDate);
      }

      const activities = await Activity.find(query).sort({ startTime: -1 });

      res.status(200).json({ activities });

    } else if (req.method === 'POST') {
      // Create new activity
      const { type, startTime, endTime, distance, notes } = req.body;

      // Validation
      if (!type || !startTime || !endTime) {
        return res.status(400).json({ message: 'Type, start time, and end time are required' });
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      // Calculate duration in minutes
      const durationMinutes = (end - start) / (1000 * 60);

      // Get user's weight for calorie calculation
      const user = await User.findById(req.userId);
      if (!user || !user.profile.weight) {
        return res.status(400).json({
          message: 'Please complete your profile with weight information before logging activities'
        });
      }

      // Calculate calories
      const { caloriesBurned, metValue } = calculateActivityCalories({
        activityType: type,
        weightKg: user.profile.weight,
        durationMinutes,
        distance: distance || null
      });

      // Create activity
      const activity = new Activity({
        userId: req.userId,
        type,
        startTime: start,
        endTime: end,
        duration: durationMinutes,
        distance: distance || undefined,
        caloriesBurned,
        metValue,
        notes: notes || undefined
      });

      await activity.save();

      res.status(201).json({
        message: 'Activity created successfully',
        activity
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = handler;
