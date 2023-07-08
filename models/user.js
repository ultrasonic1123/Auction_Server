const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last name is required"],
  },
  userName: String,
  phoneNumber: {
    type: String,
    required: [true, "phone number is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

module.exports = mongoose.model("user", UserSchema);
