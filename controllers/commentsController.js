const db = require('../db/connection');

exports.increaseVotesForComments = (req, res, next) => {
  const { inc_votes } = req.body;
  db('comments')
    .select()
    .where('comment_id', req.params.comment_id)
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
    .then((comment) => {
      if (typeof inc_votes !== 'number') {
        next({ status: 400, message: 'invalid data type' });
      } else {
        res.send(comment[0]);
      }
    });
};

exports.deleteOneComment = (req, res, next) => {
  db('comments')
    .select()
    .where('comment_id', req.params.comment_id)
    .del()
    .returning('*')
    .then((comment) => {
      res.send(comment);
    });
};
