const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Type.ObjectId,
    require: true,
  },
  likes: {
    ref: 'likes',
    type: mongoose.Schema.Type.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
