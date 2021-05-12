const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  type: { type: Number },
});
const User = mongoose.model("user", UserSchema);

module.exports = User;
