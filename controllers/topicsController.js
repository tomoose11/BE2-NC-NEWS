const db = require('../db/connection');

exports.getTopic = (req, res, next) => {
  db('topics')
    .select()
    .then((topics) => {
      console.log(topics);
      res.send(topics);
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
  const counter = 0;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 'page',
    sort_ascending = true,
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  db('articles')
    .select('*')

    // .column(
    //   { author: 'users.username' },
    //   'title',
    //   'article_id',
    //   'votes',
    //   'created_at',
    //   'topic',
    // )
    // .limit(limit)
    // .orderBy('created_at', sortOrder)
    // .innerJoin('users', 'users.user_id', 'articles.user_id')
    .groupBy('topic')
    // .where('topic', req.params.topic)
    .then((articles) => {
      res.send(articles);
    });
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
      res.send(article);
    });
};
