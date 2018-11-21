const articleRouter = require('express').Router();
const {
  getArticles,
  getOneArticle,
  increaseVotes,
  deleteOneArticle,
} = require('../controllers/articlesController');

articleRouter.get('/', getArticles);
articleRouter
  .route('/:article_id')
  .get(getOneArticle)
  .patch(increaseVotes)
  .delete(deleteOneArticle);

module.exports = articleRouter;
