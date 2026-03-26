// all the routes related to authentication
// export the modules and import into the app.js

const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// not all language will allow to pass a body through post request

module.exports = router;
