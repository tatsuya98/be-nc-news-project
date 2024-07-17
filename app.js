const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./getEndpoints");
const {
  getArticleById,
  getArticles,
  patchArticles,
} = require("./controllers/articles.controllers");
const {
  SqlErrorHandling,
  customErrorHandling,
} = require("./errorHandling/errorHandling");
const {
  getCommentsByArticleId,
  postToComments,
  deleteComment,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postToComments);
app.delete("/api/comments/:comment_id", deleteComment);
app.use(SqlErrorHandling);
app.use(customErrorHandling);
module.exports = app;
