// USING COOKIES
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 4000;
const SECRET = "xss-demo-secret";
const users = [];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }
  users.push({ email, password });
  res.json({ message: "User registered" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ success: true });
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/send-money", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Money sent!!!");

    res.json({ status: "Money sent!!!!" });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logged out" });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
