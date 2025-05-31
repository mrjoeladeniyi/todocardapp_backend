const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);