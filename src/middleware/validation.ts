import { Request } from "express";
const { body, param } = require("express-validator");

const commonValidator = {
  primaryKeyId: [
    param("id")
      .exists()
      .withMessage("ID must be provided")
      .bail()
      .isInt({ min: 0 })
      .withMessage("ID must be a valid integer greater than or equal to 0"),
  ],
};

const authorValidator = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a valid string"),

    body("birthdate")
      .notEmpty()
      .withMessage("Birthdate is required")
      .isISO8601()
      .withMessage("Birthdate must be a valid date (YYYY-MM-DD)"),

    body("bio")
      .optional()
      .isString()
      .withMessage("Bio must be a string if provided"),
  ],
};

const userValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("name was not provided")
      .bail()
      .notEmpty()
      .withMessage("name cannot be empty")
      .bail()
      .isString()
      .withMessage("name must be a string"),
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("phone")
      .exists()
      .withMessage("Phone number was not provided")
      .bail()
      .notEmpty()
      .withMessage("Phone number cannot be empty")
      .bail()
      .isString()
      .withMessage("Phone number must be a string")
      .bail()
      .isMobilePhone()
      .withMessage("Phone number format is incorrect"),
    body("gender")
      .isIn(["male", "female", "other"])
      .withMessage("Gender must be male, female or other"),
    body("address.area")
      .optional()
      .exists()
      .withMessage("area was not provided")
      .bail()
      .notEmpty()
      .withMessage("area cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.city")
      .optional()
      .exists()
      .withMessage("city was not provided")
      .bail()
      .notEmpty()
      .withMessage("city cannot be empty")
      .bail()
      .isString()
      .withMessage("city must be a string"),
    body("address.country")
      .optional()
      .exists()
      .withMessage("country was not provided")
      .bail()
      .notEmpty()
      .withMessage("country cannot be empty")
      .bail()
      .isString()
      .withMessage("country must be a string"),
    body("balance")
      .isFloat({ min: 0, max: 1500 })
      .withMessage("balance must be grater than 0 and less than 1500"),
  ],
  update: [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isString()
      .withMessage("name must be a string"),
    body("email")
      .optional()
      .notEmpty()
      .withMessage("email is required")
      .bail()
      .isString()
      .withMessage("email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("phone number cannot be empty")
      .bail()
      .isString()
      .withMessage("phone number must be a string")
      .bail()
      .isMobilePhone()
      .withMessage("Phone number format is incorrect"),
    body("gender")
      .optional()
      .notEmpty()
      .withMessage("gender cannot be empty")
      .bail()
      .isIn(["male", "female", "other"])
      .withMessage("Gender must be male, female or other"),
    body("address.area")
      .optional()
      .notEmpty()
      .withMessage("area cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.city")
      .optional()
      .notEmpty()
      .withMessage("city cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("address.country")
      .optional()
      .notEmpty()
      .withMessage("country cannot be empty")
      .bail()
      .isString()
      .withMessage("area must be a string"),
    body("balance")
      .optional()
      .isFloat({ min: 0, max: 1500 })
      .withMessage("balance must be greater than 0 and less than 1500"),
  ],
  delete: [
    param("id")
      .exists()
      .withMessage("User ID must be provided")
      .bail()
      .matches(/^[a-f\d]{24}$/i)
      .withMessage("ID is not in valid mongoDB format"),
  ],
};

const authValidator = {
  create: [
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("password")
      .exists()
      .withMessage("Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must contain 8 characters, a small letter, a capital letter, a symbol and a number"
      ),
    body("passwordConfirm")
      .exists()
      .withMessage("Confirm Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .custom((value: string, req: Request) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be user or admin"),
  ],
  login: [
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty"),
    body("password")
      .exists()
      .withMessage("Password was not provided")
      .bail()
      .isString()
      .withMessage("Password must be a string"),
  ],
};

const bookValidator = {
  create: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a valid string"),

    body("published_date")
      .notEmpty()
      .withMessage("Published date is required")
      .isISO8601()
      .withMessage("Published date must be a valid date (YYYY-MM-DD)"),

    body("author_id")
      .notEmpty()
      .withMessage("Author ID is required")
      .isInt({ min: 1 })
      .withMessage("Author ID must be a valid integer"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string if provided"),
  ],
};

module.exports = {
  commonValidator,
  authorValidator,
  bookValidator,
  userValidator,
  authValidator,
};
