const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./getEndpoints");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  SqlErrorHandling,
  customErrorHandling,
} = require("./errorHandling/errorHandling");
const app = express();
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.use(SqlErrorHandling);
app.use(customErrorHandling);
module.exports = app;
