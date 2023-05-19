const { Chat } = require("../models/chat");
const { Message } = require("../models/message");
const { User } = require("../models/user");

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    if (!content || !chatId) {
      res.status(400).json("Invalid request");
      return;
    }
    var message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(Error(error).message);
  }
};

const allMessages = async (req, res) => {};

module.exports = { sendMessage, allMessages };
