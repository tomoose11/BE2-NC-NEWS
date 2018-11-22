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
      { comments_count: 't.count' },
    )
    .from((qb) => {
      qb.select('comments.article_id', 'articles.user_id').from('comments')
        .rightJoin('articles', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id', 'comments.article_id')
        .count('comment_id')
        .as('t');
    })
    .leftJoin('articles', 't.article_id', 'articles.article_id')
    .join('users', 'users.user_id', '=', 't.user_id')
    .modify((qb) => {
      if (req.params.topic) {
        qb.where('topic', req.params.topic);
      }
    })
    .then((articles) => {
      res.send(articles);
    })
    .catch(err => console.log(err));
};
