const express = require("express");
const bookController = require("../controllers/bookController");
const fileSystem = require("../file/fileSystem");

const router = express.Router();

router.get("/recommendations", bookController.getRecommendations);

router.param("id", bookController.checkId);

router
	.route("/")
	.get(bookController.getAllBooks)
	.post(fileSystem.uploadCover(), bookController.createNewBook);
router
	.route("/:id")
	.get(bookController.getBook)
	.patch(bookController.updateBook)
	.delete(bookController.deleteBook);

module.exports = router;
