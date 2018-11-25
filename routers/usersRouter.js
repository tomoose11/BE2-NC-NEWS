const usersRouter = require('express').Router();
const { handle405, handle400atRouter } = require('../errors/errors');
const { getUsers, getUserByUsername } = require('../controllers/usersController');

usersRouter.route('/').get(getUsers).all(handle405);

usersRouter.param('user_id', (req, res, next) => {
  handle400atRouter(req.params.user_id, next);
});

usersRouter.route('/:user_id').get(getUserByUsername).all(handle405);

module.exports = usersRouter;
