import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  message: {
    text: {
      original: {
        language: { type: String },
        text: { type: String },
      },
      translated: {
        language: { type: String },
        text: { type: String },
      },
    },
    image: { type: String },
    video: { type: String },
    audio: { type: String },
    file: { type: String },
    call: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
