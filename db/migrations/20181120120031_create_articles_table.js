exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary().unsigned();
    articlesTable.string('title').notNullable();
    articlesTable.string('body', 10000).notNullable();
    articlesTable.integer('votes').defaultTo(0).unsigned();
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable().unsigned();
    articlesTable
      .integer('user_id')
      .references('users.user_id')
      .notNullable().unsigned();
    articlesTable.datetime('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
