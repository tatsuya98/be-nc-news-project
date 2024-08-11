exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = (article_id) => {
  const db = require("../connection");
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return false;
      }
      return true;
    });
};
exports.articlesSortByCheck = (sort_by) => {
  const sortByWhiteListedWords = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  return sortByWhiteListedWords.includes(sort_by);
};
exports.articlesOrderByCheck = (order_by) => {
  const orderByWhiteListedWords = ["ASC", "DESC"];
  return orderByWhiteListedWords.includes(order_by);
};

exports.generateHash = async (password) => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return Promise.resolve({ salt, hash });
};

exports.passwordLoginAttempt = async (passwordAttempt, hash) => {
  const bcrypt = require("bcrypt");
  const result = await bcrypt.compare(passwordAttempt, hash);
  return Promise.resolve(result);
};
