const path = require("path");
const dotenv = require("dotenv");
const http = require("http");

// dotenv.config({path: path.resolve(__dirname, "../.env")})
dotenv.config();

const app = require("./app");
const { connectDB } = require("./config/db");
const { initializeSocket } = require("./utils/socketManager");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log("server is running on port", PORT);
    });
  } catch (error) {
    console.log("failed to start server:  ", error);
    process.exit(1);
  }
};

// actually start the server
startServer();
