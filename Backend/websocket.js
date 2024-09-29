// websocketServer.js

import User from "./models/user.js";
import Chat from "./models/chat.js";
import Message from "./models/message.js";

import { WebSocketServer, WebSocket } from "ws";

const clients = {};

const handleSignalingData = (message) => {
  console.log("Handling signaling data:", message);
  const { fromUserId, toUserId, type, ...data } = message;
  if (clients[toUserId]) {
    sendTo(toUserId, { type, fromUserId, ...data });
  }
};

const handleVideoChannels = async (message) => {
  const { fromUserId, toUserId, chatId, type, messageId } = message;
  console.log("Handling video channel:", message);

  if (!clients[toUserId]) {
    console.log(`User ${toUserId} is not connected`);
    return;
  }

  switch (type) {
    case "call":
      const fromUser = await User.findById(fromUserId).select("name _id");
      const chat = await Chat.findById(chatId);
      const newMessage = new Message({
        sender: fromUserId,
        type: "call",
        message: { call: "Video call" },
      });
      const videoMessage = await newMessage.save();
      chat.messages.push(newMessage._id);
      chat.lastMessage = "Video call";
      await chat.save();
      sendTo(toUserId, {
        fromUser,
        channel: "video",
        type,
        messageId: videoMessage._id,
      });
      break;

    case "call-accepted":
    case "call-declined":
      const callMessage = await Message.findById(messageId);
      callMessage.message.call =
        type === "call-accepted" ? "Call accepted" : "Call declined";

      await callMessage.save();
      sendTo(toUserId, { channel: "video", type, fromUserId, toUserId });
      break;

    case "call-canceled":
    case "call-ended":
      sendTo(toUserId, { channel: "video", type, fromUserId, toUserId });
      break;
    default:
      console.log("Unknown video type:", message);
  }
};

const handleChatChannels = async (message) => {
  const { chatId, type, userId, toUserId, content } = message;

  let formattedContent = {};

  if (type === "text") {
    formattedContent = {
      text: {
        original: {
          language: content.language,
          text: content.text,
        },
        translated: {
          language: "en",
          text: content.text,
        },
      },
    };
  }

  const newMessage = new Message({
    chat: chatId,
    sender: userId,
    message: formattedContent,
    type,
  });
  const savedMessage = await newMessage.save();
  const chat = await Chat.findById(chatId);
  chat.messages.push(newMessage._id);
  chat.lastMessage = content.text;
  await chat.save();

  const finalMessage = {
    chatId,
    channel: "chat",
    message: {
      ...savedMessage._doc,
    },
  };
  sendTo(userId, finalMessage);
  sendTo(toUserId, finalMessage);
};

const updateUsersOnlineStatus = async (userId, isOnline) => {
  const user = await User.findById(userId);
  user.isOnline = isOnline;
  await user.save();
};

const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    // Extract userId and role (user/tower) from URL
    const urlParts = req.url.split("/");
    const userId = urlParts.pop();
    console.log(`Connection established for ${userId}`);
    clients[userId] = ws;

    console.log("Clients:", Object.keys(clients));

    updateUsersOnlineStatus(userId, true);
    ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage.channel) {
        case "video":
          handleVideoChannels(parsedMessage); // signaling server
          break;
        case "chat":
          handleChatChannels(parsedMessage);
          break;
        case "signal":
          handleSignalingData(parsedMessage);
          break;

        default:
          console.log("Unknown channel:", parsedMessage);
      }
    });

    ws.on("close", () => {
      console.log(`Connection closed for ${userId}`);
      updateUsersOnlineStatus(userId, false);
      delete clients[userId];
    });
  });

  return wss;
};

const sendTo = (userId, message) => {
  const userSocket = clients[userId];
  if (userSocket && userSocket.readyState === WebSocket.OPEN) {
    userSocket.send(JSON.stringify(message));
    return true;
  }
  return false;
};

export { initializeWebSocketServer, sendTo };
