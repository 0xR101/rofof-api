const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	image: String, // URL to image
	title: String,
	description: String,
	ISBN: [{ type: String, unique: false }], // it should be unique
	listingDate: Date,
	author: String,
	genre: [{ type: String, default: [] }],
	offerType: String,
	bookCondition: String,
	price: Number,
	publicationYear: Number,
	oldPrice: { type: Number, default: null },
	seller: String, // User name of the seller
	numberOfPages: Number,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of comment IDs
	offerStatus: { type: String, default: "" }, // we can extract (selled bought exchanged or active)
});

module.exports = mongoose.model("Book", bookSchema);

// exports.addCommentToBook = (id) =>{

// }
