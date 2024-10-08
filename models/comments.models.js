const db = require("../db/connection");
const { checkArticleExists } = require("../db/seeds/utils");
exports.fetchCommentsByArticleId = (article_id) => {
  const promiseArray = [
    db.query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    ),
    checkArticleExists(article_id),
  ];
  return Promise.all(promiseArray).then(([commets, articleExists]) => {
    if (articleExists && commets.rows.length >= 0) {
      return commets.rows;
    }
    return Promise.reject({
      status: 404,
      message: "no comments found for this article id",
    });
  });
};
exports.insertIntoCommentsByArticleId = (article_id, userCommentData) => {
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES($1, $2, $3) RETURNING *",
      [userCommentData.body, article_id, userCommentData.user]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
    });
};
exports.updateCommentById = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = CASE WHEN votes + $1 < 0 THEN 0 ELSE votes + $1 END  WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
      return rows[0];
    });
};
