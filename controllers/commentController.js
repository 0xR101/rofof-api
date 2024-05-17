const User = require("../database/schemas/users");
const Book = require("../database/schemas/books");
const Comment = require("../database/schemas/comments");
const { urlencoded } = require("express");

exports.getComment = async (req, res) => {
	try {
		const commentId = req.body.id;

		const comment = await Comment.findOne({ commentId });

		if (comment) {
			res.status(200).json(comment);
		} else {
			res.status(404).json({ error: "Comment not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.addComment = async (req, res) => {
	try {
		const username = req.body.username;

		// const book = await User.findOne({ username: username });

		const newComment = new Comment({
			image: req.body.image,
			rating: req.body.rating,
			username: req.body.username,
			content: req.body.content,
		});

		await newComment.save();

		await Book.findOneAndUpdate(
			{ username: username },
			{ $push: { comments: newComment._id } },
		);

		res.status(200).json({ message: "Comment added successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
