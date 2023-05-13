const express = require("express");
const upload = require("../config/multerConfig");
const { register, login, getUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(upload.single("pic"), register);
router.route("/").get(protect ,getUsers);

module.exports = router;
