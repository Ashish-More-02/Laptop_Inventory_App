require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/AuthRouter");
const laptopRoutes = require("./routes/LaptopRouter");
const { connectDB } = require("./config/dbConfig");
const cors = require("cors");

const PORT = process.env.PORT;

// creating express app
const app = express();

// Middlewares for index.js file
app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({
    message: "hello world , first api from laptop Inventory management",
  });
});

// auth routes
app.use("/", authRoutes);

// laptop routes
app.use("/api", laptopRoutes);

// Connect to mongodb database , errors handled inside this function
connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
