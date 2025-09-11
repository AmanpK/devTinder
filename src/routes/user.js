const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender photoUrl about skills"
    );
    // .populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]); can write in array and string both
    res.json({ message: "Data fetched successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName age gender photoUrl about skills"
      )
      .populate(
        "toUserId",
        "firstName lastName age gender photoUrl about skills"
      );

    //modify data as i want to send user detail who send the connected not connection detail

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        //did toString to compare ids as they are object ids so to compare string part of the id did toString
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send({ message: "Data fetched successfully", data: data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //User should see all the user cards except
    //0. his own cards
    //1. his connections
    //2. ignored people
    //3. already sent the connection request

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    //find all the user that are connected to you or interested

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); //to show selected data not all the data

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender photoUrl about skills")
      .skip(skip)
      .limit(limit);

    res.json({data : users});
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
