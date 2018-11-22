const articleRouter = require('express').Router();
const { handle405 } = require('../errors/errors');
const {
  getArticles,
  getOneArticle,
  increaseVotes,
  deleteOneArticle,
  getArrayOfCommentsForOneArticle,
} = require('../controllers/articlesController');

articleRouter.get('/', getArticles);

articleRouter
  .route('/:article_id')
  .get(getOneArticle)
  .patch(increaseVotes)
  .delete(deleteOneArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments')
  .get(getArrayOfCommentsForOneArticle)
  .all(handle405);

module.exports = articleRouter;
