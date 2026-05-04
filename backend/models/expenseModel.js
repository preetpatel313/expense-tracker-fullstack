const pool = require("../config/db")

// ✅ GET ALL
exports.getAllExpenses = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM expenses WHERE user_id=$1 ORDER BY id DESC",
    [userId]
  )
  return result.rows
}

// ✅ CREATE (FIXED with type)
exports.createExpense = async (title, amount, category, type, userId) => {
  const result = await pool.query(
    `INSERT INTO expenses (title, amount, category, type, user_id)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [title, amount, category, type, userId]
  )
  return result.rows[0]
}

// ✅ DELETE
exports.deleteExpense = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM expenses WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, userId]
  )
  return result.rows[0]
}

// ✅ UPDATE (FIXED with type)
exports.updateExpense = async (id, title, amount, category, type, userId) => {
  const result = await pool.query(
    `UPDATE expenses
     SET title=$1, amount=$2, category=$3, type=$4
     WHERE id=$5 AND user_id=$6
     RETURNING *`,
    [title, amount, category, type, id, userId]
  )
  return result.rows[0]
}

// ✅ TOTAL (ONLY EXPENSES)
exports.getTotalExpenses = async (userId) => {
  const result = await pool.query(
    `SELECT SUM(amount) AS total 
     FROM expenses 
     WHERE user_id=$1 AND type='expense'`,
    [userId]
  )
  return result.rows[0].total || 0
}

// ✅ CATEGORY SUMMARY (ONLY EXPENSES)
exports.getCategorySummary = async (userId) => {
  const result = await pool.query(
    `SELECT category, SUM(amount) AS total
     FROM expenses
     WHERE user_id=$1 AND type='expense'
     GROUP BY category`,
    [userId]
  )
  return result.rows
}

// ✅ MONTHLY (SEPARATE income & expense)
exports.getMonthlyExpenses = async (userId) => {
  const result = await pool.query(
    `SELECT 
        TO_CHAR(created_at, 'Mon') AS month,
        type,
        SUM(amount) AS total
     FROM expenses
     WHERE user_id=$1
     GROUP BY month, type
     ORDER BY MIN(created_at)`,
    [userId]
  )
  return result.rows
}

// ✅ BALANCE (FIXED)
exports.getBalance = async (userId) => {
  const result = await pool.query(
    `SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense
     FROM expenses
     WHERE user_id=$1`,
    [userId]
  )

  const totalIncome = result.rows[0].total_income || 0
  const totalExpense = result.rows[0].total_expense || 0

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  }
}