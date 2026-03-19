const mongoose = require("mongoose");

// async function neeed for await
const connectDB = async () => {
  const mongoUrl =
    "mongodb+srv://linhttn14_db_user:%40mongo2026@cluster0.b1mxzxz.mongodb.net/tt4-2920-backend?appName=Cluster0";

  await mongoose.connect(mongoUrl);

  console.log("mongoDB connected successfully");
};

module.exports = { connectDB };
