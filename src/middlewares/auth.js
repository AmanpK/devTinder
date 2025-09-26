const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
       return res.status(401).send("Please Login!!")
      }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodeToken;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!!");
    }
    console.log("error", req.user)
    req.user = user;
    next(); //move to request handler
  } catch (err) {
    console.log("error1", err)
    res.status(404).send("ERROR : " + err.message);
  }
};

module.exports = {userAuth};