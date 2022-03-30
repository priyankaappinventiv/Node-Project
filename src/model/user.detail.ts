
import mongoose from "mongoose";
import { Schema, model, connect } from "mongoose";
import userdetail from "./user.interface";

const Model_Name = "userdetail";

const userdetailSchema = new Schema<userdetail>(
  {
    username: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    gmail: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

var userdetail = mongoose.model<userdetail>(Model_Name, userdetailSchema);

export default userdetail;
