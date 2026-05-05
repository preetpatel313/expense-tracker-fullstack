const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

// Check JWT secret
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env")
}

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userModel.createUser(name, email, hashedPassword)

    // 🔥 Generate token after signup
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Signup failed" })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    const user = await userModel.findUserByEmail(email)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Login failed" })
  }
}

// GET CURRENT USER (Protected Route)
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({ error: "Invalid token" })
    }

    const user = await userModel.findUserById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
}