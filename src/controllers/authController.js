const register = (req, res) => {
  console.log(res.body);

  const { name, email, password } = req.body;

  console.log(name, email, password);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "name, email, password are required",
      //   code: 400,
    });
  }

  return res.json({
    message: "register endpoint is working!",
  });
};

module.exports = { register };
