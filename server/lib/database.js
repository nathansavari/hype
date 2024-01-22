const mongoose = require("mongoose");
require("dotenv").config();

const options = {
  connectTimeoutMS: 5000,
};

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7sij3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  options
);

module.exports = mongoose;
