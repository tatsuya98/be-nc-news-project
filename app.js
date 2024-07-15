const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./getEndpoints");
const app = express();

app.get("/api/topics", getTopics);
module.exports = app;
