const { response } = require("../app");
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articles.models");

exports.getArticles = (request, response) => {
  return fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};
exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  return fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
