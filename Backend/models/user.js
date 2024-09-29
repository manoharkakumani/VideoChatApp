import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  status: { type: String, default: "Hey there! I am using mChat" },
  friends: [
    {
      friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
  ],
  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  language: { type: String, default: "en" },
  image: { type: String },
});

const User = mongoose.model("User", UserSchema);

export default User;
