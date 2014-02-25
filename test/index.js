var assert = require("assert");
var Slowlog = require("..");

var conn = require("mysql").createConnection({
  host: process.env.MYSQL_HOST
  , user: process.env.MYSQL_USER
  , password: process.env.MYSQL_PASSWORD
});

var log = Slowlog(conn, {
  time: 0 // Log everything.
});


describe("mysql-slowlog", function () {
  before(function (done) {
    done();
  });

  describe("log streaming query", function () {
    it("should log a slow query", function (done) {
      log.once("slow", function (time, query) {
        assert.ok(time > 0);
        done();
      });

      conn.query("SELECT 1 + 1");
    });
  });

  describe("log callback query", function () {
    it("should log a slow query", function (done) {
      log.once("slow", function (time, query) {
        assert.ok(time > 0);
        done();
      });

      conn.query("SELECT 1 + 1", function () { });
    });
  });

  describe("log streaming query with args", function () {
    it("should log a slow query", function (done) {
      log.once("slow", function (time, query) {
        assert.ok(time > 0);
        assert.equal(query[1][0], 1);
        assert.equal(query[1][1], 1);
        done();
      });

      conn.query("SELECT ? + ?", [1, 1]);
    });
  });
});
