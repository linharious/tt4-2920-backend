// all the routes related to authentication
// export the modules and import into the app.js

const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { authMiddleWare } = require("../middleware/authMiddleWare");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleWare, getMe);
router.get("/users", authMiddleware, listUsers);
// router.get("/admin", authMiddleWare, getMe);

// not all language will allow to pass a body through post request

module.exports = router;
