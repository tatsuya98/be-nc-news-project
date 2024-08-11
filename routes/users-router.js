const {
  getUsers,
  getUserByUsername,
  postUserToUsers,
  getUserByUsernamePassword,
  patchUserEmail,
  patchUserPassword,
} = require("../controllers/users.controllers");
const usersRouter = require("express").Router();
usersRouter.route("/").get(getUsers).post(postUserToUsers);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .post(getUserByUsernamePassword);
usersRouter.route("/:username/password").patch(patchUserPassword);
usersRouter.route("/:username/email").patch(patchUserEmail);
module.exports = usersRouter;
