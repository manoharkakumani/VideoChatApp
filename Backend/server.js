import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./routes/users.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/messages.js";

import { initializeWebSocketServer } from "./websocket.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/mchat");

mongoose.connection.on("connected", () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  initializeWebSocketServer(server);
});
