const {
  fetchUsers,
  fetchUserByUsername,
  insertUserIntoUsers,
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
