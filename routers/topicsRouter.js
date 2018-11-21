const topicsRouter = require('express').Router();
const {
  getTopic,
  postTopic,
  getArticlesForOneTopic,
  postArticlesForOneTopic,
} = require('../controllers/topicsController');

topicsRouter
  .route('/')
  .get(getTopic)
  .post(postTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesForOneTopic)
  .post(postArticlesForOneTopic);

module.exports = topicsRouter;
