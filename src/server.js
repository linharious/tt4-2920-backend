const app = require("./app");
const { connectDB } = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log("server is running ... ");
    });
  } catch (error) {
    console.log("failed to start server:  ", error);
    process.exit(1);
  }
};

// actually start the server
startServer();
