// const { restart } = require('nodemon');
const db = require('../db/connection');
const { buildArticles } = require('../utils/queryBuilders');

exports.getArticles = (req, res, next) => {
  buildArticles(req, res, next)
    .then((articles) => {
      if (articles === 0) {
        // checking query params art valid
        next({ status: 400, message: 'A valid  integer must be provided' });
      } else if (articles.length === 0) {
        next({ status: 404, message: 'path does not exist' });
      } else {
        res.send({ articles });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getOneArticle = (req, res, next) => {
  buildArticles(req, res, next)
    .then((article) => {
      if (article.length === 0) {
        next({ status: 404, message: 'path does not exist' });
      } else {
        res.send({ article: article[0] });
      }
    })
    .catch(next);
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
      if (typeof inc_votes !== 'number' && inc_votes) {
        next({ status: 400, message: 'invalid data type' });
      } else {
        res.send({ article: article[0] });
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
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({ status: 404, message: 'path does not exist' });
      } else {
        res.status(204).send();
      }
    })
    .catch(next);
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
    .column(
      'article_id',
      'comment_id',
      'votes',
      'created_at',
      { author: 'username' },
      'body',
    )
    .join('users', 'users.user_id', '=', 'comments.user_id')
    .limit(limit)
    .offset(p * limit)
    .orderBy(sort_by, sortOrder)
    .where('article_id', req.params.article_id)
    .then((comments) => {
      if (comments.length === 0) {
        next({ status: 404, message: 'path does not exist' });
      } else {
        res.send({ comments });
      }
    })
    .catch(next);
};

exports.postOneCommentForAnArticle = (req, res, next) => {
  const { user_id, body } = req.body;
  db('comments')
    .insert({ article_id: req.params.article_id, user_id, body })
    .returning('*')
    .then((comment) => {
      res.status(201).send({ comment: comment[0] });
    })
    .catch((err) => {
      if (
        err.code === '23503'
        && err.constraint === 'comments_user_id_foreign'
      ) {
        next({ status: 400, message: 'no user has this id' });
      } else if (err.code === '23503') {
        next({ status: 404, message: 'path does not exist' });
      } else {
        next(err);
      }
    });
};

exports.increaseVotesForComments = (req, res, next) => {
  const { inc_votes } = req.body;
  db('comments')
    .select()
    .where('comments.comment_id', req.params.comment_id)
    .andWhere('comments.article_id', req.params.article_id)
    .modify((queryBuilder) => {
      if (inc_votes >= 0) {
        queryBuilder.increment('votes', inc_votes);
      }
      if (inc_votes < 0) {
        const dec = inc_votes * -1;
        queryBuilder.decrement('votes', dec);
      }
    })
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) { next({ status: 404, message: 'path does not exist' }); } else if (typeof inc_votes !== 'number') {
        next({ status: 400, message: 'invalid data type' });
      } else {
        res.send({ comment: comment[0] });
      }
    })
    .catch(next);
};

exports.deleteOneComment = (req, res, next) => {
  db('comments')
    .select()
    .where('comment_id', req.params.comment_id)
    .del()
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ status: 404, message: 'path does not exist' });
      } else {
        res.status(204).send();
      }
    });
};
