const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // fix key name
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json("Not authorized, token failed");
    }
  }

  // Moved outside the try block, and wrapped in `if (!token)`
  if (!token) {
    return res.status(401).json("Not authorized, no token");
  }
};

module.exports = { protect };
