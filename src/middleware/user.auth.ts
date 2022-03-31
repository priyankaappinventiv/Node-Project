import express, { application } from "express";
import userdetail from "../model/user.detail";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { create } from "ts-node";
import { Request, Response, NextFunction } from "express";
const key=String(process.env.SECRET);

const register = async(req: Request, res: Response)=> {
  const { username, password, firstname, lastname, gmail, phoneNumber } =
    req.body;
  const userExist = await userdetail.findOne({ username });
  if (userExist) {
    res.json({ error: "User already exist." });
  } else {
    const salt:string = await bycrypt.genSalt(10);
    const hashpassword:string = await bycrypt.hash(password, salt);
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
          _id: data._id,
      };
      jwt.sign(
        payload,
        key,
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
};

const login= async (req:Request, res:Response) => {
  const { username, password } = req.body;
  //check user is active or not .
  const userActive = await userdetail.findOne({ username, is_active: true });
  if (userActive) {
    try {
      //password retrun nahi krna h
      let data = await userdetail.findOne({ username });
      if (data && bycrypt.compare(password, data.password)) {
        const payload = {
          
            _id: data._id,
        };
        jwt.sign(
          payload,
          key,
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
};


 const verifyToken =async(req:Request, res:Response, next: NextFunction) => {
  
    const token =req.body.token || req.query.token || req.headers["authorization"];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, "anystring");
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    res.json({message:"Welcome! Token verified."})
    return next();
  
};

 const getProfile=async (req:Request, res:Response) => {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization;
    try {
      const decoded= jwt.verify(authorization, key) as { _id : string};
      const userId:string= decoded._id;
      const detail = await userdetail.findOne({ _id: userId }).lean();
      //lean retruns json object.
      res.json(detail);
    } catch (err) {
      res.json({message:"error"});
    }
  }
};

const updateProfile= async (req:Request, res:Response) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    try {
      const decoded = jwt.verify(authorization, key) as { _id : string};
      console.log(decoded);
      const userId:string = decoded._id;
      const detail = await userdetail.updateOne(
        { _id: userId },
        { $set: req.body }
      );
      res.json(detail);
    } catch (err) {
      res.send({message:"error"});
    }
  } else {
    res.json({message:"Token not matched."});
  }
};

const deactivate= async (req:Request, res:Response) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization;
    const decoded: any = jwt.verify(authorization, key)as { _id : string};
    var userId:string = decoded._id;
    console.log(userId);
    const data = await userdetail.findOneAndUpdate(
      { _id: userId },
      { $set: { is_active: false } }
    );
    res.json(data);
  } else res.json({message:"Token not matched."});
};

const reactiveProfile=async (req:Request, res:Response) => {
  //check user is allready active or not.
  const { username, password } = req.body;
  let data = await userdetail.findOne({ username });
  if (data && bycrypt.compare(password, data.password)) {
    const payload = {
        _id: data?._id
    };
    const token:string = jwt.sign(payload, key, {
      expiresIn: 2 * 60 * 10000,
    });
    const Data = await userdetail.updateOne(
      { _id: data._id },
      { $set: { is_active: 1 } }
    );
    res.json({ data, token });
  } else {
    res.json({message:"Username and password does not matched."});
  }
}

export default {register,login,verifyToken,getProfile,updateProfile,deactivate,reactiveProfile};
