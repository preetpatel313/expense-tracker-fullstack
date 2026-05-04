const express = require("express")
const router = express.Router()

const expenseController = require("../controllers/expenseController")
const authMiddleware = require("../middleware/authMiddleware")

// 🔐 Protected Routes

router.use(authMiddleware)

// Analytics
router.get("/total", expenseController.getTotalExpenses)
router.get("/category-summary", expenseController.getCategorySummary)
router.get("/monthly", expenseController.getMonthlyExpenses)
router.get("/balance", expenseController.getBalance)

// CRUD
router.get("/", expenseController.getExpenses)
router.post("/", expenseController.addExpense)
router.put("/:id", expenseController.updateExpense)
router.delete("/:id", expenseController.deleteExpense)
module.exports = router