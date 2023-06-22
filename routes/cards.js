const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationCardId } = require('../middlewares/validationJoiCard');

cardRouter.use(auth);
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validationCreateCard, createCard);
cardRouter.delete('/cards/:cardId', validationCardId, deleteCard);
cardRouter.put('/cards/:cardId/likes', validationCardId, likeCard);
cardRouter.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardRouter;
