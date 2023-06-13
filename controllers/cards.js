const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(500).send({
        message: `Ошибка: ${err.message}`,
        stack: err.stack,
      }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  console.log(req.user._id);
  Card.create({ name, link })
    .then((cards) => res.send(cards))
    .catch((err) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(500).send({
        message: `Ошибка: ${err.message}`,
        stack: err.stack,
      }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ message: `Карточка ${card} удалена` }))
    .catch((err) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      res.send({
        message: `Ошибка ${err.message}`,
        stack: err.stack,
      }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.send({
      message: `Ошибка ${err.message}`,
      stack: err.stack,
    }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.send({
      message: `Ошибка ${err.message}`,
      stack: err.stack,
    }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
