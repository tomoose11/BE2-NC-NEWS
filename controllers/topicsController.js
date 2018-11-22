const db = require('../db/connection');
const { buildArticles } = require('../utils/queryBuilders');

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
  buildArticles(req, res, next);
  // const counter = 0;
  // const {
  //   limit = 10,
  //   sort_by = 'created_at',
  //   p = 'page',
  //   sort_ascending = true,
  // } = req.query;
  // const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  // db
  //   .column(
  //     { author: 'users.username' },
  //     'articles.title',
  //     'articles.article_id',
  //     'votes',
  //     'created_at',
  //     'topic',
  //     't.count',
  //   )
  //   .from((qb) => {
  //     qb.select('article_id').from('comments').groupBy('article_id')
  //       .count('*')
  //       .as('t');
  //   })
  //   .join('articles', 'articles.article_id', '=', 't.article_id')
  //   .join('users', 'users.user_id', '=', 'articles.user_id')
  //   .modify((qb) => {
  //     if (req.params.topic) {
  //       qb.where('topic', req.params.topic);
  //     }
  //   })
  //   // .where('topic', req.params.topic)
  //   .then((articles) => {
  //     res.send(articles);
  //   });
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
    })
    .catch(err => console.log(err));
};
