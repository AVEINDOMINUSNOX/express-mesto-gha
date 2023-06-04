const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка!' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'Ошибка! Не удалось найти пользователя' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'Ошибка! Пользователь не создан' }));
};
