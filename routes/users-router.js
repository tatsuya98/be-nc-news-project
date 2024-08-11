const {
  getUsers,
  getUserByUsername,
  postUserToUsers,
  getUserByUsernamePassword,
} = require("../controllers/users.controllers");

const usersRouter = require("express").Router();
usersRouter.route("/").get(getUsers).post(postUserToUsers);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .post(getUserByUsernamePassword);
module.exports = usersRouter;
