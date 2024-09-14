import express from "express";
const routes = express();
const AuthorController = require("../controller/AuthorController");
const {
  authorValidator,
  commonValidator,
} = require("../middleware/validation");

const { isAuthorizedUser } = require("../middleware/authValidationJWT");

// gets all data
routes.get("/", AuthorController.getAll);

// get one data
routes.get("/:id", commonValidator.primaryKeyId, AuthorController.getOne);

// deletes
routes.delete(
  "/:id",
  isAuthorizedUser,
  commonValidator.primaryKeyId,
  AuthorController.delete
);

// add
routes.post(
  "/",
  isAuthorizedUser,
  authorValidator.create,
  AuthorController.add
);

// update
routes.put(
  "/:id",
  isAuthorizedUser,
  authorValidator.create,
  AuthorController.update
);

module.exports = routes;
