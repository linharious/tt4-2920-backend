const express = require("express");
const authRoutes = require("./routes/authRoutes");
const { connectDB } = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

const app = express();
// return express module

// access to endpoint
// everytime will need to pass 2 params
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

module.exports = app;
