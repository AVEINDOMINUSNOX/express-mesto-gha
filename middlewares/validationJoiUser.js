const { celebrate, Joi } = require('celebrate');

const urlRegex = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserEdit = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationEditAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
});
const validationUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationCreateUser,
  validationLoginUser,
  validationUserEdit,
  validationEditAvatar,
  validationUserId,
};
