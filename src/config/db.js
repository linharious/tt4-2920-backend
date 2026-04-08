const mongoose = require("mongoose");

// async function neeed for await
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  console.log("mongoDB connected successfully");
};

module.exports = { connectDB };
