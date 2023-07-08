const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const RefreshToken = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("refreshToken", RefreshToken);
