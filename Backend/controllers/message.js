import Message from "../models/message.js";
import Chat from "../models/chat.js";

export const createMessage = async (req, res) => {
  try {
    const { chatId, text, sender } = req.body;
    const message = await Message.create({ text, sender });
    const chat = await Chat.findById(chatId);
    chat.messages.push(message);
    chat.lastMessage = text;
    await chat.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate("messages");
    if (chat) {
      res.status(200).json(chat.messages);
    } else {
      res.status(404).json({ message: `Chat with id ${chatId} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: `Message with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: `Message with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
