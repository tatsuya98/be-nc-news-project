const db = require("../db/connection");
const {
  articlesSortByCheck,
  articlesOrderByCheck,
} = require("../db/seeds/utils");
exports.fetchArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  const validSortBy = articlesSortByCheck(sort_by);
  const validOrderBy = articlesOrderByCheck(order_by);
  if (!validSortBy) {
    return Promise.reject({ status: 400, message: "can't sort by this query" });
  }
  if (!validOrderBy) {
    return Promise.reject({
      status: 400,
      message: "can't order by this query",
    });
  }
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;
  if (sort_by === "comment_count") {
    queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY COUNT(*) ${order_by}`;
  }
  if (topic) {
    queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE topic=$1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;
    return db.query(queryStr, [topic]).then(({ rows }) => {
      return rows;
    });
  }
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.title, articles.topic, articles.author,articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      return rows[0];
    });
};
exports.updateArticleById = (article_id, inc_vote) => {
  return db
    .query(
      "UPDATE articles SET votes = CASE WHEN votes + $1 < 0 THEN 0 ELSE votes + $1 END  WHERE article_id = $2 RETURNING *",
      [inc_vote, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows[0];
    });
};
exports.insertIntoArticles = (article) => {
  const { author, title, body, topic, article_img_url } = article;
  let values = [author, title, body, topic, article_img_url];
  if (!article_img_url) {
    values = [author, title, body, topic, "url"];
  }
  const selectQuery =
    " INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5);";
  return db
    .query(selectQuery, values)
    .then(() => {
      return db.query(
        "SELECT articles.article_id, articles.title, articles.topic, articles.author,articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.author = $1 GROUP BY articles.article_id ORDER BY created_at DESC LIMIT 1",
        [author]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
