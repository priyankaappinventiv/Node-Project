import express from "express";
import mongoose from "mongoose";
import dbConnect from "./config/user.connection";
import userdetail from "./model/user.detail";
import router from "./user.router/user.router";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

dbConnect;
userdetail;
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
  console.log(`Express server is running.`);
});
