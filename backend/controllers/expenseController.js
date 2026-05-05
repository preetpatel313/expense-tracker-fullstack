const pool = require("../config/db")

// 🔐 Route Handlers (with req, res)

// ✅ GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id=$1 ORDER BY id DESC",
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !category || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, type, user_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, amount, category, type, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add error:", error);
    res.status(500).json({ error: error.message });
  }
};


// ✅ DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await pool.query(
      "DELETE FROM expenses WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" })
    }
    
    res.json({ message: "Expense deleted", expense: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ GET TOTAL EXPENSES (ONLY type='expense')
exports.getTotalExpenses = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      `SELECT SUM(amount) AS total 
       FROM expenses 
       WHERE user_id=$1 AND type='expense'`,
      [userId]
    )
    res.json({ total: result.rows[0].total || 0 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ GET CATEGORY SUMMARY (ONLY type='expense')
exports.getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id=$1 AND type='expense'
       GROUP BY category
       ORDER BY total DESC`,
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ GET MONTHLY EXPENSES (SEPARATE income & expense, handles multi-year)
exports.getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await pool.query(
      `SELECT 
          TO_CHAR(created_at, 'YYYY-MM') AS month,
          type,
          SUM(amount) AS total
       FROM expenses
       WHERE user_id=$1
       GROUP BY TO_CHAR(created_at, 'YYYY-MM'), type
       ORDER BY month ASC`,
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ GET BALANCE (income - expense)
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id
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

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


exports.updateExpense = async (req, res) => {
  try {
  

    const { id } = req.params;
    const { title, amount, category, type } = req.body;
    const userId = req.user.id;

    if (!title || !amount || !category || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `UPDATE expenses
       SET title=$1, amount=$2, category=$3, type=$4
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
      [title, amount, category, type, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};