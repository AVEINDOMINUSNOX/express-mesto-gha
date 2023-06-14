const User = require('../models/user');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(ERROR_CODE_DEFAULT).send({
      message: `Ошибка: ${err.message}`,
      stack: err.stack,
    }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Пользователь с указанным _id не найден, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Передан не верный id пользователя, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({
        message: `Ошибка: ${err.message}`,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные при создании пользователя, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({
        message: err.message,
        stack: err.stack,
      });
    });
};

const editUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Пользователь с указанным _id не найден, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные при обновлении профиля, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
};
