const express = require("express")
const router = express.Router()

const incomeController = require("../controllers/incomeController")
const authMiddleware = require("../middleware/authMiddleware")

// 🔐 Protected Routes
router.get("/", authMiddleware, incomeController.getIncome)

router.post("/", authMiddleware, incomeController.addIncome)

router.put("/:id", authMiddleware, incomeController.updateIncome)

router.delete("/:id", authMiddleware, incomeController.deleteIncome)

module.exports = router