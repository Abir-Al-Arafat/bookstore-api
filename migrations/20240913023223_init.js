/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("authors", (table) => {
    table.increments("id"); // Primary key, auto-increment
    table.string("name").notNullable(); // Required string
    table.text("bio"); // Optional text
    table.date("birthdate").notNullable(); // Required date
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("authors");
};
