const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const RoomSchema = new Schema({
  roomName: {
    type: String,
    require: true,
  },
  owner: {
    type: String,
    require: true,
    default: "huykt",
  },
  productName: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  priceStep: {
    type: Number,
    require: true,
  },
  amounts: {
    type: Number,
    require: true,
  },
  image: {
    data: {
      type: Buffer,
      require: true,
    },
    imageType: {
      type: String,
      required: true,
    },
  },
  initialPrice: {
    type: Number,
    require: true,
  },
  lastingTime: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  bannedUsers: {
    type: [String],
  },
  status: {
    type: String,
  },
  history: {
    type: [
      {
        user: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  startAt: {
    type: Number,
  },
  victoryPhoneNumber: {
    type: String,
  },
});

module.exports = mongoose.model("room", RoomSchema);
