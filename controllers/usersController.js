const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db('users').select().then(users => res.send({ users })).catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  db('users').select().where('username', req.params.username)
    .then((users) => {
      if (users.length === 0) {
        next({ status: 404, message: 'path does not exist' });
      } else { res.send(users[0]); }
    })
    .catch(next);
};
