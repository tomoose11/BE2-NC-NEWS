const db = require('../db/connection');

exports.getUsers = (req, res, next) => {
  db('users').select().then(users => res.send({ users }));
};
