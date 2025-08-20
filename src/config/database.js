const mongoose = require("mongoose");

const connectDB = async () => {
 await mongoose.connect("mongodb+srv://thetrulyak:UbiCBeBkKaQxKLFe@cluster0.ut36mfy.mongodb.net/devTinder");
}

module.exports = connectDB;



