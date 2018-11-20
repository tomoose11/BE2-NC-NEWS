const db = require("../utils/connection");

exports.getTopic = (req, res, next) => {
  db("topics")
    .select()
    .then(topics => {
      res.send(topics);
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  db("topics")
    .insert(req.body)
    .returning("*")
    .then(topics => {
      res.status(201).send({ topics });
    })
    .catch(next);
};

exports.getArticlesForOneTopic = (req, res, next) => {
  let counter = 0;
  db("articles")
    .column(
      { author: "users.username" },
      "title",
      "article_id",
      "votes",
      "created_at",
      "topic"
    )
    //.select()
    .innerJoin("users", "users.user_id", "articles.user_id")
    //.innerJoin("comments", "comments.article_id", "articles.article_id")
    .where("topic", req.params.topic)
    .then(articles => {
      const ob = articles.forEach(item => {
        db("comments")
          .select()
          .innerJoin("articles", "comments.article_id", "articles.article_id")
          .where("articles.article_id", item.article_id)
          .then(comments => {
            counter++;
            item.comments = comments.length;
            if (articles.length === counter) {
              res.send(articles);
            }
          });
      });
    });
  // .then(articles => {
  //   res.send(articles);
  // });
};
