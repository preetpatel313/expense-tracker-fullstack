const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "expense_tracker",
  password: process.env.DB_PASSWORD || "0313",
  port: process.env.DB_PORT || 5432,
});

// Test connection without blocking startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
    console.error("⚠️  Make sure PostgreSQL is running:");
    console.error("   - Host:", process.env.DB_HOST || "localhost");
    console.error("   - Port:", process.env.DB_PORT || 5432);
    console.error("   - Database:", process.env.DB_NAME || "expense_tracker");
    console.error("   - User:", process.env.DB_USER || "postgres");
  } else {
    console.log("✅ PostgreSQL Connected Successfully");
    initializeTables();
  }
});

// Initialize tables if they don't exist
async function initializeTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        category VARCHAR(100),
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log("✅ Database tables initialized");
  } catch (err) {
    console.error("⚠️  Table initialization warning:", err.message);
  }
}

module.exports = pool;


