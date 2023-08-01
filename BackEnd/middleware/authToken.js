const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      // console.log('before')
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      // console.log('middle')
      req.user = await User.findById(decoded.userData.id).select("-password");
      // console.log(req.user)
      // console.log('after')

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { protect };