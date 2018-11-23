const db = require('../db/connection');
const { buildArticles } = require('../utils/queryBuilders');

exports.getArticles = (req, res, next) => {
  buildArticles(req, res, next).then((articles) => {
    res.send({ articles });
  }).catch(next);
};

exports.getOneArticle = (req, res, next) => {
  buildArticles(req, res, next).then((article) => {
    if (article.length === 0) {
      next({ status: 404, message: 'path does not exist' });
    } else { res.send(article[0]); }
  });
};

exports.increaseVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  db('articles')
    .select()
    .where('article_id', req.params.article_id)
    .modify((queryBuilder) => {
      if (inc_votes >= 0) {
        queryBuilder.increment('votes', inc_votes);
      }
      if (inc_votes < 0) {
        const dec = inc_votes - inc_votes * 2;
        queryBuilder.decrement('votes', dec);
      }
    })
    .returning('*')
    .then((article) => {
      if (typeof inc_votes !== 'number') {
        next({ status: 400, message: 'invalid data type' });
      } else {
        res.send(article[0]);
      }
    })
    .catch(next);
};


exports.deleteOneArticle = (req, res, next) => {
  db('articles')
    .select()
    .where('article_id', req.params.article_id)
    .del()
    .returning('*')
    .then((votes) => {
      res.send(votes);
    });
};

exports.getArrayOfCommentsForOneArticle = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = true,
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  db('comments')
    .column('article_id', 'comment_id', 'votes', 'created_at', { author: 'username' }, 'body')
    .join('users', 'users.user_id', '=', 'comments.user_id')
    .limit(limit)
    .offset(p * limit)
    .orderBy(sort_by, sortOrder)
    .where('article_id', req.params.article_id)
    .then((article) => {
      res.send(article);
    });
};
