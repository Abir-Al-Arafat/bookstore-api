const knex = require("./src/config/database");

knex
  .raw("SELECT 1+1 AS result")
  .then((res: any) => {
    console.log(res);
    knex.destroy();
  })
  .catch((err: any) => {
    console.error("Database connection error:", err);
    knex.destroy();
  });
