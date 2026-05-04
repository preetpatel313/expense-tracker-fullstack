const jwt = require("jsonwebtoken")

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" })
  }

  const parts = authHeader.split(" ")

  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({ error: "Invalid authorization format" })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" })
    }

    return res.status(401).json({ error: "Invalid token" })
  }
}