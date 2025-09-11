const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // if making unique is equal to true then do not need to specify index true and index is used to make query in less time.
      lowercase: true,
      trim: true, // to remove white space
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email ID" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`
      },
      // validate(value) {     //custom validator function but you can use enum also
      //   if (!["male", "female", "others"].includes(vale)) {
      //     throw new Error("Gender is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.nicepng.com/png/detail/52-521023_download-free-icon-female-vectors-blank-facebook-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// userSchema.index({firstName: 1}) example of index creation to run the query like findOne and other faster but we should not create unnessary indexes, it will become tough for DB 

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const token = await bcrypt.compare(passwordInputByUser, passwordHash);

  return token;
};

module.exports = mongoose.model("User", userSchema);
