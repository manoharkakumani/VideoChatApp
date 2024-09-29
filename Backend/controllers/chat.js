import Chat from "../models/chat.js";
import User from "../models/user.js";

export const createChat = async (req, res) => {
  try {
    const { members } = req.body;
    let chat = new Chat({ user: members });
    chat = await chat.save();

    const [myid, friendid] = members;
    const user = await User.findById(myid);
    const friend = await User.findById(friendid);

    user.chat.push(chat._id);
    friend.chat.push(chat._id);

    // Update the user's friend list with the new chat reference
    user.friends = user.friends.map((f) => {
      if (f._id.toString() === friendid) {
        return { ...f._doc, chat: chat._id };
      }
      return f;
    });

    // Update the friend's friend list with the new chat reference
    friend.friends = friend.friends.map((f) => {
      if (f._id.toString() === myid) {
        return { ...f._doc, chat: chat._id };
      }
      return f;
    });

    await user.save();
    await friend.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getChatbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id).populate("messages");
    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: `Chat with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findByIdAndDelete(id);
    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: `Chat with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
