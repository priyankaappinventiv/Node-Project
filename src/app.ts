import express from "express";
import mongoose from "mongoose";
import db from "./config/database";
import userdetail from "./model/userdetail";
import router from "./middleware/auth";
//import verifyToken from './middleware/auth1';
const app = express();
app.use(express.json());
const port = 3000;

db;
userdetail;
//verifyToken;
app.use(router);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
 