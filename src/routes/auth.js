const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // create a new instance of user model

    const savedUser = await user.save(); // to save data in db
    const token = await savedUser.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    res.json({ message: "User Added Successfully!!", data: savedUser });
  } catch (err) {
    console.log("error", err);

    res.status(400).send("Error :", err.message);
  }
});

authRouter.use("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials!!");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //creaet JWT token
      const token = await user.getJWT();
      // console.log("token", token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  await res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!!");
});

module.exports = authRouter;
