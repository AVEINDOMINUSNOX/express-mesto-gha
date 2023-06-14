const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { ERROR_CODE_DATA_NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648827a1c8a64d9084edfa24',
  };

  next();
});

app.use(require('./routes/index'));

app.use('*', (req, res) => {
  res.status(ERROR_CODE_DATA_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listen a ${PORT}`);
});
