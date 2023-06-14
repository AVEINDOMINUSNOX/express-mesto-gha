const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_CODE_DEFAULT).send({
      message: `Произошла ошибка: ${err.message}`,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные при создании карточки, произошла ошибка: ${err.message}`,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: `Карточка ${req.params.cardId} удалена` }))
        .catch((err) => {
          res.status(ERROR_CODE_DEFAULT).send({
            message: `Ошибка ${err.message}`,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для удаления карточки, произошла ошибка: ${err.message}`,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Ошибка ${err.message}` });
    });
};

const likeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      // eslint-disable-next-line max-len
      Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
        .then((newCard) => res.send(newCard))
        .catch((err) => {
          res.status(ERROR_CODE_DEFAULT).send({
            message: `Произошла ошибка ${err.message}`,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для постановки/снятии лайка, произошла ошибка: ${err.message}`,
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Ошибка ${err.message}` });
    });
};
const dislikeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
        .then((newCard) => res.send(newCard))
        .catch((err) => {
          res.status(ERROR_CODE_DEFAULT).send({
            message: `Произошла ошибка ${err.message}`,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: `Переданы некорректные данные для постановки/снятии лайка, произошла ошибка: ${err.message}`,
        });
        return;
      }
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
