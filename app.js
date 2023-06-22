/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const handlerError = require('./middlewares/handlerError');
const { validationCreateUser, validationLoginUser } = require('./middlewares/validationJoiUser');

const NotFoundError = require('./errors/notFoundError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

app.post('/signin', validationLoginUser, login);
app.post('/signup', validationCreateUser, createUser);
app.use(userRouter);
app.use(cardRouter);
app.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errors());
app.use(handlerError);
app.listen(PORT, () => {
  console.log(`listen a ${PORT}`);
});
