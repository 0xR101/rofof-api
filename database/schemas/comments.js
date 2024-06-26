const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	image: String,
	rating: Number,
	username: String,
	content: String,
	date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Comment", commentSchema);
