const express = require("express");
const routes = express();
const AuthController = require("../controller/AuthController");
const { authValidator } = require("../middleware/validation");

// for signing up
routes.post("/auth/signup", authValidator.create, AuthController.signup);

// for logging in
routes.post("/auth/login", authValidator.login, AuthController.login);

module.exports = routes;
