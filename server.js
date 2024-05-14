require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const route = require("./routes.js");

const app = express();
app.use(express.json());

app.use('/', route)

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: "1800s", });
}

const login = async (req, res = response) => {
  const { email, password } = req.body;
  // Ideally search the user in a database and validate password, throw an error if not found.
  const user = getUserFromDB({ email, password });

  if (user) {
    const token = generateAccessToken(user?.username);
    res.json({
      token: `Bearer ${token}`,
    });
  } else res.sendStatus(401);
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Ideally search the user in a database and validate password, throw an error if not found.
  const user = getUserFromDB({ email, password });

  if (user) {
    console.log(`${user?.username} is trying to login ..`);
    const token = generateAccessToken(user?.username);
    res.json({
      token: `Bearer ${token}`,
    });
  } else res
    .status(401)
    .json({ message: "The username and password your provided are invalid" });

});

app.listen(7001, () => {
  console.log(process.env.JWT_SECRET);
  console.log("API running on localhost:7001");
});