import express, { application } from "express";
import userdetail from "../model/userdetail";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "./auth1";
import validateUser from "./validator";
import { create } from "ts-node";
const router = express.Router();

router.post("/register", validateUser, async (req: any, res: any) => {
  // TODO check validation on body.->Done
  //check user is allready registered.->Done
  const { username, password, firstname, lastname, gmail, phoneNumber } =
    req.body;
  const userExist = await userdetail.findOne({ username });
  if (userExist) {
    res.json({ error: "User already Exist" });
  } else {
    const salt = await bycrypt.genSalt(10);
    const hashpassword = await bycrypt.hash(password, salt);
    const userdetail1 = new userdetail({
      username: username,
      password: hashpassword,
      firstname: firstname,
      lastname: lastname,
      gmail: gmail.toLowerCase(),
      phoneNumber: phoneNumber,
    });

    try {
      const data = await userdetail1.save();
      const payload = {
        userdetail: {
          _id: data._id,
        },
      };
      jwt.sign(
        payload,
        "anystring",
        { expiresIn: 2 * 24 * 60 * 1000 },
        function (err, token) {
          if (err) {
            res.send(err);
          }
          res.json({ token, data });
        }
      );
    } catch (err) {
      res.json({ error: err });
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //check user is active or not .
  const userActive = await userdetail.findOne({ username, is_active: true });
  if (userActive) {
    try {
      //password retrun nahi krna h
      let data = await userdetail.findOne({ username });
      if (data && bycrypt.compare(password, data.password)) {
        const payload = {
          userdetail: {
            _id: data._id,
          },
        };
        jwt.sign(
          payload,
          "anystring",
          { expiresIn: 2 * 60 * 10000 },
          function (err, token) {
            if (err) {
              res.send(err);
            }
            res.json({ token, data });
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.json({ error: "Please Reactive First." });
  }
});

const auth = verifyToken;
router.post("/welcome", auth, (req, res) => {
  res.send("Welcome Buddy ");
});

router.get("/getprofile", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization;
    try {
      const decoded: any = jwt.verify(authorization, "anystring");
      const userId = decoded.userdetail._id;
      const detail = await userdetail.findOne({ _id: userId }).lean();
      //lean retruns json object.
      res.json(detail);
    } catch (err) {
      res.send("error");
    }
  }
});

router.post("/updateprofile", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    try {
      const decoded: any = jwt.verify(authorization, "anystring");
      var userId = decoded.userdetail._id;
      const detail = await userdetail.updateOne(
        { _id: userId },
        { $set: req.body }
      );
      res.json(detail);
    } catch (err) {
      res.send("error");
    }
  } else {
    res.json("Token not matched.");
  }
});

router.post("/deactivate", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    const decoded: any = jwt.verify(authorization, "anystring");
    var userId = decoded.userdetail._id;
    console.log(userId);
    const data = await userdetail.findOneAndUpdate(
      { _id: userId },
      { $set: { is_active: false } }
    );
    res.json(data);
  } else res.send("token not matched.");
});

router.post("/reactiveprofile", async (req: any, res: any) => {
  //check user is allready active or not.
  const { username, password } = req.body;
  let data = await userdetail.findOne({ username });
  if (data && bycrypt.compare(password, data.password)) {
    const payload = {
      userdetail: {
        _id: data?._id,
      },
    };
    const token = jwt.sign(payload, "anystring", {
      expiresIn: 2 * 60 * 10000,
    });
    const Data = await userdetail.updateOne(
      { _id: data._id },
      { $set: { is_active: 1 } }
    );
    res.json({ data, token });
  } else {
    res.json("Username and password does not matched.");
  }
});

export default router;
