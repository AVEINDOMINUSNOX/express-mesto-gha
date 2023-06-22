const userRouter = require('express').Router();
// eslint-disable-next-line object-curly-spacing
const auth = require('../middlewares/auth');
const {
  getUsers, getUser, editUser, editAvatar, getMeUser,
} = require('../controllers/users');
const { validationUserEdit, validationEditAvatar, validationUserId } = require('../middlewares/validationJoiUser');

userRouter.use(auth);
userRouter.get('/users', getUsers);
userRouter.get('/users/me', getMeUser);
userRouter.get('/users/:id', validationUserId, getUser);
userRouter.patch('/users/me', validationUserEdit, editUser);
userRouter.patch('/users/me/avatar', validationEditAvatar, editAvatar);

module.exports = userRouter;
