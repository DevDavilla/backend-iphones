// server.js

const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const pool = require("../config/db"); // Importa a conexão com o banco de dados PostgreSQL
const cors = require("cors"); // Importa o pacote CORS para permitir requisições de outras origens

// Cria uma instância do aplicativo Express
const app = express();
// Define a porta onde o servidor irá rodar, usando a variável de ambiente PORT ou 3000 como padrão
const PORT = process.env.PORT || 3000; // Definido como 3001 no .env para evitar conflito com o frontend

// Middleware para analisar corpos de requisição JSON (essencial para POST/PUT)
app.use(express.json());
// Habilita o CORS para todas as rotas (para desenvolvimento).
// Em produção, você pode querer configurar mais restritivamente (ex: app.use(cors({ origin: 'http://seu-dominio.com' })));
const corsOptions = {
  origin: "https://iphones-frontend1.vercel.app",
};
app.use(cors(corsOptions));

// Rota de teste simples para verificar se a API está online
app.get("/", (req, res) => {
  res.send("API de iPhones está rodando! 🚀");
});

// Rota para testar a conexão com o banco de dados
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Executa uma query simples para testar a conexão
    res.status(200).json({
      message: "Conexão com DB bem-sucedida!",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
    res
      .status(500)
      .json({ message: "Erro na conexão com o DB", error: err.message });
  }
});

// Rota para cadastrar um novo iPhone (POST /api/iphones)
app.post("/api/iphones", async (req, res) => {
  // Desestruturação dos dados recebidos no corpo da requisição
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
    descricao_detalhada, // Apenas uma descrição agora
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
    // Validação de campos obrigatórios (AJUSTADO conforme sua necessidade)
    const missingFields = [];
    if (!nome) missingFields.push("nome");
    if (!modelo) missingFields.push("modelo");
    if (!armazenamento_gb) missingFields.push("armazenamento_gb");
    if (!condicao_aparelho) missingFields.push("condicao_aparelho");
    if (!preco_tabela) missingFields.push("preco_tabela");
    if (!estoque) missingFields.push("estoque");
    if (!descricao_detalhada) missingFields.push("descricao_detalhada");
    if (!status_produto) missingFields.push("status_produto");

    // Se houver campos obrigatórios faltando, retorna um erro 400
    if (missingFields.length > 0) {
      return res.status(400).json({
        message:
          "Campos obrigatórios faltando. Por favor, preencha todos os campos essenciais.",
        error: `Os seguintes campos são obrigatórios: ${missingFields.join(
          ", "
        )}.`,
      });
    }

    // Query SQL para inserir um novo iPhone no banco de dados
    const result = await pool.query(
      `INSERT INTO iphones (
        nome, modelo, armazenamento_gb, cores_disponiveis, condicao_aparelho,
        preco_tabela, preco_promocional, opcoes_parcelamento, estoque, sku,
        descricao_detalhada, -- Removida 'descricao_curta'
        tamanho_tela_polegadas,
        processador_chip, capacidade_bateria, tipo_conexao, tipo_conector,
        recursos_camera, resistencia_agua_poeira, sistema_operacional,
        biometria, imagens_urls, video_url, dimensoes_axlxc, peso_g,
        garantia_meses, status_produto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
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

    // Responde com o iPhone recém-criado e uma mensagem de sucesso
    res.status(201).json({
      message: "iPhone cadastrado com sucesso!",
      iphone: result.rows[0],
    });
  } catch (err) {
    // Em caso de erro, loga o erro no console do servidor e envia uma resposta 500
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
    // Seleciona todos os iPhones, ordenados pela data de criação (mais recentes primeiro)
    const result = await pool.query(
      "SELECT * FROM iphones ORDER BY data_criacao DESC"
    );

    // Responde com a lista de iPhones e uma mensagem de sucesso
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

// Rota para obter um iPhone por ID (GET /api/iphones/:id)
app.get("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL

  try {
    // Busca um iPhone específico pelo ID
    const result = await pool.query("SELECT * FROM iphones WHERE id = $1", [
      id,
    ]);

    // Se o iPhone não for encontrado, retorna um erro 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "iPhone não encontrado." });
    }

    // Responde com os detalhes do iPhone encontrado
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

// Rota para atualizar um iPhone (PUT /api/iphones/:id)
app.put("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL
  // Desestruturação dos dados recebidos no corpo da requisição
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
    descricao_detalhada, // Apenas uma descrição
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
    // Primeiro, verifica se o iPhone com o ID fornecido existe
    const checkIphone = await pool.query(
      "SELECT id FROM iphones WHERE id = $1",
      [id]
    );
    if (checkIphone.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "iPhone não encontrado para atualização." });
    }

    // Validação de campos obrigatórios (AJUSTADO conforme sua necessidade)
    const missingFields = [];
    if (!nome) missingFields.push("nome");
    if (!modelo) missingFields.push("modelo");
    if (!armazenamento_gb) missingFields.push("armazenamento_gb");
    if (!condicao_aparelho) missingFields.push("condicao_aparelho");
    if (!preco_tabela) missingFields.push("preco_tabela");
    if (!estoque) missingFields.push("estoque");
    if (!descricao_detalhada) missingFields.push("descricao_detalhada");
    if (!status_produto) missingFields.push("status_produto");

    // Se houver campos obrigatórios faltando, retorna um erro 400
    if (missingFields.length > 0) {
      return res.status(400).json({
        message:
          "Campos obrigatórios faltando. Por favor, preencha todos os campos essenciais.",
        error: `Os seguintes campos são obrigatórios: ${missingFields.join(
          ", "
        )}.`,
      });
    }

    // Query SQL para atualizar os dados do iPhone
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
        descricao_detalhada = $11, -- Removida 'descricao_curta'
        tamanho_tela_polegadas = $12,
        processador_chip = $13,
        capacidade_bateria = $14,
        tipo_conexao = $15,
        tipo_conector = $16,
        recursos_camera = $17,
        resistencia_agua_poeira = $18,
        sistema_operacional = $19,
        biometria = $20,
        imagens_urls = $21,
        video_url = $22,
        dimensoes_axlxc = $23,
        peso_g = $24,
        garantia_meses = $25,
        status_produto = $26,
        data_atualizacao = NOW()
      WHERE id = $27
      RETURNING *`, // Retorna o registro atualizado
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
        id, // O ID é o último parâmetro para a cláusula WHERE
      ]
    );

    // Responde com o iPhone atualizado e uma mensagem de sucesso
    res.status(200).json({
      message: "iPhone atualizado com sucesso!",
      iphone: result.rows[0],
    });
  } catch (err) {
    // Em caso de erro, loga e envia uma resposta 500
    console.error(`Erro ao atualizar iPhone com ID ${id}:`, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao atualizar iPhone.",
      error: err.message,
    });
  }
});

