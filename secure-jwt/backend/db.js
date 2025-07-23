const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "mypassword",
  port: 5432,
  database: "comp6441"
});

module.exports = pool;
