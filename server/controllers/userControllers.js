const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config(); // Ensure .env variables are loaded

// Register new user
const register = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("Missing fields");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let uploadedImage = null;
    if (req.file) {
      uploadedImage = await cloudinary.uploader.upload(
        `${req.file.destination}/${req.file.filename}`,
        {
          folder: "Chit_Chat/Profile_Pictures",
          resource_type: "image",
        }
      );
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic: req.file ? uploadedImage.secure_url : pic,
    });

    await newUser.save();

    // Remove uploaded file from server
    if (req.file) {
      fs.unlink(`${req.file.destination}/${req.file.filename}`, (err) => {
        if (err) console.error("File cleanup error:", err);
      });
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Account successfully created.",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json("Server error during registration");
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Missing fields");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("This account does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Login successful.", user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json("Server error during login");
  }
};

// Get users based on search query
const getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json("Failed to fetch users");
  }
};

module.exports = { register, login, getUsers };
