const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use(usersRouter);
router.use(cardsRouter);

module.exports = router;
