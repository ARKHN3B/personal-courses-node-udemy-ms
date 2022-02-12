const mysql = require("mysql2");

// Connection pools help reduce the time spent connecting to the MySQL server by reusing a previous connection,
// leaving them open instead of closing when you are done with them. This improves the latency of queries as it avoids
// the overhead that comes with establishing a new connection.
const pool = mysql.createPool({
  host    : "localhost",
  ...
});

module.exports = pool.promise();
