const express = require("express");
const router = express.Router();
const User = require("../database/schemas/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;

		// Check if the email or username is already registered
		const existingEmail = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });

		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = await User.create({
			name,
			username,
			email,
			password: hashedPassword,
			profileImage: null,
			phoneNumber: null,
			address: null,
			comments: [],
			books: [],
		});

		// add the user also to chat engine

		const data = {
			username: username,
			first_name: name,
			secret: password,
			// custom_json: { high_score: 2000 },
		};
		// https://api.chatengine.io/users/
		const url = "https://api.chatengine.io/users/";

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"PRIVATE-KEY": "77313c5c-1e04-480e-9154-1d8fdd9bfbdb",
			},
			body: JSON.stringify(data),
		};

		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Network response was not ok: ${response.statusText} - ${errorText}`,
				);
			}
			const responseData = await response.json();
			console.log("Success:", responseData);
			return responseData;
		} catch (error) {
			console.error("Error:", error);

			new Error(`Network response was not ok: `);
		}

		res.status(201).json({
			message: "User created successfully",
			status: 200,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
};

exports.updateUser = async (req, res) => {
	try {
		console.log("we are here");
		const user = req.body;
		console.log(user);

		const update = {
			name: req.body.name,
			email: req.body.email,
			phoneNumber: req.body.phoneNumber,
			address: req.body.address,
			profileImage:
				"http://localhost:5000/images/" +
				req.file.path.split("\\").pop(),
		};

		let doc = await User.findOneAndUpdate(
			{ username: req.body.username },
			update,
		);

		console.log(update);

		if (doc) {
			// User updated successfully
			res.status(200).json({ message: "User updated successfully" });
		} else {
			// User not found or update failed
			res.status(404).json({ error: "User not found or update failed" });
		}
	} catch (error) {
		console.error(error);
		// Server error
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.getUser = async (req, res) => {
	try {
		const { username } = req.query;
		const user = await User.findOne({ username: username });
		const data = {
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			username: user.username,
			profileImage: user.profileImage,
		};
		console.log(data);
		await res.json(data);
	} catch (error) {
		console.error(error);
	}
};

exports.getUserInfo = async (req, res) => {
	try {
		const { username } = req.query;
		// Fetch the user and exclude the password field
		const user = await User.findOne({ username: username }).select(
			"-password",
		);

		const rating = user.comments.length
			? user.comments.reduce((acc, comment) => acc + comment.rating, 0) /
				user.comments.length
			: 0;

		// add rating to user data

		// Construct response data
		const data = {
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			profileImage:
				user.profileImage || "http://localhost:5000/images/profile.png",
			phoneNumber: user.phoneNumber || "No phone number provided",
			address: user.address || "No address provided",
			comments: user.comments,
			books: user.books,
			rating: rating,
		};

		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User not found",
			});
		}

		res.status(200).json({
			status: "success",
			data: data,
		});
	} catch (error) {
		res.status(500).json({
			status: "fail",
			message: error.message,
		});
	}
};

exports.checkUser = async (req, res) => {
	try {
		const { email, password, currentUsername } = req.body;

		console.log(req.body);

		// Check if the user exists
		const user = await User.findOne({ username: req.body.username });

		if (!user) {
			console.log(currentUsername);

			return res.status(404).json({ message: "User not found" });
		}

		// Compare passwords
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}

		// If the password is correct, create a JWT token

		// const token = jwt.sign(
		// 	{
		// 		userId: user._id,
		// 		email: user.email,
		// 	},
		// 	process.env.JWT_SECRET,
		// 	{ expiresIn: "1h" },
		// );

		res.status(200).json({
			message: "Authentication successful",
			// token: token,
			// userId: user._id,
			// expiresIn: 3600,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
};
