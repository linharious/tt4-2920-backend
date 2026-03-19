const user = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
        //   code: 400,
      });
    }

    const existedUser = await user.findOne({
      email: String(email).toLowerCase(),
    });

    if (existedUser) {
      return res.status(409).json({
        message: "this mail is already registered",
      });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    await user.create({
      name,
      email,
      password: hashedPw,
    });

    // console.log(user);

    return res.status(201).json({
      message: "user registered successfully",
      data: {
        user: {
          id: user_id,
          name: user.name,
          email: user.email,
          createAt: user.createAt,
          updateAt: user.updateAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while registering user",
    });
  }
};

module.exports = { register };
