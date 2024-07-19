const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  insertIntoArticles,
} = require("../models/articles.models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order_by, topic } = request.query;
  return fetchArticles(sort_by, order_by, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
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
exports.patchArticle = (request, response, next) => {
  const { inc_vote } = request.body;
  const { article_id } = request.params;
  return updateArticleById(article_id, inc_vote)
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
exports.postToArticles = (request, response, next) => {
  const article = request.body;
  return insertIntoArticles(article)
    .then((newArticle) => {
      response.status(201).send({ newArticle });
    })
    .catch((error) => {
      next(error);
    });
};
