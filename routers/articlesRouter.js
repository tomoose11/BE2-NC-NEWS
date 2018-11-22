const articleRouter = require('express').Router();
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
  .delete(deleteOneArticle);

articleRouter.route('/:article_id/comments')
  .get(getArrayOfCommentsForOneArticle);

module.exports = articleRouter;
