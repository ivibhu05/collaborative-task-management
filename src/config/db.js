const { Pool } = require("pg");

const pool = new Pool({
  user: "vibhanshupandey",
  host: "localhost",
  database: "task_management",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
module.exports = pool;
