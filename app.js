const express = require("express");
const {
  SqlErrorHandling,
  customErrorHandling,
} = require("./errorHandling/errorHandling");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);
app.use(SqlErrorHandling);
app.use(customErrorHandling);
module.exports = app;
