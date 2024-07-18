const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
beforeEach(() => seed(data));
afterAll(() => db.end());
describe("/api", () => {
  describe("GET", () => {
    test("should return an object with all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpointsList } }) => {
          expect(endpointsList).toEqual(endpoints);
        });
    });
  });
});
describe("/api/topics", () => {
  describe("GET", () => {
    test("should return an array of topics with a status of 200 ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBeGreaterThan(0);
          topics.forEach((topic) => {
            expect(topic).toEqual({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});
describe("/api/articles", () => {
  describe("GET", () => {
    test("should return an array of articles and a status of 200", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    test("should return the articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});
describe("/api/articles?=", () => {
  test("should return an array of articles sorted by id in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=DESC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("should return an array of articles sorted by votes should default to descending if order_by is not provided", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("should return an array of articles in asecending order and default to created_at if sort_by is not provided", () => {
    return request(app)
      .get("/api/articles?&order_by=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("should return a status of 400 and a message of can't sort by this query if sort_by query is not one of the column names in the articles table", () => {
    return request(app)
      .get("/api/articles?sort_by=1")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("can't sort by this query");
      });
  });
  test("should return a status of 400 and a message of can't order by this query", () => {
    return request(app)
      .get("/api/articles?order_by=1")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("can't order by this query");
      });
  });
});
describe("/api/articles?topic=", () => {
  test("should return an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: "cats",
          });
        });
      });
  });
  test("should return all articles if no topic is provided", () => {
    return request(app)
      .get("/api/articles?")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("should return an array of articles filtered by topic and sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order_by=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", { ascending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: "mitch",
          });
        });
      });
  });
});
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("should return an object article at the id in the url with status 200 ", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(2);
          expect(article).toMatchObject({
            article_id: 2,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("should return an object article including a comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            comment_count: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test("should return a message of bad request and a status of 400 when parametric endpoint is not a number", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a message article not found and a status of 404 when id is valid but not in the database", () => {
      return request(app)
        .get("/api/articles/555")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article not found");
        });
    });
  });
  describe("PATCH", () => {
    test("should return a status of 200 and a message of article has been updated", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_vote: 10 })
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("article with article_id 1 has been updated");
        });
    });
    test("votes should be 0 if the decrease amount is higher than the number of votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_vote: -10000 })
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle.votes).toBe(0);
        });
    });
    test("should return a status of 400 and message of Bad request when id is not a number", () => {
      return request(app)
        .patch("/api/articles/h")
        .send({ inc_vote: 10 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status of 400 and message of Bad request when value type is incorrect ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_vote: "h" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status 404 and a message of article not found", () => {
      return request(app)
        .patch("/api/articles/444")
        .send({ inc_vote: 10 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("article not found");
        });
    });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("should return an array of comments by article_id in url with a status of 200", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toEqual({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: 3,
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
    test("should be sorted by most recent comment first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("should return an empty array if article exists and has no comments", () => {
      return request(app)
        .get("/api/articles/13/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
          expect(comments).toEqual([]);
        });
    });
    test("should return a status of 400 and message of bad request", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status of 404 and message of no comments found for article id", () => {
      return request(app)
        .get("/api/articles/555/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("no comments found for this article id");
        });
    });
  });
  describe("POST", () => {
    test("should return an object with user's comment with a status of 201", () => {
      const testComment = {
        user: "butter_bridge",
        body: "Hello",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(201)
        .then(({ body: { userComment } }) => {
          expect(userComment).toEqual({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 3,
            author: "butter_bridge",
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("should return a status 400 with a message of bad request when article id is not a number", () => {
      const testComment = {
        user: "butter_bridge",
        body: "Hello",
      };
      return request(app)
        .post("/api/articles/hello/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status 400 with a message of request is missing 1 or more fields", () => {
      const testComment = {
        body: "Hello",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("request is missing 1 or more fields");
        });
    });
    test("should return a status of 404 if username does not exist", () => {
      const testComment = {
        user: "Hello",
        body: "hi",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("username does not exist");
        });
    });
    test("should return a status 422 with a message of unable to post comment to an article that does not exist", () => {
      const testComment = {
        user: "butter_bridge",
        body: "Hello",
      };
      return request(app)
        .post("/api/articles/444/comments")
        .send(testComment)
        .expect(422)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "unable to post comment to an article that does not exist"
          );
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("should return a status of 204 ", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });
    test("should return a status of 400 when id is not a number", () => {
      return request(app)
        .delete("/api/comments/h")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status of 404 when id is not found", () => {
      return request(app)
        .delete("/api/comments/345")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("comment not found");
        });
    });
  });
  describe("PATCH", () => {
    test("should return a message of votes on comment has been updated", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("votes on comment has been updated");
        });
    });
    test("should return an updatedComment with a votes of 0 if the inc_votes is greater than the number of votes on comment", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: -1000 })
        .expect(200)
        .then(({ body: { updatedComment } }) => {
          expect(updatedComment.votes).toBe(0);
        });
    });
    test("should return a status 400 and bad request if inc_votes is not a number", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "hello" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status 400 and bad request if number is not an Integer", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 3.5 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("should return a status of 404 and comment not found if id is not in the database", () => {
      return request(app)
        .patch("/api/comments/34343")
        .send({ inc_votes: 12 })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("comment not found");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("should return a status of 200 and an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBeGreaterThan(0);
          users.forEach((user) => {
            expect(user).toEqual({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
describe("/api/users/:username", () => {
  test("should return an object with the users data for username provided", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: "butter_bridge",
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("should return a status of 404 with a message of user not found", () => {
    return request(app)
      .get("/api/users/1")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("user not found");
      });
  });
});
