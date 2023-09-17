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
  console.log("check", req.file);
  const room = JSON.parse(req.body.room);
  const image = {
    data: fs.readFileSync(__dirname + "/../uploads/" + req.file.filename),
    imageType: req.file.mimetype,
  };
  room.image = image;
  console.log("room", room, room.bannedUsers);
  if (room.bannedUsers) {
    room.bannedUsers = room.bannedUsers.split(",");
  }
  try {
    const newRoom = await Room.create(room);
    res.status(200).json(newRoom);
  } catch (e) {
    console.log("Create new auction fail", e);
  }
};

const modifyRoom = async (req, res) => {
  console.log("check", req.body, req.file);
  const room = JSON.parse(req.body.room);
  console.log("Checker", room.status);
  if (room.status === "active") {
    room.startAt = Date.now();
  }
  console.log("room", room);
  if (req.file) {
    const image = {
      data: fs.readFileSync(__dirname + "/../uploads/" + req.file.filename),
      imageType: req.file.mimetype,
    };
    room.image = image;
  }
  try {
    const updatedRoom = await Room.findOneAndUpdate({ _id: room._id }, room);
    res.status(200).json(updatedRoom);
  } catch (e) {
    console.log("Update auction room fail", e);
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

const updateVictoryRooms = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const roomId = req.body.room;
  try {
    let updatedUser = await User.findOneAndUpdate(
      { phoneNumber },
      { $push: { victoryRooms: roomId } },
      {
        returnOriginal: false,
      }
    );
    res.status(201).json(updatedUser);
  } catch (e) {
    console.log(e);
    result.message = "err when update user";
    res.status(500).json(e);
  }
};

const getUserInformationByPhone = async (req, res) => {
  const phoneNumber = `+${req.query.phoneNumber.trim()}`;
  try {
    let user = await User.findOne({ phoneNumber });
    res.status(200).json(user);
  } catch (e) {
    console.log(e, "Get user failed");
  }
};

const getOwnRooms = async (req, res) => {
  let ids = req.body.ids;
  try {
    let rooms = await Room.find({
      _id: {
        $in: ids,
      },
    });
    res.status(200).json(rooms);
  } catch (e) {
    console.log("Get own rooms failed", e);
  }
};

const updateStartAt = async (req, res) => {
  try {
    let result = await Room.findOneAndUpdate(
      { _id: req.body._id },
      { startAt: req.body.startAt }
    );
    res.status(200).json(result);
  } catch (e) {
    console.log("Update start at failed", e);
    res.status(500);
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    let startAt = null;
    if (req.body.status === "active") startAt = Date.now();
    let updatedRoom = await Room.findOneAndUpdate(
      { _id: req.body.id },
      { status: req.body.status, startAt }
    );
    res.status(200).json(updatedRoom);
  } catch (e) {
    console.log("Update room status failed", e);
    res.status(500).json(e);
  }
};

const updateRoomHistory = async (req, res) => {
  try {
    let updatedRoom = await Room.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { history: req.body.history } }
    );
    res.status(200).json(updatedRoom);
  } catch (e) {
    console.log("Update room status failed", e);
    res.status(500).json(e);
  }
};

const searchRooms = async (req, res) => {
  let query = req.query;
  try {
    let searchResult = await Room.find({
      roomName: { $regex: `${query.roomName}`, $options: "i" },
    });
    res.status(200).json(searchResult);
  } catch (e) {
    console.log("Search room status failed", e);
    res.status(500).json(e);
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
  getUserInformationByPhone,
  getOwnRooms,
  modifyRoom,
  updateStartAt,
  updateRoomStatus,
  updateRoomHistory,
  updateVictoryRooms,
  searchRooms,
};
