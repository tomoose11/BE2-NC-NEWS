const topicsRouter = require('express').Router();
const { handle405 } = require('../errors/errors');
const {
  getTopic,
  postTopic,
  getArticlesForOneTopic,
  postArticlesForOneTopic,
} = require('../controllers/topicsController');


topicsRouter
  .route('/')
  .get(getTopic)
  .post(postTopic)
  .all(handle405);

topicsRouter
  .param('topic', (req, res, next, id) => {
    console.log(req.params);
    if (req.params.topic.match(/[1-9]/g) || req.params.topic === '1') {
      next({ status: 400, message: 'invalid data type' });
    } else {
      next();
    }
  })
  .route('/:topic/articles')
  .get(getArticlesForOneTopic)
  .post(postArticlesForOneTopic)
  .all(handle405);

module.exports = topicsRouter;
