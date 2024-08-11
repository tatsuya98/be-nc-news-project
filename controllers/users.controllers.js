const {
  fetchUsers,
  fetchUserByUsername,
  insertUserIntoUsers,
  fetchUserByUsernamePassword,
  updateEmailByUsername,
} = require("../models/users.models");

exports.getUsers = (request, response) => {
  return fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};
exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  return fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => next(error));
};
exports.getUserByUsernamePassword = (request, response, next) => {
  const { username } = request.params;
  const { password } = request.body;
  return fetchUserByUsernamePassword(username, password)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => next(error));
};
exports.postUserToUsers = (request, response, next) => {
  const userObject = request.body;
  return insertUserIntoUsers(userObject)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
exports.patchUserEmail = (request, response, next) => {
  const { username } = request.params;
  const { email } = request.body;
  return updateEmailByUsername(username, email)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => next(error));
};
exports.patchUserPassword = (request, response, next) => {
  const { username } = request.params;
  const { password } = request.body;
  return updateEmailByUsername(username, password)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
