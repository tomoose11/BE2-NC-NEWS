const data = require('../data/index');
const { formatComments, formatObject, createHouseRef } = require('../../utils/seedFunctions');


const {
  topicData, userData, articleData, commentData,
} = data;


const historyArr = [];

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('topics')
    .del()
    .then(() => knex('topics').insert(topicData))
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))
    .then((usersDat) => {
      const dat = createHouseRef(usersDat, 'username', 'user_id');
      historyArr.push(dat);
      const formattedOb = formatObject(articleData, dat);
      return knex('articles')
        .insert(formattedOb)
        .returning('*');
    })
    .then((artDat) => {
      const dat2 = createHouseRef(artDat, 'title', 'article_id');
      const formattedOb = formatComments(commentData, historyArr[0], dat2);
      return knex('comments').insert(formattedOb);
    });
};

// function createHouseRef(rows, columnname, idname) {
//   const myOb = rows.reduce((acc, row) => {
//     acc[row[columnname]] = row[idname];
//     return acc;
//   }, {});
//   return myOb;
// }

// function formatComments(commentsData, usersRef, articleRef) {
//   const myMap = commentsData.map((comment) => {
//     const {
//       body, belongs_to, created_by, votes, created_at,
//     } = comment;
//     const date = new Date(created_at);
//     return {
//       body,
//       user_id: usersRef[created_by],
//       article_id: articleRef[belongs_to],
//       votes,
//       created_at: date,
//     };
//   });
//   return myMap;
// }

// function formatObject(articlesData, usersRef) {
//   const myMap = articlesData.map((article) => {
//     const {
//       title, topic, body, created_at, created_by,
//     } = article;
//     const date = new Date(created_at);
//     return {
//       title,
//       topic,
//       body,
//       created_at: date,
//       user_id: usersRef[created_by],
//     };
//   });
//   return myMap;
// }
