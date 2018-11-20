const topicsRouter = require("express").Router();
const {
  getTopic,
  postTopic,
  getArticlesForOneTopic
} = require("../controllers/topicsController");

topicsRouter
  .route("/")
  .get(getTopic)
  .post(postTopic);

topicsRouter.get("/:topic/articles", getArticlesForOneTopic);

module.exports = topicsRouter;
