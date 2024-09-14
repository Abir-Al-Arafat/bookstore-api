/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("auth_users", (table) => {
    table.increments("id"); // Primary key, auto-increment
    table.string("name").notNullable(); // Required name field
    table.string("email").notNullable().unique(); // Required email field, must be unique
    table.string("password").notNullable(); // Required password field
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("auth_users");
};
