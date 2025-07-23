const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
