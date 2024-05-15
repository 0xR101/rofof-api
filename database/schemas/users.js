const mongoose = require("mongoose");

// driven attribute is rate

const userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, unique: true },
	username: { type: String, unique: true },
	password: String,
	profileImage: String, // it should be the url of the image
	phoneNumber: String,
	address: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("User", userSchema);

// aggregate.lookup({ from: 'users', localField: 'userId', foreignField: '_id', as: 'users' });

// const commentSchema = new mongoose.Schema({
//   image: String, // URL to image
//   rating: Number,
//   userName: String, // Username of the commenter
//   content: String,
//   date: { type: Date, default: Date.now }
// });

// here we might check if we connect to the database

// const newUser = new User({
//   name: "John Doe",
//   email: "john@example.com",
//   username: "johnny",
//   password: "hashedPassword", // You should hash the password before saving it
//   profileImage: "https://example.com/profile.jpg",
//   phoneNumber: "1234567890",
//   address: "123 Main St, City, Country",
//   comments: [
//     {
//       image: "https://example.com/comment_image.jpg",
//       rating: 4,
//       userName: "commenter123",
//       content: "Great user!",
//       date: new Date(),
//     },
//   ],
//   offers: ["Offer 1", "Offer 2"], // Example offers
//   listedBooks: ["Book 1", "Book 2"], // Example listed books
// });

// newUser
//   .save()
//   .then((savedUser) => {
//     console.log("User saved successfully:", savedUser);
//   })
//   .catch((error) => {
//     console.error("Error saving user:", error);
//   });

// this object is the one we will use to deal with the database

// console.lg(db)
