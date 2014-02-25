var EventEmitter = require("events").EventEmitter;

var toArray = function (a) { return Array.prototype.slice.call(a, 0); };

module.exports = function (conn, opts) {
  // Has this connection already been patched?
  if (conn.slowlog) { return conn.slowlog; }

  var emitter = new EventEmitter();

  opts = opts || {
    time: 1000 // Default is 1 second.
  };

  // Store away the old query method.
  var old = conn.query;

  // New query method.
  conn.query = function () {
    var args = toArray(arguments)
      , then = new Date();

    var slow = function () {
      var now = new Date()
        , time = now.getTime() - then.getTime();

      if (time > opts.time) {
        emitter.emit("slow", time, args.filter(function (a) {
          return typeof a !== "function"; // Return all arguments that arent functions.
        }));
      }
    };

    // Query with a callback?
    if (args.length > 1 && typeof args[args.length - 1] === "function") {

      // Substitue the callback.
      var fn = args.pop();
      args.push(function (err, rows) {
        slow();
        fn.apply(this, toArray(arguments));
      });

      return old.apply(this, args); // Execute query.
    } else { // Assume streaming when there is no callback.
      return old.apply(this, args).on("end", slow);
    }
  };

  conn.slowlog = emitter;
  return emitter;
};
