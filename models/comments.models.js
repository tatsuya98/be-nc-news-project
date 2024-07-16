const db = require("../db/connection");
exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "no comments found for this article id",
        });
      }
      return rows;
    });
};
exports.updateCommentsByArticleId = (article_id, userCommentData) => {
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES($1, $2, $3) RETURNING body",
      [userCommentData.body, article_id, userCommentData.user]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
