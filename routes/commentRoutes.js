const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");



router.get("/", commentController.getComment);
router.post("/comment/", commentController.addComment);


module.exports = router;
