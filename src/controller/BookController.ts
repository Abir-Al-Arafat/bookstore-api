import { Request, Response } from "express";
import { validationResult } from "express-validator";
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utilities/common");
const database = require("../../src/config/database");

// types.ts
interface Book {
  id: number;
  title: string;
  description: string;
  published_date: string; // Using string for date to simplify, but could use Date
  author_id: number;
}

export interface BookRequest extends Request {
  body: {
    title: string;
    description: string;
    published_date: string;
    author_id: number;
  };
  query: {
    page?: string;
    pageSize?: string;
    search?: string;
    author?: string;
  };
}

class BookController {
  async getAll(req: BookRequest, res: Response): Promise<Response> {
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

      const books: Book[] = await query;
      const totalBooksQuery = await database("books")
        .count("* as count")
        .first();
      const totalBooks = totalBooksQuery?.count ?? 0;

      if (books.length === 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("No books were found", {
            totalPages: null,
            count: 0,
            page: 0,
            limit: 0,
            books: [],
          })
        );
      }

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all books", {
          books,
          totalBooks,
          totalPages: pageSize ? Math.ceil(totalBooks / pageSize) : null,
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

  async getOne(req: Request, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Failed to get the book", validation[0].msg));
      }

      const { id } = req.params;
      const book: Book | undefined = await database("books")
        .where({ id })
        .first();

      if (book) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully got the book", book));
      }
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to receive the book"));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async add(req: BookRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to add book", validation[0].msg));
      }

      const { title, description, published_date, author_id } = req.body;

      // Check if the author exists
      const author = await database("authors").where({ id: author_id }).first();

      if (!author) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Author not found"));
      }

      const [id]: number[] = await database("books").insert({
        title,
        description,
        published_date,
        author_id,
      });

      const newBook: Book = await database("books").where({ id }).first();
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

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to delete book", validation[0].msg));
      }

      const { id } = req.params;
      const deletedBook = await database("books").where({ id }).del();

      if (!deletedBook) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Book not found"));
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

  async update(req: BookRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();

      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to update book", validation[0].msg));
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
          .send(failure("Book not found"));
      }

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Book updated successfully", updatedBook));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

export default new BookController();
