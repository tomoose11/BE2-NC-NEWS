const articleRouter = require('express').Router();
const { handle405, handle400atRouter } = require('../errors/errors');
const {
  getArticles,
  getOneArticle,
  increaseVotes,
  deleteOneArticle,
  getArrayOfCommentsForOneArticle,
  postOneCommentForAnArticle,
} = require('../controllers/articlesController');


articleRouter.route('/').get(getArticles).all(handle405);

articleRouter
  .param('article_id', (req, res, next) => {
    handle400atRouter(req.params.article_id, next);
  })
  .route('/:article_id')
  .get(getOneArticle)
  .patch(increaseVotes)
  .delete(deleteOneArticle)
  .all(handle405);

articleRouter.route('/:article_id/comments')
  .get(getArrayOfCommentsForOneArticle)
  .post(postOneCommentForAnArticle)
  .all(handle405);

module.exports = articleRouter;
