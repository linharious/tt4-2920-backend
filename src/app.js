const express = require("express");
const authRoutes = require("./routes/authRoutes");
const { connectDB } = require("./config/db");

const app = express();
// return express module

// access to endpoint
// everytime will need to pass 2 params

app.use(express.json());

app.use("/auth", authRoutes);

module.exports = app;
