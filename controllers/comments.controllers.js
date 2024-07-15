const { fetchCommentsByArticleId } = require("../models/comments.models");

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
