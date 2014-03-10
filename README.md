# node-mysql-slowlog

Application level slow log for mysql connections. Good for debugging
slow queries when you haven't turned on or have access to the database
slow log.

## Install

    $ npm i mysql-slowlog --save

## Example

```js
var conn = require("mysql").createConnection({
  ...
});

// This patches the conn.query method to record time diffs.
var log = require("mysql-slowlog")(conn, {
  time: 5000 // Five seconds is pretty slow.
});

log.on("slow", function (time, query) {
  console.log("query %s took %dms", query, time);
});
```

## Changelog

### v0.1.1

* Fix bug when there is no stream returned by query.
