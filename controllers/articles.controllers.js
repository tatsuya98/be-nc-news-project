const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
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
exports.patchArticles = (request, response, next) => {
  const updateData = request.body;
  const { article_id } = request.params;
  return updateArticleById(article_id, updateData)
    .then((updatedArticle) => {
      response.status(200).send({
        updatedArticle,
        message: `article with article_id ${article_id} has been updated`,
      });
    })
    .catch((error) => {
      next(error);
    });
};
