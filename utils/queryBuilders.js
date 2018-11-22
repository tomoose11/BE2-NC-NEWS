const db = require('../db/connection');

exports.buildArticles = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = true,
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  return db
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
    .limit(limit)
    .offset(p * limit)
    .orderBy(sort_by, sortOrder)
    .modify((qb) => {
      if (req.params.topic) {
        qb.where('topic', req.params.topic);
      }
      if (req.params.article_id) {
        qb.where('articles.article_id', req.params.article_id);
      }
    });
};
