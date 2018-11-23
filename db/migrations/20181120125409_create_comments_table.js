exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .integer('user_id')
      .references('users.user_id')
      .notNullable().unsigned();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable().onDelete('CASCADE')
      .unsigned();
    commentsTable.integer('votes').defaultTo(0).unsigned();
    commentsTable.datetime('created_at').defaultTo(knex.fn.now());
    commentsTable.string('body', 10000).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
