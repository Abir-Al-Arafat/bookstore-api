import { Request, Response } from "express";

const HTTP_STATUS = require("../constants/statusCodes");
const { validationResult } = require("express-validator");
const { success, failure } = require("../utilities/common");
const database = require("../../src/config/database");

class AuthorController {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10);
      const pageSize = parseInt(req.query.pageSize as string, 10);
      const search = req.query.search as string;

      if (page < 1 || pageSize < 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page and limit values must be at least 1"));
      }

      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      let query = database("authors").select("*").limit(limit).offset(offset);
      if (search) {
        query = query.where("name", "like", `%${search}%`);
      }

      const authors = await query;
      const totalBooksQuery = database("books").count("* as count").first();
      const totalAuthors = await totalBooksQuery;

      if (authors.length === 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("No authors were found", {
            // total: productCount,
            totalPages: null,
            count: 0,
            page: 0,
            limit: 0,
            products: [],
          })
        );
      }

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all authors", {
          authors,
          totalAuthors,
          totalPages: pageSize
            ? Math.ceil(totalAuthors.count / pageSize)
            : null,
          count: authors.length,
          page: page,
          limit: limit,
        })
      );
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // gets only one product
  async getOne(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Failed to get the author", validation[0].msg));
      }

      const { id } = req.params;

      const author = await database("authors").where({ id }).first();

      if (author) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully got the author", author));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(`failed to recieve author`);
      }
    } catch (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(`internal server error`);
    }
  }

  // adds
  async add(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to add author", validation[0].msg));
      }
      const { name, bio, birthdate } = req.body;
      const [id] = await database("authors").insert({
        name,
        bio,
        birthdate,
      });
      const author = await database("authors").where({ id }).first();
      // await author.save();
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Author Added Successfully", author));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // deletes an author
  async delete(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to delete author", validation[0].msg));
      }
      const id = req.params.id;
      // Find the item by ID and delete it
      const deletedAuthor = await database("authors").where({ id }).del();
      console.log("deletedAuthor", deletedAuthor);

      if (!deletedAuthor) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Author not found" });
      }

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Author deleted successfully", deletedAuthor));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // updates
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { name, bio, birthdate } = req.body;

      const validation = validationResult(req).array();

      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to update data", validation[0].msg));
      }

      const updatedAuthor = await await database("authors")
        .where({ id })
        .update({ name, bio, birthdate });

      if (!updatedAuthor) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Author not found" });
      }
      console.log(updatedAuthor);

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Author updated successfully", updatedAuthor));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "INTERNAL SERVER ERROR" });
    }
  }
}

module.exports = new AuthorController();
