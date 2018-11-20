const topicData = require("../data/development-data/topics");
const usersData = require("../data/development-data/users");
const articlesData = require("../data/development-data/articles");
const commentsData = require("../data/development-data/comments");
const historyArr = [];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("topics")
    .del()
    .then(function() {
      return knex("topics").insert(topicData);
    })
    .then(() => {
      return knex("users")
        .insert(usersData)
        .returning("*");
    })
    .then(usersDat => {
      const dat = createHouseRef(usersDat, "username", "user_id");
      historyArr.push(dat);
      const formattedOb = formatObject(articlesData, dat);
      return knex("articles")
        .insert(formattedOb)
        .returning("*");
    })
    .then(artDat => {
      //console.log(historyArr[0]);
      const dat2 = createHouseRef(artDat, "title", "article_id");
      const formattedOb = formatComments(commentsData, historyArr[0], dat2);
      console.log(formattedOb);
      return knex("comments").insert(formattedOb);
    });
};

function createHouseRef(rows, columnname, idname) {
  const myOb = rows.reduce((acc, row) => {
    acc[row[columnname]] = row[idname];
    return acc;
  }, {});
  return myOb;
}

function formatComments(commentsData, usersRef, articleRef) {
  const myMap = commentsData.map(comment => {
    const { body, belongs_to, created_by, votes, created_at } = comment;
    const date = new Date(created_at);
    return {
      body,
      user_id: usersRef[created_by],
      article_id: articleRef[belongs_to],
      votes,
      created_at: date
    };
  });
  return myMap;
}

function formatObject(articlesData, usersRef) {
  const myMap = articlesData.map(article => {
    const { title, topic, body, created_at, created_by } = article;
    var date = new Date(created_at);
    return {
      title,
      topic,
      body,
      created_at: date,
      user_id: usersRef[created_by]
    };
  });
  return myMap;
}
