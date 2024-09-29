import express from "express";
import * as messageController from "../controllers/message.js";

const messageRouter = express.Router();

messageRouter.get("/", (req, res) => {
  res.send("Hello from messages");
});

messageRouter.post("/", messageController.createMessage);
messageRouter.get("/:chatId", messageController.getMessages);
messageRouter.get("/:id", messageController.getMessage);
messageRouter.delete("/:id", messageController.deleteMessage);

export default messageRouter;
