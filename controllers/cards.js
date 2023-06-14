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

  Card.create({ name, link })
    .orFail(new Error('NotFound'))
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
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
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.send({
      message: `Карточка ${card} удалена`,
    }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Карточка с указанным _id не найдена, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({
        message: `Ошибка ${err.message}`,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для установки/снятии лайка, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Передан несуществующий _id карточки, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.send({
        message: `Произошла ошибка ${err.message}`,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для постановки/снятии лайка, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      if (err.name === 'NotFound') {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: `Передан несуществующий _id карточки, произошла ошибка: ${err.message}`,
          stack: err.stack,
        });
        return;
      }
      res.send({
        message: `Произошла ошибка ${err.message}`,
        stack: err.stack,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
