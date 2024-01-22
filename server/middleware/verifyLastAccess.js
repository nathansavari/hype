const User = require("../models/user");

async function verifyLastAccess(req, res, next) {
  try {
    const token = req.body.token;
    const user = await User.findOne({ token: token });

    if (user && new Date() - new Date(user.lastAccess) > 86400 * 1000) {
      await User.updateOne({ token: token }, { $set: { token: null } });
    }

    return next();
  } catch (error) {
    console.error(error);
  }
  // Proceed to the next middleware
  next();
}

module.exports = verifyLastAccess;
