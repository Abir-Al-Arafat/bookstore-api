/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("books", function (table) {
    table.increments("id").primary(); // Auto-incremented primary key
    table.string("title").notNullable(); // Title is required
    table.text("description"); // Description is optional
    table.date("published_date").notNullable(); // Published date is required
    table.integer("author_id").unsigned().notNullable(); // Foreign key for author
    table.foreign("author_id").references("id").inTable("authors"); // Foreign key constraint
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("books"); // Drop the books table
};
