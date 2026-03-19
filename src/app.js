const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
// return express module

// access to endpoint
// everytime will need to pass 2 params

app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  //   res.send("<h1>some html</h1>");
  //   everytime needs to return sth to get out of this function callback
  return res.json({
    message: "endpoint home is working!",
  });
});

app.post("/test", (req, res) => {
  return res.json({
    message: "endpoint home is working!",
    data: {
      ok: true,
      age: 99,
    },
  });
});

app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("server is running ... on port 3000");
});
