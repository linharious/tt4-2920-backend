const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "auth token is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = "secret3001";
    const decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { authMiddleware };
