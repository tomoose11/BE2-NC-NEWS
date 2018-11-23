const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db('users').select().then(users => res.send({ users }));
};

exports.getUserByUsername = (req, res, next) => {
  db('users').select().where('username', req.params.username)
    .then(users => res.send(users[0]));
};
