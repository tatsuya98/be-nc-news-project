const { fetchUsers, fetchUserByUsername } = require("../models/users.models");

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
