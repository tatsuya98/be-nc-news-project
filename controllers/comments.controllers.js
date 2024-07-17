const {
  fetchCommentsByArticleId,
  insertIntoCommentsByArticleId,
  removeComment,
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
  return insertIntoCommentsByArticleId(article_id, userCommentData)
    .then((userComment) => {
      response.status(201).send({ userComment });
    })
    .catch((error) => {
      next(error);
    });
};
exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  return removeComment(comment_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch((error) => {
      next(error);
    });
};
