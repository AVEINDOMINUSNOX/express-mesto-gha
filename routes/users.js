const userRouter = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/user');

userRouter.post('/users', createUser);
userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);

module.exports = userRouter;
