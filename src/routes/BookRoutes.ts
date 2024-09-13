import express from "express";
const routes = express();
const BookController = require("../controller/BookController");
const { bookValidator, commonValidator } = require("../middleware/validation");

// const { isAuthorized } = require("../middleware/authValidationJWT");

// gets all data
routes.get("/", BookController.getAll);

// get one data
routes.get("/:id", commonValidator.primaryKeyId, BookController.getOne);

// deletes
routes.delete(
  "/:id",
  //   isAuthorized,
  commonValidator.primaryKeyId,
  BookController.delete
);

// add
routes.post(
  "/",
  //   isAuthorized,
  bookValidator.create,
  BookController.add
);

// partial update
// routes.patch(
//   "/:id",
//   isAuthorized,
//   commonValidator.primaryKeyId,
//   BookController.update
// );

// update
routes.put(
  "/:id",
  commonValidator.primaryKeyId,
  bookValidator.create,
  BookController.update
);

module.exports = routes;
