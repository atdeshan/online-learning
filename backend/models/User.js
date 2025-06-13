const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  qualification: {
    type: String,
    required: function () {
      return this.role === 'Teachers';  // Only required for Teachers
    }
  },
  bio: {
    type: String,
    required: function () {
      return this.role === 'Teachers';  // Only required for Teachers
    }
  },
  adminCode: {
    type: String,
    required: function () {
      return this.role === 'Admin';  // Only required for Admins
    }
  },
  coueces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  role: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
