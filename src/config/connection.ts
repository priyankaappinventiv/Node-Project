import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/person");

var dbConnect = mongoose.connection;

dbConnect.on("error", console.error.bind(console, "connection error:"));

dbConnect.once("open", function () {
  console.log("Connection Successful!");
});

export default dbConnect;
