const express = require("express");
const router = express.Router();
const fileSystem = require("../file/fileSystem");

const authController = require("../controllers/authController");

router.post("/signup", authController.createUser);
router.post("/signin", authController.checkUser);
router.get("/getUser", authController.getUser);
router.patch(
	"/updateUser",
	fileSystem.uploadAvatar(),
	authController.updateUser,
);
router.get("/getUserInfo", authController.getUserInfo);

module.exports = router;
