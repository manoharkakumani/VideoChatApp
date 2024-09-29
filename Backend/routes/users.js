import express from "express";
import * as userController from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from users");
});
userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", userController.signInUser);
userRouter.get("/:id", userController.getUser);
userRouter.get("/:id/friend/:friendId", userController.getFriend);
userRouter.get("/friends/:id", userController.getFriends);
userRouter.get("/chats/:id", userController.getChats);
userRouter.post("/addFriend", userController.addFriend);

export default userRouter;
