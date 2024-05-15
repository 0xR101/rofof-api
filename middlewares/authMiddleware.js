// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../database/schemas/users");

const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.error(error);
			res.status(401).json({
				status: "fail",
				message: "Not authorized, token failed",
			});
		}
	} else {
		res.status(401).json({
			status: "fail",
			message: "Not authorized, no token",
		});
	}
};

module.exports = { protect };
