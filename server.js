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

// --- NOVA ROTA: Cadastrar um novo iPhone (POST /api/iphones) ---
app.post("/api/iphones", async (req, res) => {
  // Extrai os dados do corpo da requisição (o que vem do formulário do frontend)
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
    // Validação básica (você pode adicionar mais validações aqui)
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

    // A query SQL para inserir um novo iPhone
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
      RETURNING *`, // RETURNING * retorna o registro inserido
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

    // Responde com o iPhone recém-criado
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
// --- FIM DA NOVA ROTA ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
