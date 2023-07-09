const User_Model = require("../models/user");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  const { userData } = req.body;
  console.log({ userData });
  try {
    let newUser = new User_Model(userData);
    let responseData = await newUser.save();
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const userLogin = async (req, res) => {
  const { userInfo } = req.body;
  console.log({ userInfo }, "req", req.body);
  try {
    let checkUser = await User_Model.findOne({
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
    });
    const userDataToken = {
      first: checkUser.firstName,
      lastName: checkUser.lastName,
      userName: checkUser.userName,
    };
    if (checkUser) {
      let token = jwt.sign(userDataToken, process.env.SECRETE_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(403).json({ err: "wrong pass or username" });
  }
};

const getHomePage = (req, res) => {
  res.send(req.user);
};

module.exports = { userSignUp, userLogin, getHomePage };
