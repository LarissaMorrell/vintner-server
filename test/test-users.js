global.DATABASE_URL = "mongodb://localhost/jwt-auth-demo-test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("/api/user", function() {
  const username = "exampleUser";
  const password = "examplePass";
  const firstName = "Example";
  const lastName = "User";
  const usernameB = "exampleUserB";
  const passwordB = "examplePassB";
  const firstNameB = "ExampleB";
  const lastNameB = "UserB";
  const avatar = "girl1";

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/users", function() {
    describe("POST", function() {
      it("Should reject users with missing username", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            password,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should reject users with missing password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-string username", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username: 1234,
            password,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should reject users with non-string password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password: 1234,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-string first name", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password,
            firstName: 1234,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("firstName");
          });
      });
      it("Should reject users with non-string last name", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password,
            firstName,
            lastName: 1234,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("lastName");
          });
      });
      it("Should reject users with non-trimmed username", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with spaces"
            );
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should reject users with non-trimmed password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with spaces"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with empty username", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username: "",
            password,
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Must be at least 1 characters");
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should reject users with password less than eight characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password: "1234567",
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Must be at least 8 characters");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with password greater than 72 characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password: new Array(73).fill("a").join(""),
            firstName,
            lastName,
            avatar
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Must be 72 characters or less");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with duplicate username", function() {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName,
          avatar
        })
          .then(() =>
            // Try to create a second user with the same username
            chai
              .request(app)
              .post("/api/users")
              .send({
                username,
                password,
                firstName,
                lastName,
                avatar
              })
          )
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Username already taken");
            expect(res.body.location).to.equal("username");
          });
      });
      it("Should create a new user", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password,
            firstName,
            lastName,
            avatar
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "id",
              "username",
              "firstName",
              "lastName",
              "avatar"
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            expect(res.body.avatar).to.equal(avatar);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            expect(user.avatar).to.equal(avatar);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it("Should trim firstName and lastName", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `,
            avatar
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "id",
              "username",
              "firstName",
              "lastName",
              "avatar"
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            expect(res.body.avatar).to.equal(avatar);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            expect(user.avatar).to.equal(avatar);
          });
      });
    });

    describe("GET", function() {
      it("Should return an empty array initially", function() {
        return chai
          .request(app)
          .get("/api/users")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(0);
          });
      });
      it("Should return an array of users", function() {
        let id1;
        let id2;
        return User.create(
          {
            username,
            password,
            firstName,
            lastName,
            avatar
          },
          {
            username: usernameB,
            password: passwordB,
            firstName: firstNameB,
            lastName: lastNameB,
            avatar: avatar
          }
        )
          .then(() => chai.request(app).get("/api/users"))
          .then(res => {
            id1 = res.body[0].id;
            id2 = res.body[1].id;
            return res;
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              id: id1,
              username,
              firstName,
              lastName,
              avatar
            });
            expect(res.body[1]).to.deep.equal({
              id: id2,
              username: usernameB,
              firstName: firstNameB,
              lastName: lastNameB,
              avatar: avatar
            });
          });
      });
    });
  });
});
