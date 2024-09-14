import { Request, Response } from "express";

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, failure } = require("../utilities/common");
const HTTP_STATUS = require("../constants/statusCodes");
const database = require("../../src/config/database");

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to add the user", validation[0].msg));
      }
      const { name, email, password } = req.body;

      const emailCheck = await database("auth_users").where({ email }).first();
      if (emailCheck) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure(`User with email: ${req.body.email} already exists`));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await database("auth_users").insert({
        name,
        email,
        password: hashedPassword,
      });

      // payload, secret, JWT expiration
      // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
      //     expiresIn: process.env.JWT_EXPIRES_IN
      // })

      if (newUser) {
        res
          .status(HTTP_STATUS.OK)
          .send(success("Account created successfully ", newUser[0]));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Account couldnt be created"));
      }
    } catch (err) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(`INTERNAL SERVER ERROR`);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to add the user", validation[0].msg));
      }
      const { email, password } = req.body;

      // check if email & pass exist
      if (!email || !password) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("please provide mail and password"));
      }

      // fetching the fields
      const user = await database("auth_users").where({ email }).first();
      console.log("user", user);

      // when the user doesnt exist or pass dont match
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("wrong email or password"));
      }
      // console.log(process.env.JWT_SECRET);
      // console.log(process.env.JWT_EXPIRES_IN);
      // token
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // console.log(token);

      res.setHeader("Authorization", token);
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Logged in successfully", { user, token }));
    } catch (err) {
      console.log(err);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

module.exports = new AuthController();
