const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "thomas",
    password: "1234",
    database: "knews"
  }
});

module.exports = db;
