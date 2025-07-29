// config/db.js

const { Pool } = require("pg");
require("dotenv").config(); // Carrega as variáveis de ambiente

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Teste de conexão (opcional, mas recomendado)
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao conectar ao banco de dados:", err.stack);
  }
  console.log("Conectado ao banco de dados PostgreSQL!");
  release(); // Libera o cliente de volta para o pool
});

module.exports = pool;
