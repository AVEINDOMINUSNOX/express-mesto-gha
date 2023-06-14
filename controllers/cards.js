/* eslint-disable indent */
/* eslint-disable no-console */
const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      res.status(ERROR_CODE_DEFAULT).send({
        message: `Произошла ошибка: ${err.message}`,
        stack: err.stack,
      }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    /* .orFail(new Error('NotFound')) */
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Переданы некорректные данные при создании карточки, произошла ошибка: ${err.message}`,
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

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send('Карточка с указанным _id не найдена');
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: `Карточка ${req.params.cardId} удалена` }))
        .catch((err) => {
          res.status(ERROR_CODE_DEFAULT).send({
            message: `Ошибка ${err.message}`,
            stack: err.stack,
          });
        });
    })
    .catch((err) => {
      res.status(ERROR_CODE_DEFAULT).send({
        message: `Ошибка ${err.message}`,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send('Карточка с указанным _id не найдена');
        return;
      }
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
        .then((newCard) => res.send(newCard))
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(ERROR_CODE_INCORRECT_DATA).send({
              message: `Переданы некорректные данные для постановки/снятии лайка, произошла ошибка: ${err.message}`,
              stack: err.stack,
            });
            return;
          }
          res.send({ message: `Произошла ошибка ${err.message}` });
        });
    })
    .catch((err) => {
      res.status(ERROR_CODE_DEFAULT).send({ message: `Ошибка ${err.message}` });
    });
};

const dislikeCard = (req, res) => {
  Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(ERROR_CODE_DATA_NOT_FOUND).send('Карточка с указанным _id не найдена');
      return;
    }
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для постановки/снятии лайка, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.send({ message: `Произошла ошибка ${err.message}` });
    });
})
.catch((err) => {
  res.status(ERROR_CODE_DEFAULT).send({ message: `Ошибка ${err.message}` });
});
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
