const commentsRouter = require('express').Router();
const { increaseVotesForComments, deleteOneComment } = require('../controllers/commentsController');

commentsRouter.route('/:comment_id')
  .patch(increaseVotesForComments)
  .delete(deleteOneComment);

module.exports = commentsRouter;
