// server.js

const express = require("express");
require("dotenv").config();
const pool = require("./config/db"); // Importa a conexão com o banco de dados

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para analisar corpos de requisição JSON

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

// Rota para cadastrar um novo iPhone (POST /api/iphones)
app.post("/api/iphones", async (req, res) => {
  const {
    nome,
    modelo,
    armazenamento_gb,
    cores_disponiveis,
    condicao_aparelho,
    preco_tabela,
    preco_promocional,
    opcoes_parcelamento,
    estoque,
    sku,
    descricao_curta,
    descricao_detalhada,
    tamanho_tela_polegadas,
    processador_chip,
    capacidade_bateria,
    tipo_conexao,
    tipo_conector,
    recursos_camera,
    resistencia_agua_poeira,
    sistema_operacional,
    biometria,
    imagens_urls,
    video_url,
    dimensoes_axlxc,
    peso_g,
    garantia_meses,
    status_produto,
  } = req.body;

  try {
    if (
      !nome ||
      !modelo ||
      !armazenamento_gb ||
      !condicao_aparelho ||
      !preco_tabela ||
      !estoque ||
      !descricao_curta ||
      !descricao_detalhada
    ) {
      return res.status(400).json({
        message:
          "Campos obrigatórios faltando. Por favor, preencha todos os campos essenciais.",
      });
    }

    const result = await pool.query(
      `INSERT INTO iphones (
        nome, modelo, armazenamento_gb, cores_disponiveis, condicao_aparelho,
        preco_tabela, preco_promocional, opcoes_parcelamento, estoque, sku,
        descricao_curta, descricao_detalhada, tamanho_tela_polegadas,
        processador_chip, capacidade_bateria, tipo_conexao, tipo_conector,
        recursos_camera, resistencia_agua_poeira, sistema_operacional,
        biometria, imagens_urls, video_url, dimensoes_axlxc, peso_g,
        garantia_meses, status_produto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING *`,
      [
        nome,
        modelo,
        armazenamento_gb,
        cores_disponiveis,
        condicao_aparelho,
        preco_tabela,
        preco_promocional,
        opcoes_parcelamento,
        estoque,
        sku,
        descricao_curta,
        descricao_detalhada,
        tamanho_tela_polegadas,
        processador_chip,
        capacidade_bateria,
        tipo_conexao,
        tipo_conector,
        recursos_camera,
        resistencia_agua_poeira,
        sistema_operacional,
        biometria,
        imagens_urls,
        video_url,
        dimensoes_axlxc,
        peso_g,
        garantia_meses,
        status_produto,
      ]
    );

    res.status(201).json({
      message: "iPhone cadastrado com sucesso!",
      iphone: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao cadastrar iPhone:", err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao cadastrar iPhone.",
      error: err.message,
    });
  }
});

// Rota para listar todos os iPhones (GET /api/iphones)
app.get("/api/iphones", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM iphones ORDER BY data_criacao DESC"
    );

    res.status(200).json({
      message: "iPhones listados com sucesso!",
      iphones: result.rows,
    });
  } catch (err) {
    console.error("Erro ao listar iPhones:", err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao listar iPhones.",
      error: err.message,
    });
  }
});

// --- NOVA ROTA: Obter um iPhone por ID (GET /api/iphones/:id) ---
app.get("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL

  try {
    // Query SQL para selecionar um iPhone pelo ID
    const result = await pool.query("SELECT * FROM iphones WHERE id = $1", [
      id,
    ]);

    // Verifica se o iPhone foi encontrado
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "iPhone não encontrado." });
    }

    // Responde com o iPhone encontrado
    res.status(200).json({
      message: "iPhone encontrado com sucesso!",
      iphone: result.rows[0],
    });
  } catch (err) {
    console.error(`Erro ao obter iPhone com ID ${id}:`, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao obter iPhone.",
      error: err.message,
    });
  }
});
// --- FIM DA NOVA ROTA ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
