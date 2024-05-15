const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;
// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
