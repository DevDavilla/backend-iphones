// server.js

const express = require("express");
require("dotenv").config();
const pool = require("./config/db"); // Importa a conexão com o banco de dados

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota de teste simples
app.get("/", (req, res) => {
  res.send("API de iPhones está rodando! 🚀");
});

// Exemplo de rota para testar a conexão com o DB (opcional)
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      message: "Conexão com DB bem-sucedida!",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erro na conexão com o DB", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
