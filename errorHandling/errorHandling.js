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
  if (error.code === "23503" && error.detail.includes("articles")) {
    response.status(422).send({
      message: "unable to post comment to an article that does not exist",
    });
  }
  if (error.code === "23503" && error.detail.includes("users")) {
    response.status(404).send({
      message: "username does not exist",
    });
  }
  if (error.code === "23503" && error.detail.includes("topics")) {
    response.status(404).send({
      message: "topic not found",
    });
  }

  if (error.code === "23502") {
    response
      .status(400)
      .send({ message: "request is missing 1 or more fields" });
  } else {
    next(error);
  }
};
exports.serverErrorHandling = (error, request, response, next) => {
  response.status(500).send({ message: "Internal server error" });
};
