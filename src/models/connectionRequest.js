const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User", //reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User", //reference to the user collection
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        // using enum means you can not pass any other status, there are only 4 status.
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUES} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId:1, toUserId: 1});
connectionRequestSchema.pre("save", function (next) {
  // this function will be called before save it in db, it will check to and from user id should not be same and here use normal functions, not arrow functions
  const connectionRequest = this;

  // check if fronUserId and toUserId are same 
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){ // ypu cannot compare directly these ids as these are object ids so use equals()
    throw new Error("Cannot send connection request to yourself!");
    
  }
  next();
});
//model name should start wit capital letter and then in model creation, pass model name , schema.
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
