const db = require("../db/connection");
exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return rows[0];
    });
};
exports.updateArticleById = (article_id, updateData) => {
  return db
    .query(
      "UPDATE articles SET votes = CASE WHEN votes + $1 < 0 THEN 0 ELSE votes + $1 END  WHERE article_id = $2 RETURNING *",
      [updateData.inc_vote, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows[0];
    });
};
