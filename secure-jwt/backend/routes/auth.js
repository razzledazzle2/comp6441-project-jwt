// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashed,
    ]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Email already exists or server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "24h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true, // set true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
});

function authenticateToken(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user; // attach user info to request
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Check auth status - protected route 
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
