const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/group/rename").put(protect, renameGroupChat);
router.route("/group/add").put(protect, addToGroup);
router.route("/group/remove").put(protect, removeFromGroup);

module.exports = router;
