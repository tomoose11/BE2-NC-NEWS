const usersRouter = require('express').Router();
const { handle405 } = require('../errors/errors');
const { getUsers, getUserByUsername } = require('../controllers/usersController');

usersRouter.route('/').get(getUsers).all(handle405);

usersRouter.route('/:username').get(getUserByUsername).all(handle405);

module.exports = usersRouter;
