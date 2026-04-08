const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id, email) => {
  const jwtSecret = "secret3001";
  return jwt.sign({ id, email }, jwtSecret, { expiresIn: "1d" });
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    const existedUser = await User.findOne({
      email: String(email).toLowerCase(),
    });

    if (existedUser) {
      return res.status(409).json({
        message: "this mail is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "user registered successfully",
      data: {
        user: serializeUser(newUser),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error while registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required!",
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(String(user._id), user.email);

    return res.json({
      message: "Login successful.",
      data: {
        token,
        user: serializeUser(user),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging in.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: "Authenticated user fetched successfully.",
      data: {
        user: serializeUser(user),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching authenticated user.",
    });
  }
};

const listUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password")
      .sort({ name: 1 });

    return res.json({
      message: "Users fetched successfully.",
      data: {
        users: users.map(serializeUser),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching users.",
    });
  }
};

module.exports = { register, login, getMe, listUsers };
