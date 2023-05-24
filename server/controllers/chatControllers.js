const { Chat } = require("../models/chat");
const { User } = require("../models/user");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json("UserId not sent with the request");
    return;
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
    return;
  }
  var chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };
  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );
    res.status(200).json(fullChat);
  } catch (error) {
    const err = new Error(error);
    res.status(500).json(err.message);
  }
};

const fetchChats = async (req, res) => {
  try {
    var chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(chats);
  } catch (error) {
    const err = new Error(error);
    res.status(500).json(err.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).json("Fill in all the required fields.");
    return;
  }
  const users = req.body.users;
  if (users < 2) {
    res.status(400).json("More than two users are required to create a group.");
    return;
  }
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: [...users, req.user],
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json(Error(error).message);
  }
};

const renameGroupChat = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json("Chat not found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    res.status(500).json(Error(error).message);
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json("Chat not found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    res.status(500).json(Error(error).message);
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).json("Chat not found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    res.status(500).json(Error(error).message);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
