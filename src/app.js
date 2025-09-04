const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express(); //create express application

app.use(express.json()); //middleware to process/parse data into json data
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// app.patch("/user", async (req, res) => {
//   const data = req.body;
//   const userId = req.body.id;
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }

//     if (data?.skills.length > 20) {
//       throw new Error("Skills cannot be more than 20");
//     }

//     await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("Update Successfully");
//   } catch (err) {
//     res.status(400).send("Error saving in user:", err.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body.id;
//   try {
//     await User.findByIdAndDelete(userId);
//     res.send("Delted Successfully");
//   } catch (err) {
//     res.status(400).send("Error saving in user:", err.message);
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const user = await User.find();
//     if (user.length === 0) {
//       res.status(404).send("User not found.");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Error getting user:", err.messag);
//   }
// });

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777...");
    }); // to listen request on particular port
  })
  .catch((err) => {
    console.log("Database cannot be connected!");
  });

// //This will only handle get call to /users
// app.get("/users", (req,res)=> {
//     res.send({firstName: "Amanpreet Kaur"})
// });
// // By using app.use will match all the HTTP method API calls to /test
// app.use("/test/", (req,res) => {
//     res.send("Test the server 2  7777"); //Request handler
// });

// app.use("/test/2", (req,res) => {
//     res.send("Test the server 7777"); //Request handler
// });

// app.use("/hello", (req,res) => {
//     res.send("Saying hello to the port 7777"); //Request handler
// });
// app.use("/", (req,res) => {
//     res.send("Hiii from the server 7777"); //Request handler
// });
