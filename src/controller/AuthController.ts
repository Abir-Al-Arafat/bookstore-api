import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { success, failure } = require("../utilities/common");
const HTTP_STATUS = require("../constants/statusCodes");
// import { SignupRequest, LoginRequest, User } from "../types"; // Import interfaces
const database = require("../../src/config/database");

// types.ts
interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

class AuthController {
  // Signup Method
  async signup(req: SignupRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Validation failed", validation[0].msg));
      }

      const { name, email, password } = req.body;

      // Check if the email already exists
      const emailCheck = await database("auth_users").where({ email }).first();
      if (emailCheck) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure(`User with email: ${email} already exists`));
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser: User[] = await database("auth_users").insert({
        name,
        email,
        password: hashedPassword,
      });

      // Send the response with the newly created user
      if (newUser) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Account created successfully", newUser[0]));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Account couldn't be created"));
      }
    } catch (err) {
      console.error(err);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("INTERNAL SERVER ERROR"));
    }
  }

  // Login Method
  async login(req: LoginRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Validation failed", validation[0].msg));
      }

      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Please provide both email and password"));
      }

      // Fetch user by email
      const user: User | undefined = await database("auth_users")
        .where({ email })
        .first();

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Invalid email or password"));
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!!,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      // Set the token in the Authorization header
      res.setHeader("Authorization", `Bearer ${token}`);
      return res
        .status(HTTP_STATUS.OK)
        .send(success("Logged in successfully", { user, token }));
    } catch (err) {
      console.error(err);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

export default new AuthController();
