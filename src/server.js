const path = require("path");
const dotenv = require("dotenv");

// dotenv.config({path: path.resolve(__dirname, "../.env")})
dotenv.config();

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("server is running ... ");
    });
  } catch (error) {
    console.log("failed to start server:  ", error);
    process.exit(1);
  }
};

// actually start the server
startServer();
