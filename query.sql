\c knews;

SELECT COUNT(comments.comment_id) AS comment_count, articles.article_id FROM comments 
JOIN articles ON comments.article_id = articles.article_id GROUP BY articles.article_id;