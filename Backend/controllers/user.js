import User from "../models/user.js";
import Chat from "../models/chat.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (user && password === user.password) {
      user.online = true;
      await user.save();
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        language: user.language,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends").populate("chat");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const { id, friendId } = req.body;
    const chat = new Chat({ users: [id, friendId] });
    await chat.save();
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user && friend) {
      user.friends.push({ friend: friendId, chat: chat._id });
      friend.friends.push({ friend: id, chat: chat._id });
      user.chat.push(chat._id);
      friend.chat.push(chat._id);
      await user.save();
      await friend.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User or friend not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user && friend) {
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      friend.friends = friend.friends.filter((user) => user.toString() !== id);
      await user.save();
      await friend.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User or friend not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all friends of a user
export const getFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate("friends")
      .populate("friends.chat")
      .populate({
        path: "friends.friend",
        select: "name email _id status isOnline lastSeen language",
      });

    if (user) {
      res.status(200).json(user.friends);
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all friends of a user
export const getFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id)
      .populate({
        path: "friends",
        where: { friend: friendId },
        populate: {
          path: "friend",
          select: "name email _id status isOnline lastSeen language",
        },
      })
      .populate({
        path: "friends.chat",
      });

    if (user && user.friends.length > 0) {
      res.status(200).json(user.friends[0]);
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all chats of a user
export const getChats = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends.chat").populate({
      path: "friends.friend",
      select: "name email _id status isOnline lastSeen language",
    });
    const chats = user.friends.filter((friend) =>
      user.chat.includes(friend.chat._id)
    );
    if (user) {
      res.status(200).json(chats);
    } else {
      res.status(404).json({ message: `User with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
