const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({
      message: 'Произошла ошибка',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные при создании карточки, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
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
        .catch(() => {
          res.status(ERROR_CODE_DEFAULT).send({
            message: 'Ошибка',
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для удаления карточки, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((newCard) => {
      if (!newCard) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      res.send(newCard);
    })
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((newCard) => {
      if (!newCard) {
        res.status(ERROR_CODE_DATA_NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      res.send(newCard);
    })
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка, произошла ошибка',
        });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
