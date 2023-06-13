const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({
      message: 'Ошибка!',
      err: err.message,
      stack: err.stack,
    }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({
      message: 'Ошибка! Не удалось найти пользователя',
      err: err.message,
      stack: err.stack,
    }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({
      message: 'Ошибка! Пользователь не создан',
      err: err.message,
      stack: err.stack,
    }));
};

const editUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.send(`Произошла ошибка: ${err.message}`));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUser,
};
