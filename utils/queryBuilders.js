const db = require('../db/connection');

exports.buildArticles = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = 'false',
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';

  return db('comments').rightJoin('articles', 'comments.article_id', 'articles.article_id')
    .leftJoin('users', 'articles.user_id', 'users.user_id')
    .groupBy('articles.article_id', 'username')
    .column({ author: 'users.username' }, 'articles.title', 'articles.article_id', 'articles.votes', 'articles.created_at', 'articles.topic')
    .count({ comments_count: 'comments.comment_id' })
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

  // return db

  //   .from((qb) => {
  //     qb.select('comments.article_id', 'articles.user_id').from('comments')
  //       .rightJoin('articles', 'comments.article_id', '=', 'articles.article_id')
  //       .groupBy('articles.article_id', 'comments.article_id')
  //       .count('comment_id')
  //       .as('t');
  //   })
  //   .leftJoin('articles', 't.article_id', 'articles.article_id')
  //   .leftJoin('users', 'users.user_id', '=', 't.user_id')
  //   .limit(limit)
  //   .offset(p * limit)
  //   .orderBy(sort_by, sortOrder)
  //   .modify((qb) => {
  //     if (req.params.topic) {
  //       qb.where('topic', req.params.topic);
  //     }
  //     if (req.params.article_id) {
  //       qb.where('articles.article_id', req.params.article_id);
  //     }
  //   })
  //   .column(
  //     { author: 'users.username' },
  //     'articles.title',
  //     'articles.article_id',
  //     'votes',
  //     'created_at',
  //     'topic',
  //     { comments_count: 't.count' },
  //   );
};
