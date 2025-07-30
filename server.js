// server.js

const express = require("express");
require("dotenv").config();
const pool = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Middleware para analisar corpos de requisição JSON

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

// --- NOVA ROTA: Atualizar um iPhone (PUT /api/iphones/:id) ---
app.put("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL
  const {
    // Extrai os dados do corpo da requisição (o que vem do formulário de edição do frontend)
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
    // Validação básica (garantir que o iPhone com o ID exista)
    const checkIphone = await pool.query(
      "SELECT id FROM iphones WHERE id = $1",
      [id]
    );
    if (checkIphone.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "iPhone não encontrado para atualização." });
    }

    // A query SQL para atualizar um iPhone
    const result = await pool.query(
      `UPDATE iphones SET
        nome = $1,
        modelo = $2,
        armazenamento_gb = $3,
        cores_disponiveis = $4,
        condicao_aparelho = $5,
        preco_tabela = $6,
        preco_promocional = $7,
        opcoes_parcelamento = $8,
        estoque = $9,
        sku = $10,
        descricao_curta = $11,
        descricao_detalhada = $12,
        tamanho_tela_polegadas = $13,
        processador_chip = $14,
        capacidade_bateria = $15,
        tipo_conexao = $16,
        tipo_conector = $17,
        recursos_camera = $18,
        resistencia_agua_poeira = $19,
        sistema_operacional = $20,
        biometria = $21,
        imagens_urls = $22,
        video_url = $23,
        dimensoes_axlxc = $24,
        peso_g = $25,
        garantia_meses = $26,
        status_produto = $27,
        data_atualizacao = NOW()
      WHERE id = $28
      RETURNING *`, // RETURNING * retorna o registro atualizado
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
        id, // O ID deve ser o último parâmetro para $28
      ]
    );

    // Responde com o iPhone atualizado
    res.status(200).json({
      message: "iPhone atualizado com sucesso!",
      iphone: result.rows[0],
    });
  } catch (err) {
    console.error(`Erro ao atualizar iPhone com ID ${id}:`, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao atualizar iPhone.",
      error: err.message,
    });
  }
});

// --- NOVA ROTA: Excluir um iPhone (DELETE /api/iphones/:id) ---
app.delete("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL

  try {
    // Primeiro, verifique se o iPhone existe antes de tentar deletar
    const checkIphone = await pool.query(
      "SELECT id FROM iphones WHERE id = $1",
      [id]
    );
    if (checkIphone.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "iPhone não encontrado para exclusão." });
    }

    // A query SQL para deletar um iPhone
    const result = await pool.query(
      "DELETE FROM iphones WHERE id = $1 RETURNING id",
      [id]
    );

    // O RETURNING id é útil para confirmar qual ID foi deletado.
    // result.rowCount também pode ser usado para verificar se alguma linha foi afetada.
    if (result.rowCount === 0) {
      // Isso não deve acontecer se a verificação inicial (checkIphone) for bem-sucedida,
      // mas é uma salvaguarda.
      return res
        .status(404)
        .json({ message: "iPhone não encontrado ou já excluído." });
    }

    // Responde com uma mensagem de sucesso
    res.status(200).json({
      message: `iPhone com ID ${id} excluído com sucesso!`,
      deletedId: result.rows[0].id, // Confirma o ID que foi excluído
    });
  } catch (err) {
    console.error(`Erro ao excluir iPhone com ID ${id}:`, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao excluir iPhone.",
      error: err.message,
    });
  }
});
// --- FIM DA NOVA ROTA ---

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
