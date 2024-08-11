const db = require("../db/connection");
const { generateHash, passwordLoginAttempt } = require("../db/seeds/utils");
exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
exports.fetchUserByUsername = (username) => {
  return db
    .query("Select * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "user not found" });
      }
      return rows[0];
    });
};
exports.fetchUserByUsernamePassword = (username, password) => {
  return db
    .query("Select * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "user not found" });
      }
      return Promise.all([
        rows[0],
        passwordLoginAttempt(password, rows[0].password),
      ]);
    })
    .then((data) => {
      const isCorrectPassword = data[1];
      const user = data[0];
      if (isCorrectPassword) {
        return user;
      }
      return Promise.reject({ status: 401, message: "password is incorrect" });
    });
};

exports.insertUserIntoUsers = (user) => {
  const { username, password, email, name, avatar_url } = user;
  return generateHash(password)
    .then((generatedHash) => {
      return Promise.resolve(generatedHash);
    })
    .then(({ hash, salt }) => {
      return db.query(
        "INSERT INTO users (username, password, salt, email, name, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, hash, salt, email, name, avatar_url]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
