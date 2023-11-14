const conexao = require("knex");

const knex = conexao({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "123456",
    database: "api_builder",
  },
});

module.exports = knex;