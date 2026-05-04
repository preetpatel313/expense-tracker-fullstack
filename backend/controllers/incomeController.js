const incomeModel = require("../models/incomeModel")

// GET income (user-wise)
exports.getIncome = async (req, res) => {
  try {

    const userId = req.user.id   // ✅ get from token

    const data = await incomeModel.getAllIncome(userId)

    res.json(data)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch income" })
  }
}


// ADD income (user-wise)
exports.addIncome = async (req, res) => {
  try {
    const { source, amount } = req.body
    const userId = req.user.id

    if (!source || !amount) {
      return res.status(400).json({ error: "All fields required" })
    }

    const amountValue = Number(amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" })
    }

    const newIncome = await incomeModel.addIncome(source, amountValue, userId)
    res.status(201).json(newIncome)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to add income" })
  }
}

// UPDATE income (secure)
exports.updateIncome = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid income id" })
    }

    const { source, amount } = req.body
    if (!source || !amount) {
      return res.status(400).json({ error: "All fields required" })
    }

    const amountValue = Number(amount)
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" })
    }

    const updatedIncome = await incomeModel.updateIncome(id, source, amountValue, req.user.id)
    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found" })
    }

    res.json(updatedIncome)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to update income" })
  }
}


// DELETE income (secure)
exports.deleteIncome = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid income id" })
    }

    const userId = req.user.id
    const deletedIncome = await incomeModel.deleteIncome(id, userId)

    if (!deletedIncome) {
      return res.status(404).json({ error: "Income not found" })
    }

    res.json({ message: "Income deleted" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to delete income" })
  }
}