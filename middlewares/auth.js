/* eslint-disable consistent-return */
const { IncorrectTokenError } = require('../errors/incorrectTokenError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new IncorrectTokenError('Требуется авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'Ave-Dominus-Nox');
  } catch (err) {
    return next(new IncorrectTokenError('Требуется авторизация'));
  }

  req.user = payload;
  next();
};