import { Request, Response } from "express";
const HTTP_STATUS = require("../constants/statusCodes");
const { validationResult } = require("express-validator");
const { success, failure } = require("../utilities/common");
const database = require("../../src/config/database");

class BookController {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10);
      const pageSize = parseInt(req.query.pageSize as string, 10);
      const search = req.query.search as string;
      const author = req.query.author as string;
      if (page < 1 || pageSize < 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page and limit values must be at least 1"));
      }
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      let query = database("books").select("*").limit(limit).offset(offset);

      if (search) {
        query = query.where("title", "like", `%${search}%`);
      }

      if (author) {
        query = query.where({ author_id: author });
      }

      const books = await query;
      const totalBooksQuery = database("books").count("* as count").first();
      const totalBooks = await totalBooksQuery;

      // console.log(products)
      if (books.length === 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("No books were found", {
            totalPages: null,
            count: 0,
            page: 0,
            limit: 0,
            products: [],
          })
        );
      }

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all books", {
          books,
          totalBooks,
          totalPages: pageSize ? Math.ceil(totalBooks.count / pageSize) : null,
          count: books.length,
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
          .send(failure("Failed to get the product", validation[0].msg));
      }

      const { id } = req.params;

      const book = await database("books").where({ id }).first();

      if (book) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully got the book", book));
      }
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(`failed to recieve the book`);
    } catch (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(
          failure("Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR)
        );
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
          .send(failure("Failed to add product", validation[0].msg));
      }
      const { title, description, published_date, author_id } = req.body;

      // Check if the author exists
      const author = await database("authors").where({ id: author_id }).first();

      if (!author) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Author not found"));
      }

      const [id] = await database("books").insert({
        title,
        description,
        published_date,
        author_id,
      });
      // Fetch the newly created book data by the inserted id
      const newBook = await database("books").where({ id }).first();
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Book Added Successfully", newBook));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  // deletes a product
  async delete(req: Request, res: Response) {
    try {
      const validation = validationResult(req).array();
      // console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to delete book", validation[0].msg));
      }
      const id = req.params.id;
      // Find the item by ID and delete it
      const deletedBook = await database("books").where({ id }).del();

      if (!deletedBook) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Book not found", HTTP_STATUS.NOT_FOUND));
      }

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Book deleted successfully", deletedBook));
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
      const validation = validationResult(req).array();

      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to update data", validation[0].msg));
      }
      const { id } = req.params;
      const { title, description, published_date, author_id } = req.body;

      // Check if the author exists
      const author = await database("authors").where({ id: author_id }).first();

      if (!author) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Author not found"));
      }

      const updatedBook = await database("books")
        .where({ id })
        .update({ title, description, published_date, author_id });

      if (!updatedBook) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Book not found", "not found"));
      }
      console.log(updatedBook);

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Book updated successfully", updatedBook));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error", error));
    }
  }
}

module.exports = new BookController();
