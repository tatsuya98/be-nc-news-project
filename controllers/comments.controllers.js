const {
  fetchCommentsByArticleId,
  updateCommentsByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  return fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
exports.postToComments = (request, response, next) => {
  const { article_id } = request.params;
  const userCommentData = request.body;
  return updateCommentsByArticleId(article_id, userCommentData)
    .then((userComment) => {
      response.status(201).send({ userComment });
    })
    .catch((error) => {
      next(error);
    });
};
