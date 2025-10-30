const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false
    },
    age: {
      type: Number,
      required: false,
      min: 1,
      max: 120
    },
    height: {
      type: Number, // in cm
      required: false,
      min: 50,
      max: 300
    },
    weight: {
      type: Number, // in kg
      required: false,
      min: 20,
      max: 500
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
