const {
  getArticles,
  getArticleById,
  patchArticle,
  postToArticles,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postToComments,
} = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postToArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postToComments);
module.exports = articlesRouter;
