const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
const connectedUsers = new Map(); // Map of userId -> Set of socket IDs

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || "secret3001";
      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Track connected users
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    console.log(`User ${userId} connected with socket ${socket.id}`);

    // When user disconnects
    socket.on("disconnect", () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      console.log(`User ${userId} disconnected from socket ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

// Broadcast task events to all connected clients
const broadcastTaskEvent = (eventName, taskData) => {
  if (io) {
    io.emit(eventName, taskData);
  }
};

// Emit event to specific user
const emitToUser = (userId, eventName, data) => {
  if (io && connectedUsers.has(userId)) {
    const userSockets = connectedUsers.get(userId);
    userSockets.forEach((socketId) => {
      io.to(socketId).emit(eventName, data);
    });
  }
};

module.exports = {
  initializeSocket,
  getIO,
  broadcastTaskEvent,
  emitToUser,
};
