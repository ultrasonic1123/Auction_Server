const User = require("../models/user");
const Room = require("../models/room");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const userSignUp = async (req, res) => {
  const { userData } = req.body;
  console.log({ userData });
  try {
    let newUser = new User(userData);
    let responseData = await newUser.save();
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const userLogin = async (req, res) => {
  const { userInfo } = req.body;
  try {
    let checkUser = await User.findOne({
      phoneNumber: userInfo.phoneNumber,
      password: userInfo.password,
    });
    const userDataToken = {
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
    };
    if (checkUser) {
      let token = jwt.sign(userDataToken, process.env.SECRETE_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({
        token,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        phoneNumber: checkUser.phoneNumber,
      });
    }
  } catch (err) {
    res.status(403).json({ err: "wrong pass or username" });
  }
};

const getHomePage = async (req, res) => {
  res.send(req.user);
};

const createRoom = async (req, res) => {
  console.log("check", req.body.room, req.file);
  const room = JSON.parse(req.body.room);
  const image = {
    data: fs.readFileSync(__dirname + "/../uploads/" + req.file.filename),
    imageType: req.file.mimetype,
  };
  room.image = image;
  console.log("room", room);
  try {
    const newRoom = await Room.create(room);
    res.status(200).json(newRoom);
  } catch (e) {
    console.log("Create new auction fail", e);
  }
};

const getRooms = (req, res) => {
  Room.find({}).then((data, err) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(data);
  });
};

const getRoomsByCategory = async (req, res) => {
  const query = req.query;
  let data = await Room.find(query);
  res.status(200).json(data);
};

const updateOwnRoom = async (req, res) => {
  let result = {
    success: false,
    data: null,
    message: "",
  };
  const phoneNumber = req.body.phoneNumber;
  const roomId = req.body.room;
  try {
    let updatedUser = await User.findOneAndUpdate(
      { phoneNumber },
      { $push: { rooms: roomId } },
      {
        returnOriginal: false,
      }
    );
    result.success = true;
    result.data = updatedUser;
    result.message = "success";
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    result.message = "err when update user";
    res.status(500).json(result);
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getHomePage,
  createRoom,
  getRooms,
  getRoomsByCategory,
  updateOwnRoom,
};
