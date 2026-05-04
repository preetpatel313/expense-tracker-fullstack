const pool = require("../config/db")

exports.getAllIncome = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM income WHERE user_id=$1 ORDER BY id DESC",
    [userId]
  )
  return result.rows
}
exports.addIncome = async (source, amount, userId) => {
  const result = await pool.query(
    "INSERT INTO income (source, amount, user_id) VALUES ($1,$2,$3) RETURNING *",
    [source, amount, userId]
  )
  return result.rows[0]
}
exports.updateIncome = async (id, source, amount, userId) => {

  const result = await pool.query(
    `UPDATE income
     SET source=$1, amount=$2
     WHERE id=$3 AND user_id=$4
     RETURNING *`,
    [source, amount, id, userId]
  )

  return result.rows[0]
}
exports.deleteIncome = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM income WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, userId]
  )
  return result.rows[0]
}