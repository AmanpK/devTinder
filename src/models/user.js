const mongoose = require("mongoose");
const validator = require("validator");

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
      unique: true,
      lowercase: true,
      trim: true, // to remove white space
      validate(value){
        if(!validator.isEmail(value))
        {
          throw new Error("Invalid email ID" + value);
          
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value))
        {
          throw new Error("Enter a strong password : " + value);
          
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(vale)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.nicepng.com/png/detail/52-521023_download-free-icon-female-vectors-blank-facebook-profile.png",
        validate(value){
          if(!validator.isURL(value))
          {
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

module.exports = mongoose.model("User", userSchema);
