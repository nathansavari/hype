const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    token: String,
    password: String,
    lastAccess: Date,
  },
  {
    timestamps: true,
  }
);

// Create a model from the schema to interact with 'users' collection in the database
const User = mongoose.model("users", userSchema);

module.exports = User;
