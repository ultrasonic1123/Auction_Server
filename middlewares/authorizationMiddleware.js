const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
// dotenv.config();

function verifyToken(req, res, next) {
  let authHeader = req.headers.authorization;
  console.log("Check", process.env.SECRETE_KEY, authHeader);
  if (!authHeader) {
    return res.status(400).send("Access denied: No token provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid token");
  }
}

module.exports = { verifyToken };
