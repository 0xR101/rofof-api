// - GET /api/v1/books
const Book = require("../database/schemas/books");
const User = require("../database/schemas/users");

const validGenres = [
	"actionAdventure",
	"classics",
	"fantasy",
	"historicalFiction",
	"horror",
	"literaryFiction",
	"mysteryThriller",
	"romance",
	"scienceFiction",
	"shortStories",
	"westerns",
	"youngAdult",
	"artsPhotography",
	"biographyMemoir",
	"businessEconomics",
	"computersTechnology",
	"cookingFoodWine",
	"history",
	"politicsSocialSciences",
	"reference",
	"religionSpirituality",
	"selfHelp",
	"travel",
	"comicsGraphicNovels",
	"childrensBooks",
	"magazinesNewspapers",
];

// get that user that is asscoiated with this ID
async function getUser(userId) {
	const user = await User.findOne({
		_id: userId,
	});
	return user;
}

// check id middleware
exports.checkId = (req, res, next, val) => {
	if (req.params.id * 1 > Book.length || req.params.id * 1 < 0) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}
	console.log(`Book id is: ${val}`);
	next();
};

// All book CRUD operations handlers
exports.getAllBooks = async (req, res) => {
	try {
		const { search, genre, sort, offerType, seller } = req.query;
		let filter = {};

		if (genre) {
			if (!validGenres.includes(genre)) {
				return res.status(400).json({
					status: "fail",
					message:
						"Invalid genre provided. Please choose a valid genre.",
				});
			}
			filter.genre = { $in: [genre] };
		}
		if (offerType) {
			// Split the offerType string into an array by commas
			const offerTypes = offerType.split(",");
			filter.offerType = { $in: offerTypes };
		}
		if (seller) {
			filter.seller = seller;
		}

		let sortOptions = {};
		if (sort === "priceAsc") sortOptions.price = 1;
		if (sort === "priceDesc") sortOptions.price = -1;
		if (sort === "dateAsc") sortOptions.listingDate = 1;
		if (sort === "dateDesc") sortOptions.listingDate = -1;
		if (search) {
			// Add a search filter that checks multiple fields using regex
			filter.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ author: { $regex: search, $options: "i" } },
			];
		}
		const books = await Book.find(filter).sort(sortOptions);

		res.status(200).json({
			status: "success",
			results: books.length,
			data: {
				books,
			},
		});
	} catch (err) {
		console.error("Error fetching books based on filters:", err);
		res.status(500).json({
			status: "error",
			message: "Internal Server Error",
		});
	}
};

// - GET using a variable route parameter
exports.getBook = async (req, res) => {
	const { id } = req.params;
	console.log(id);

	try {
		const book = await Book.findOne({ _id: id });

		res.status(200).json({
			status: "success",
			data: {
				book,
			},
		});

		console.log(book);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: "error",
			message: "Internal Server Error",
		});
	}
};

// - PATCH /api/v1/books/id
exports.updateBook = (req, res) => {
	// here we are missing the database logic to update the book in the database

	res.status(200).json({
		status: "success",
		data: {
			book: "Updated book",
		},
	});
};

// - POST /api/v1/books

exports.createNewBook = async (req, res) => {
	try {
		// Assuming user ID comes from authenticated session or token

		const {
			title,
			description,
			ISBN,
			author,
			genre,
			offerType,
			bookCondition,
			price,
			publicationYear,
			numberOfPages,
			username,
		} = req.body;

		// consol log all the data
		console.log(req.body);

		const newBook = new Book({
			image:
				"https://rofof-api-production.up.railway.app/images/" +
				req.file.path.split("\\").pop(),
			title,
			description,
			ISBN: JSON.parse(ISBN), //
			listingDate: new Date(), // Automatically set the listing date
			author,
			genre: JSON.parse(genre), // Assuming genre comes as a JSON stringified array
			offerType,
			bookCondition,
			price,
			publicationYear,
			numberOfPages,
			seller: username, // Link the book to the user who posted it
		});

		await newBook.save(); // Save the book to the database

		// Add the book to the user's list of books
		await User.findOneAndUpdate(
			{ username: username },
			{ $push: { books: newBook._id } },
		);

		res.status(201).json({
			status: "success",
			data: {
				book: newBook,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error.message,
		});
	}
};
// - DELETE /api/v1/books/id
exports.deleteBook = (req, res) => {
	// here we are missing the database logic to delete the book from the database

	res.status(204).json({
		status: "success",
		data: null,
	});
};

exports.getRecommendations = async (req, res) => {
	try {
		const recentBooks = await Book.find()
			.sort({ listingDate: -1 })
			.limit(6);

		await res.status(200).json({
			status: "success",
			data: {
				books: recentBooks,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: "error",
			message: "Internal Server Error",
		});
	}
};
