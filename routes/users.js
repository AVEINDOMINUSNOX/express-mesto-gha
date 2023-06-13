const userRouter = require('express').Router();
// eslint-disable-next-line object-curly-spacing
const {
  getUsers,
  getUser,
  createUser,
  editUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', editUser);
userRouter.patch('/users/me/avatar', editUser);

module.exports = userRouter;
