const express = require("express");
const {
  SqlErrorHandling,
  customErrorHandling,
  serverErrorHandling,
} = require("./errorHandling/errorHandling");
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.use(customErrorHandling);
app.use(SqlErrorHandling);
app.use(serverErrorHandling);
module.exports = app;
