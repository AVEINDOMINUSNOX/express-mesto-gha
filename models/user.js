/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const IncorrectTokenError = require('../errors/incorrectTokenError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'длина имени должна быть не менее 2 символов'],
    maxlength: [30, 'длина имени должна быть не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'длина имени должна быть не менее 2 символов'],
    maxlength: [30, 'длина имени должна быть не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => validator.isURL(
        value,
        {
          protocols: ['http', 'https'],
          require_tld: true,
          require_protocol: true,
        },
      ),
      message: 'Некорректный URL',
    },
  },
  email: {
    unique: true,
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: 'Введите корректный емэил',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new IncorrectTokenError('Указан неправильный адрес почты или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new IncorrectTokenError('Указан неправильный адрес почты или пароль'));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
