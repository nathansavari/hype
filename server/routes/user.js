const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyLastAccess = require("../middleware/verifyLastAccess");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Request to get all the infos on a user
router.post("/getInfos", verifyLastAccess, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.body.token });

    if (user) {
      res.send({
        name: user.name,
        createdAt: user.createdAt,
        email: user.email,
      });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).send({ error: "Invalid ID format" });
    } else {
      res.status(500).send(error);
    }
  }
});

// Connect the user
router.post("/connect", async (req, res) => {
  try {
    // Validate email
    const email = req.body.email;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password input
    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Validate password
    if (!user.password) {
      return res
        .status(500)
        .json({ error: "An error occurred. Please try again later." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = crypto.randomBytes(16).toString("hex");
    const lastAccess = new Date();

    // Update last access and token
    user.token = token;
    user.lastAccess = lastAccess;
    await user.save();

    res.json({ message: "User connected", token: token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

// Create the user
router.post("/create", async (req, res) => {
  try {
    // Validate email
    const email = req.body.email;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate name
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Validate password
    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user document
    const newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });

    await newUser.save();

    res.json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const token = req.body.token;
    const result = await User.updateOne(
      { token: token },
      { $set: { token: null } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "No user found with the given token." });
    }

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

module.exports = router;
