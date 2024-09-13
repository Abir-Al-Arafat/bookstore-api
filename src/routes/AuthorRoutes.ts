const express = require("express");
const routes = express();
const AuthorController = require("../controller/AuthorController");
// const { productValidator } = require("../middleware/validation");

// const createValidation = require("../middleware/validation");
// const createValidationPartial = require("../middleware/validationPartial");

const { isAuthorized } = require("../middleware/authValidationJWT");

// routes.get("/getall", ProductController.getAllProducts);

// requirement
// gets all data
routes.get("/", AuthorController.getAll);

// get one data
routes.get(
  "/:id",
  // productValidator.delete,
  AuthorController.getOne
);

// deletes
routes.delete(
  "/:id",
  //   isAuthorized,
  //   productValidator.delete,
  AuthorController.delete
);

// add
routes.post(
  "/",
  //   isAuthorized,
  //   productValidator.create,
  AuthorController.add
);

// partial update
// routes.patch(
//   "/:id",
//   isAuthorized,
//   productValidator.update,
//   ProductController.update
// );

// update
routes.put(
  "/:id",
  // createValidation,
  AuthorController.update
);

module.exports = routes;
