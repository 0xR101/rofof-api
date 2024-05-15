const multer = require("multer");

const coverStorage = multer.diskStorage({
	destination: "assets/cover",
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = file.originalname.split(".").pop();

		const fileNameWithExtension =
			file.fieldname + "-" + uniqueSuffix + "." + fileExtension;
		cb(null, fileNameWithExtension);
	},
});

const avatarStorage = multer.diskStorage({
	destination: "assets/avatar",
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const fileExtension = file.originalname.split(".").pop();

		const fileNameWithExtension =
			file.fieldname + "-" + uniqueSuffix + "." + fileExtension;
		cb(null, fileNameWithExtension);
	},
});

exports.uploadCover = () => multer({ storage: coverStorage }).single("image");
exports.uploadAvatar = () => multer({ storage: avatarStorage }).single("image");
