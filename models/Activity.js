const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['sitting', 'standing', 'running', 'walking'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  // For running/walking activities
  distance: {
    type: Number, // in kilometers
    required: false
  },
  // Calculated calories
  caloriesBurned: {
    type: Number,
    required: true
  },
  // MET value used for calculation
  metValue: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date-based queries
activitySchema.index({ userId: 1, startTime: -1 });

module.exports = mongoose.model('Activity', activitySchema);
