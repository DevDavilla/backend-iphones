// server.js

// Importa o framework Express
const express = require("express");
// Importa o dotenv para carregar variáveis de ambiente
require("dotenv").config();

// Cria uma instância do aplicativo Express
const app = express();
// Define a porta onde o servidor irá rodar, usando a variável de ambiente PORT ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Middleware para analisar corpos de requisição JSON
app.use(express.json());

// Rota de teste simples
app.get("/", (req, res) => {
  res.send("API de iPhones está rodando! 🚀");
});

// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
