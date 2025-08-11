const express = require("express");

const app = express(); //create express application

app.use("/", (req,res) => {
    res.send("Hiii from the server 7777"); //Request handler
});

app.use("/test", (req,res) => {
    res.send("Test the server 7777"); //Request handler
});

app.use("/hello", (req,res) => {
    res.send("Saying hello to the port 7777"); //Request handler
});

app.listen(7777, () => {
    console.log("Server is listening on port 7777...");
    
}); // to listen request on particular port