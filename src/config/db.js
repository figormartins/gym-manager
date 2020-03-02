const { Pool } = require("pg")

module.exports = new Pool({
  user: "postgres",
  password: "2010",
  host: "localhost",
  port: 5432,
  database: "gymmanager"
})