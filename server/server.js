const express = require("express");
const app = express();
const PORT = 5000;

// Connect to the database by importing the database configuration
require("./lib/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/user");

// Use the user route for any requests at the '/user' path
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
