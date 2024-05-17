const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Book = require("./database/schemas/books");
const { connectToDb } = require("./database/db");
const bookRouter = require("./routes/bookRoutes"); // importing routes
const userRouter = require("./routes/authRoutes"); // importing routes
const CommentRouter = require("./routes/commentRoutes"); // importing routes
const { static } = require("express");
const fileSystem = require("./file/fileSystem");
require("dotenv").config();

const app = express();

// app.post("/api/upload", fileSystem.uploadAvatar(), function (req, res, next) {
// 	res.json(req.file.path.split("\\").pop());
// });

// here we can use this to make the url of the image

// the form is :

// the server/images/the name of the image

app.use("/images/", static("assets/cover"));
app.use("/images/", static("assets/avatar"));
app.use("/icons/", static("assets/icons"));
app.use("/ad/", static("assets/ad"));

app.use((req, res, next) => {
	connectToDb(async (err) => {
		if (!err) {
			next();
		} else {
			res.send(err);
		}
	});
});

// Enable CORS
app.use(cors());

// CORS configuration
const corsOptions = {
	origin: "https://rofof-api-production.up.railway.app", // Set this to your frontend's URL
	credentials: true, // This allows the backend to accept cookies from the frontend
};

app.use(cors(corsOptions));
// 1) MIDDLEWARES

// this is a 3rd party middleware that will log the request to the console in a dev format
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());
/** this is a middleware that will parse the incoming request body into json format
    because if we did not use that the body of the request will be undefined
    this middleware will add a body property to the request object
    so that we will be able to handle the incoming data in a post request for example, req.body
**/

//  meddleware to get the date of the request
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/**  example a standerd API structure
    books array will be fetched from the database
    resources that we will have: books, users, reviews, etc.
    versions are used because we do not break the api when we make changes
    You can test the api using postman VERY IMPORTANT
    for each resource we need to create appropriate routes for each of the CRUD operations
    all APIs must follow the RESTful conventions 
    GET /api/v1/books - get all books
    GET /api/v1/books/id - get a single book by id
    POST /api/v1/books - create a new book
    PATCH /api/v1/books/id - update a book by id
    DELETE /api/v1/books/id - delete a book by id
*/

// 2) ROUTES

// app.use("http://localhost:5000/api/v1/users", userRouter);

// app.post("/signup", async (req, res) => {

//   const name = req.body.name;
//   const email= req.body.email;
//   const username = req.body.username;
//   const password = req.body.password;

//   const encryptedPassword= await bcrypt.hash(password,10)

//   try{
//     const sameUsername = await User.findOne({ emails });
//     const sameEmail = await User.findOne({email});
//     if(sameUsername || sameEmail){
//       return res.send({error: "user exist"})
//     }
//     console.log("here")
//     await User.create({
//       name: name,
//       email: email,
//       username: username,
//       password:encryptedPassword,
//     });

//     res.send({ status: "ok"})
//   } catch(error){
//     res.send({status: "error"})
//   }

// });

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", CommentRouter);

/**
 *
 *
 *
 *
 */

app.get("/", (req, res) => {
	res.status(200).send("<h1>welcome to our server :> <h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.post("/", (req, res) => {
	res.send("This is a post request");
});

app.post("/books", async (req, res) => {});

module.exports = app;
