const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// 🔐 Auth Routes

// Register User
router.post("/signup", authController.signup);

// Login User
router.post("/login", authController.login);

router.get("/user", async (req, res) => {
  try {
    const email = req.query.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;