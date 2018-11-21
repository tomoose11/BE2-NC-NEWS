const db = require('../db/connection');

exports.buildArticles = (req, res, next) => {
  const counter = 0;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 'page',
    sort_ascending = true,
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  db
    .column(
      { author: 'users.username' },
      'articles.title',
      'articles.article_id',
      'votes',
      'created_at',
      'topic',
      't.count',
    )
    .from((qb) => {
      qb.select('article_id').from('comments').groupBy('article_id')
        .count('*')
        .as('t');
    })
    .join('articles', 'articles.article_id', '=', 't.article_id')
    .join('users', 'users.user_id', '=', 'articles.user_id')
    .modify((qb) => {
      if (req.params.topic) {
        qb.where('topic', req.params.topic);
      }
    })
    // .where('topic', req.params.topic)
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => console.log(err));
};