// Rota para excluir um iPhone (DELETE /api/iphones/:id)
app.delete("/api/iphones/:id", async (req, res) => {
  const { id } = req.params; // Extrai o ID da URL

  try {
    // Verifica se o iPhone existe antes de tentar deletar
    const checkIphone = await pool.query(
      "SELECT id FROM iphones WHERE id = $1",
      [id]
    );
    if (checkIphone.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "iPhone não encontrado para exclusão." });
    }

    // Executa a query para deletar o iPhone
    const result = await pool.query(
      "DELETE FROM iphones WHERE id = $1 RETURNING id",
      [id]
    );

    // Se nenhuma linha foi afetada, significa que o iPhone não foi encontrado (salvaguarda)
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "iPhone não encontrado ou já excluído." });
    }

    // Responde com uma mensagem de sucesso e o ID do iPhone excluído
    res.status(200).json({
      message: `iPhone com ID ${id} excluído com sucesso!`,
      deletedId: result.rows[0].id,
    });
  } catch (err) {
    // Em caso de erro, loga e envia uma resposta 500
    console.error(`Erro ao excluir iPhone com ID ${id}:`, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor ao excluir iPhone.",
      error: err.message,
    });
  }
});

// Listar todos os pedidos
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY data_criacao DESC"
    );
    res.status(200).json({
      message: "Pedidos listados com sucesso!",
      orders: result.rows,
    });
  } catch (err) {
    console.error("Erro ao listar pedidos:", err.stack);
    res.status(500).json({
      message: "Erro interno ao listar pedidos",
      error: err.message,
    });
  }
});

// Criar um novo pedido
app.post("/api/orders", async (req, res) => {
  const { cliente_nome, cliente_email, produtos, total } = req.body;

  if (!cliente_nome || !cliente_email || !produtos || !total) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO orders (cliente_nome, cliente_email, produtos, total) VALUES ($1, $2, $3, $4) RETURNING *",
      [cliente_nome, cliente_email, JSON.stringify(produtos), total]
    );
    res.status(201).json({
      message: "Pedido criado com sucesso!",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao criar pedido:", err.stack);
    res.status(500).json({
      message: "Erro interno ao criar pedido",
      error: err.message,
    });
  }
});

// Atualizar status de um pedido
app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status é obrigatório" });

  try {
    const result = await pool.query(
      "UPDATE orders SET status=$1, data_atualizacao=NOW() WHERE id=$2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Pedido não encontrado" });

    res.status(200).json({
      message: "Status atualizado com sucesso!",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("Erro ao atualizar pedido:", err.stack);
    res.status(500).json({
      message: "Erro interno ao atualizar pedido",
      error: err.message,
    });
  }
});

// Deletar pedido
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Pedido não encontrado" });

    res.status(200).json({
      message: "Pedido deletado com sucesso!",
      deletedId: result.rows[0].id,
    });
  } catch (err) {
    console.error("Erro ao deletar pedido:", err.stack);
    res
      .status(500)
      .json({ message: "Erro interno ao deletar pedido", error: err.message });
  }
});

// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Pressione Ctrl+C para parar");
});
