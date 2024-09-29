import express from "express";
import * as chatController from "../controllers/chat.js";

const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
  res.send("Hello from chat");
});

chatRouter.post("/", chatController.createChat);
chatRouter.get("/:id", chatController.getChatbyId);
chatRouter.delete("/:id", chatController.deleteChat);

export default chatRouter;
