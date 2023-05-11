const express = require("express");
const upload = require("../config/multerConfig");
const { register, login } = require("../controllers/userControllers");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(upload.single("pic"), register);

module.exports = router;
