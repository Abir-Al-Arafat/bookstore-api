import { NextFunction, Request, Response } from "express";

const express = require("express");
// const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

// const corsOptions = {
//     origin: "http://localhost:5173",
//     credentials: true,
// };

// app.use(cors(corsOptions));

// app.use(cors({ origin: "*" }));

app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text

// app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

// checks invalid json file
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({ message: "invalid json file" });
  }
  next();
});

const PORT = 3000;

// Route to handle all other invalid requests
app.use((req: Request, res: Response) => {
  return res.status(400).send({ message: "Route doesnt exist" });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
