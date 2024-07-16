exports.customErrorHandling = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
};
exports.SqlErrorHandling = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Bad request" });
  }
  if (error.code === "23503") {
    response
      .status(422)
      .send({
        message: "unable to post comment to an article that does not exist",
      });
  } else {
    next(error);
  }
};
exports.serverErrorHandling = (error, request, response, next) => {
  response.status(500).send({ message: "Internal server error" });
};
