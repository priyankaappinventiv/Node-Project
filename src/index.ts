import express from "express";
import mongoose from "mongoose";
import dbConnect from "./config/connection";
import userdetail from "./model/userdetail";
import router from "./router/router";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

dbConnect;
userdetail;
app.use(router);

app.listen(process.env.PORT||3000, () => {
  console.log(process.env.PORT);
  console.log(`Express server is running.`);
});
