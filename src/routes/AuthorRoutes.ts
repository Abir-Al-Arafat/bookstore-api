import express from "express";
const routes = express();
const AuthorController = require("../controller/AuthorController");
const {
  authorValidator,
  commonValidator,
} = require("../middleware/validation");

// const { isAuthorized } = require("../middleware/authValidationJWT");

// gets all data
routes.get("/", AuthorController.getAll);

// get one data
routes.get("/:id", commonValidator.primaryKeyId, AuthorController.getOne);

// deletes
routes.delete(
  "/:id",
  //   isAuthorized,
  commonValidator.primaryKeyId,
  AuthorController.delete
);

// add
routes.post(
  "/",
  //   isAuthorized,
  authorValidator.create,
  AuthorController.add
);

// update
routes.put("/:id", authorValidator.create, AuthorController.update);

module.exports = routes;
