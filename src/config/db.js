const mongoose = require("mongoose");

// async function neeed for await
const connectDB = async () => {
  const mongoUrl =
    "mongodb+srv://linhttn14_db_user:@mongo2026@cluster0.b1mxzxz.mongodb.net/?appName=Cluster0/tt4-2920-backend";

  await mongoose.connect(mongoUrl);

  console.log("mongoDB connected successfully");
};

module.exports = { connectDB };
