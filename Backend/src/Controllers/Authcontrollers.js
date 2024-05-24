import Jwt from "jsonwebtoken";
import express from "express";
import { usercollections } from "../schemas/userschema.js";
import  bcrypt  from 'bcrypt';


export const SignupController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, mobilenumber } = req.body;
    console.log(req.body);
    const checkemailexist = await usercollections.findOne({ email: email });
    if (checkemailexist) {
      const err = new Error();
      err.statusCode = 409;
      err.message = "user already exists";
      err.customerror = true;
      throw err;
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashpassword = await bcrypt.hash(password, salt);

    const addUser = new usercollections({
      firstName,
      lastName,
      email,
      password: hashpassword,
      mobilenumber,
    });

    await addUser.save();
    res.status(200).send("Signup successfull");
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      res.status(400).send(err);
    } else {
      // if (err.name === "ValidationError") {
      //   res.send(err.message);
      // } else {
      next(err);
      // }
    }
  }
};

export const SigninController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const checkuserexist = await usercollections.findOne({
      email: email,
    });

    if (!checkuserexist) {
      const err = new Error();
      err.statusCode = 400;
      err.message = "user not found";
      err.customerror = true;
      throw err;
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      checkuserexist.password
    );

    if (!passwordsMatch) {
      const err = new Error();
      err.statusCode = 400;
      err.message = "password not match";
      err.customerror = true;
      throw err;
    }

    const token = Jwt.sign(
      {
        id: checkuserexist._id,
        email: checkuserexist.email,
      },
      "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
      {
        expiresIn: "365d",
      }
    );

    res.status(200).json({
      token,
      response: "logged in successfully",
      ok: "oooo",
      id: checkuserexist._id,
      email: checkuserexist.email,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

