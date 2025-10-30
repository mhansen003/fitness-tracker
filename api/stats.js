const Activity = require('../models/Activity');
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let matchQuery = { userId: req.userId };

    if (startDate || endDate) {
      matchQuery.startTime = {};
      if (startDate) matchQuery.startTime.$gte = new Date(startDate);
      if (endDate) matchQuery.startTime.$lte = new Date(endDate);
    }

    // Aggregate stats by date
    const stats = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m',
              date: '$startTime'
            }
          },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          activityCount: { $sum: 1 },
          activities: {
            $push: {
              type: '$type',
              calories: '$caloriesBurned',
              duration: '$duration'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Also get activity breakdown by type
    const activityBreakdown = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      stats,
      activityBreakdown
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = handler;
