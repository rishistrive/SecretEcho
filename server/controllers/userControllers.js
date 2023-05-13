const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const register = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400).json("Missing fields");
  } else {
    try {
      const user = await User.findOne({ email });
      if (user) {
        res.status(400).json("User already exists");
      } else {
        const hash = await bcrypt.hash(password, 10);
        const result = req.file
          ? await cloudinary.uploader.upload(
              `${req.file.destination}/${req.file.filename}`,
              {
                folder: "Chit_Chat/Profile_Pictures",
                resource_type: "image",
              }
            )
          : "No file uploaded";
        const newUser = new User({
          name,
          email,
          password: hash,
          pic: req.file ? result.secure_url : pic,
        });
        await newUser.save();
        req.file &&
          fs.unlink(`${req.file.destination}/${req.file.filename}`, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        res.status(200).json({
          message: "Account successfully created.",
          user: newUser,
          token,
        });
      }
    } catch (error) {
      const err = new Error(error);
      res.status(500).json(err.message);
      console.log(error);
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json("Missing fields");
  } else {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json("This account does not exist");
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(400).json("Wrong password");
        } else {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });
          res.status(200).json({ message: "Login successful.", user, token });
        }
      }
    } catch (error) {
      const err = new Error(error);
      res.status(500).json(err.message);
      console.log(error);
    }
  }
};

const getUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json(users);
};

module.exports = { register, login, getUsers };
