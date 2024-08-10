const {
  getUsers,
  getUserByUsername,
  postUserToUsers,
} = require("../controllers/users.controllers");

const usersRouter = require("express").Router();
usersRouter.route("/").get(getUsers).post(postUserToUsers);
usersRouter.get("/:username", getUserByUsername);
module.exports = usersRouter;
