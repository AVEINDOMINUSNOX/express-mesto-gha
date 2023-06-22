const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'длина названия должна быть не менее 2 символов'],
    maxlength: [30, 'длина названия должна быть не более 30 символов'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(
        value,
        {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_tld: true,
        },
      ),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
