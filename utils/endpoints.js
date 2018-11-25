module.exports = {
  topics_url: 'https://tom-nc-knews.herokuapp.com/api/topics',
  articles_for_one_topic_url: 'https://tom-nc-knews.herokuapp.com/api/topics/:topic/articles?{limit,sort_by,p,sort_ascending}',
  articles_url: 'https://tom-nc-knews.herokuapp.com/api/articles',
  article_url: 'https://tom-nc-knews.herokuapp.com/api/articles/:article_id',
  comments_for_one_article_url: 'https://tom-nc-knews.herokuapp.com/api/articles/:article_id/comments',
  comment_for_one_article_url: 'https://tom-nc-knews.herokuapp.com/api/articles/:article_id/comments/:comment_id',
  users_url: 'https://tom-nc-knews.herokuapp.com/api/users',
  user_url: 'https://tom-nc-knews.herokuapp.com/api/:username',
};
