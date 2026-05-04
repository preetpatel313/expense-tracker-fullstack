const expenseModel = require("../models/expenseModel")

// ✅ GET all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.getAllExpenses(req.user.id)
    res.json(expenses)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch expenses" })
  }
}

// ✅ ADD expense/income
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, type } = req.body
    const userId = req.user.id

    if (!title || !amount || !type) {
      return res.status(400).json({ error: "Title, amount, and type are required" })
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'income' or 'expense'" })
    }

    const amountValue = Number(amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" })
    }

    const newExpense = await expenseModel.createExpense(
      title,
      amountValue,
      category || null,
      type,
      userId
    )

    res.status(201).json(newExpense)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create expense" })
  }
}

// ✅ UPDATE
exports.updateExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid expense id" })
    }

    const { title, amount, category, type } = req.body

    if (!title || !amount || !type) {
      return res.status(400).json({ error: "Title, amount, and type are required" })
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" })
    }

    const amountValue = Number(amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: "Amount must be positive" })
    }

    const updatedExpense = await expenseModel.updateExpense(
      id,
      title,
      amountValue,
      category || null,
      type,
      req.user.id
    )

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" })
    }

    res.json(updatedExpense)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Update failed" })
  }
}

// ✅ DELETE
exports.deleteExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid expense id" })
    }

    const deleted = await expenseModel.deleteExpense(id, req.user.id)

    if (!deleted) {
      return res.status(404).json({ error: "Expense not found" })
    }

    res.json({ message: "Expense deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Delete failed" })
  }
}

// ✅ TOTAL
exports.getTotalExpenses = async (req, res) => {
  try {
    const total = await expenseModel.getTotalExpenses(req.user.id)
    res.json({ total })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get total" })
  }
}

// ✅ CATEGORY SUMMARY
exports.getCategorySummary = async (req, res) => {
  try {
    const summary = await expenseModel.getCategorySummary(req.user.id)
    res.json(summary)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get summary" })
  }
}

// ✅ MONTHLY
exports.getMonthlyExpenses = async (req, res) => {
  try {
    const data = await expenseModel.getMonthlyExpenses(req.user.id)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get monthly data" })
  }
}

// ✅ BALANCE
exports.getBalance = async (req, res) => {
  try {
    const data = await expenseModel.getBalance(req.user.id)
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get balance" })
  }
}