// const express = require("express");
import express from "express";
const routes = express();
const BookController = require("../controller/BookController");
const { productValidator } = require("../middleware/validation");

// const createValidation = require("../middleware/validation");
// const createValidationPartial = require("../middleware/validationPartial");

// const { isAuthorized } = require("../middleware/authValidationJWT");

// routes.get("/getall", ProductController.getAllProducts);

// gets all data
routes.get("/", BookController.getAll);

// get one data
// routes.get("/:id", productValidator.delete, BookController.getOne);

// deletes
routes.delete(
  "/:id",
  //   isAuthorized,
  //   productValidator.delete,
  BookController.delete
);

// add
routes.post(
  "/",
  //   isAuthorized,
  //   productValidator.create,
  BookController.add
);

// partial update
// routes.patch(
//   "/:id",
// //   isAuthorized,
// //   productValidator.update,
//   ProductController.update
// );

// update
routes.put(
  "/:id",
  // createValidation,
  BookController.update
);

module.exports = routes;
