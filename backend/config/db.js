const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

// Optional: Log connection errors
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error ❌", err)
  process.exit(1)
})

module.exports = pool