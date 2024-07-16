const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app.js");
const endpoints = require("../endpoints.json");
const comments = require("../db/data/test-data/comments.js");
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
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("should return an object article at the id in the url with status 200 ", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(2);
          expect(article).toEqual({
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
            body: expect.any(String),
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
