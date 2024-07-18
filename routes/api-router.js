const { getEndpoints } = require("../getEndpoints");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getEndpoints);
module.exports = apiRouter;
