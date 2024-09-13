import { Request, Response } from "express";

const HTTP_STATUS = require("../constants/statusCodes");
const { validationResult } = require("express-validator");
const { success, failure } = require("../utilities/common");
const database = require("../../src/config/database");

class AuthorController {
  async getAll(req: Request, res: Response) {
    try {
      const {
        sortParam,
        sortOrder,
        search,
        name,
        author,
        price,
        priceFil,
        stock,
        stockFil,
        page,
        limit,
      } = req.query;
      //   if (page  < 1 || limit < 0) {
      //     return res
      //       .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      //       .send(failure("Page and limit values must be at least 1"));
      //   }
      //   if (
      //     (sortOrder && !sortParam) ||
      //     (!sortOrder && sortParam) ||
      //     (sortParam &&
      //       sortParam !== "stock" &&
      //       sortParam !== "price" &&
      //       sortParam !== "name") ||
      //     (sortOrder && sortOrder !== "asc" && sortOrder !== "desc")
      //   ) {
      //     return res
      //       .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      //       .send(failure("Invalid sort parameters provided"));
      //   }
      //   const filter = {};

      //   if (price && priceFil) {
      //     if (priceFil === "low") {
      //       filter.price = { $lte: parseFloat(price) };
      //     } else {
      //       filter.price = { $gte: parseFloat(price) };
      //     }
      //   }
      //   if (stock && stockFil) {
      //     if (stockFil === "low") {
      //       filter.stock = { $lte: parseFloat(stock) };
      //     } else {
      //       filter.stock = { $gte: parseFloat(stock) };
      //     }
      //   }

      //   if (name) {
      //     filter.name = { $regex: name, $options: "i" };
      //   }
      //   if (author) {
      //     filter.author = { $in: author.toLowerCase() };
      //   }
      //   if (search) {
      //     filter["$or"] = [
      //       { name: { $regex: search, $options: "i" } },
      //       { author: { $regex: search, $options: "i" } },
      //     ];
      //   }
      //   console.log(filter.$or);
      // console.log(typeof Object.keys(JSON.parse(JSON.stringify(filter)))[0]);
      //   const productCount = await ProductModel.find({}).count();
      const authors = await database("authors");
      // .sort({
      //   [sortParam]: sortOrder === "asc" ? 1 : -1,
      // })
      // .skip((page - 1) * limit)
      // .limit(limit ? limit : 10);
      // console.log(products)
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

      console.log(authors);

      return res.status(HTTP_STATUS.OK).send(
        success("Successfully got all authors", {
          //   total: productCount,
          //   totalPages: limit ? Math.ceil(productCount / limit) : null,
          //   count: authors.length,
          //   page: parseInt(page),
          //   limit: parseInt(limit),
          authors: authors,
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
      // const validation = validationResult(req).array();
      // // console.log(validation);
      // if (validation.length > 0) {
      //   return res
      //     .status(HTTP_STATUS.NOT_FOUND)
      //     .send(failure("Failed to get the product", validation[0].msg));
      // }

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
      // const validation = validationResult(req).array();
      // // console.log(validation);
      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to add product", validation[0].msg));
      // }
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

  // deletes a product
  async delete(req: Request, res: Response) {
    try {
      // const validation = validationResult(req).array();
      // // console.log(validation);
      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to delete product", validation[0].msg));
      // }
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

      // const validation = validationResult(req).array();

      // if (validation.length > 0) {
      //     return res
      //         .status(HTTP_STATUS.OK)
      //         .send(failure("Failed to update data", validation[0].msg));
      // }

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
