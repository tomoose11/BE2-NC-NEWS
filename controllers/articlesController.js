const db = require('../db/connection');
const { buildArticles } = require('../utils/queryBuilders');

exports.getArticles = (req, res, next) => {
  buildArticles(req, res, next);
  // let counter = 0;
  // const {
  //   limit = 10,
  //   sort_by = 'created_at',
  //   p = 'page',
  //   sort_ascending = true,
  // } = req.query;
  // const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  // db('articles')
  //   .column(
  //     { author: 'users.username' },
  //     'title',
  //     'article_id',
  //     'votes',
  //     'created_at',
  //     'topic',
  //   )
  //   .limit(limit)
  //   .orderBy(sort_by, sortOrder)
  //   .innerJoin('users', 'users.user_id', 'articles.user_id')
  //   .then(articles => articles.forEach((item) => {
  //     db('comments')
  //       .select()
  //       .innerJoin('articles', 'comments.article_id', 'articles.article_id')
  //       .where('articles.article_id', item.article_id)
  //       .then((comments) => {
  //         counter += 1;
  //         item.comments = comments.length;
  //         if (articles.length === counter) {
  //           res.send(articles);
  //         }
  //       });
  //   }))
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getOneArticle = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 'page',
    sort_ascending = true,
  } = req.query;
  const sortOrder = sort_ascending === 'true' ? 'asc' : 'desc';
  db('articles')
    .column(
      { author: 'users.username' },
      'title',
      'article_id',
      'votes',
      'created_at',
      'topic',
    )
    .limit(limit)
    .orderBy(sort_by, sortOrder)
    .innerJoin('users', 'users.user_id', 'articles.user_id')
    .where('article_id', req.params.article_id)
    .then((articles) => {
      articles.forEach((item) => {
        db('comments')
          .select()
          .innerJoin('articles', 'comments.article_id', 'articles.article_id')
          .where('articles.article_id', item.article_id)
          .then((comments) => {
            counter += 1;
            item.comments = comments.length;
            if (articles.length === counter) {
              res.send(articles);
            }
          });
      });
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
    .then((votes) => {
      res.send(votes);
    });
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
