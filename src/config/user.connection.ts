import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const url=String(process.env.URL)
mongoose.connect(url);


var dbConnect = mongoose.connection;

dbConnect.on("error", console.error.bind(console, "connection error:"));

dbConnect.once("open", function () {
  console.log("Connection Successful!");
});

export default dbConnect;
