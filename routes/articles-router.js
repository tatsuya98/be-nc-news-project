const {
  getArticles,
  getArticleById,
  patchArticle,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postToComments,
} = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postToComments);
module.exports = articlesRouter;
