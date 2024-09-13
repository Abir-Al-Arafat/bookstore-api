/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost", // Ensure this is correct
      database: "bookstore",
      user: "root",
      password: "12345",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "../../migrations",
      tableName: "knex_migrations",
    },
  },

  // staging: {
  //   client: "mysql",
  //   connection: {
  //     database: "bookstore",
  //     user: "root",
  //     password: "12345",
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};
