import { Request, Response } from "express";
import { validationResult } from "express-validator";
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utilities/common");
const database = require("../../src/config/database");

// types.ts
interface Author {
  id: number;
  name: string;
  bio?: string;
  birthdate: string;
}

interface AuthorRequest extends Request {
  body: {
    name: string;
    bio?: string;
    birthdate: string;
  };
}

class AuthorController {
  async getAll(req: Request, res: Response): Promise<Response> {
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

      const authors: Author[] = await query;
      const totalAuthorsQuery = await database("authors")
        .count("* as count")
        .first();
      const totalAuthors = totalAuthorsQuery?.count ?? 0;

      if (authors.length === 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("No authors were found", {
            totalPages: null,
            count: 0,
            page: 0,
            limit: 0,
            authors: [],
          })
        );
      }

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all authors", {
          authors,
          totalAuthors,
          totalPages: pageSize ? Math.ceil(totalAuthors / pageSize) : null,
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

  async getOne(req: Request, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Failed to get the author", validation[0].msg));
      }

      const { id } = req.params;

      const author: Author | undefined = await database("authors")
        .where({ id })
        .first();
      if (author) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully got the author", author));
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send(failure("Author not found"));
      }
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async add(req: AuthorRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to add author", validation[0].msg));
      }

      const { name, bio, birthdate } = req.body;
      const [id]: number[] = await database("authors").insert({
        name,
        bio,
        birthdate,
      });

      const newAuthor: Author = await database("authors").where({ id }).first();
      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("Author Added Successfully", newAuthor));
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
          .send(failure("Failed to delete author", validation[0].msg));
      }

      const { id } = req.params;
      const deletedAuthor = await database("authors").where({ id }).del();

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

  async update(req: AuthorRequest, res: Response): Promise<Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to update author", validation[0].msg));
      }

      const { id } = req.params;
      const { name, bio, birthdate } = req.body;

      const updatedAuthor = await database("authors")
        .where({ id })
        .update({ name, bio, birthdate });

      if (!updatedAuthor) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Author not found" });
      }

      return res
        .status(HTTP_STATUS.ACCEPTED)
        .send(success("Author updated successfully", updatedAuthor));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

export default new AuthorController();
