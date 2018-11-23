const db = require('../db/connection');
const { buildArticles } = require('../utils/queryBuilders');

exports.getTopic = (req, res, next) => {
  db('topics')
    .select()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  db('topics')
    .insert(req.body)
    .returning('*')
    .then((topics) => {
      res.status(201).send(topics[0]);
    })
    .catch(next);
};

exports.getArticlesForOneTopic = (req, res, next) => {
  buildArticles(req, res, next).then((articles) => {
    if (articles === 0) {
      next({ status: 400, message: 'A valid integer must be provided' });
    } else if (articles.length === 0) {
      next({ status: 404, message: 'path does not exist' });
    } else {
      res.send({ articles });
    }
  }).catch(next);
};

exports.postArticlesForOneTopic = (req, res, next) => {
  const { topic } = req.params;
  const { title, body, user_id } = req.body;
  db('articles')
    .insert({
      title,
      body,
      user_id,
      topic,
    })
    .returning('*')
    .then((article) => {
      res.status(201).send(article[0]);
    })
    .catch(next);
};
