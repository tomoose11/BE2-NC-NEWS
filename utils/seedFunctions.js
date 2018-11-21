exports.createHouseRef = (rows, columnname, idname) => {
  const myOb = rows.reduce((acc, row) => {
    acc[row[columnname]] = row[idname];
    return acc;
  }, {});
  return myOb;
};

exports.formatComments = (commentsData, usersRef, articleRef) => {
  const myMap = commentsData.map((comment) => {
    const {
      body, belongs_to, created_by, votes, created_at,
    } = comment;
    const date = new Date(created_at);
    return {
      body,
      user_id: usersRef[created_by],
      article_id: articleRef[belongs_to],
      votes,
      created_at: date,
    };
  });
  return myMap;
};

exports.formatObject = (articlesData, usersRef) => {
  const myMap = articlesData.map((article) => {
    const {
      title, topic, body, created_at, created_by,
    } = article;
    const date = new Date(created_at);
    return {
      title,
      topic,
      body,
      created_at: date,
      user_id: usersRef[created_by],
    };
  });
  return myMap;
};
