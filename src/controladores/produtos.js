const conexao = require("../conector/conexao");

const cadastrarProduto = async (req, res) => {
  const { usuario } = req;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

  if (!nome || !estoque || !preco || !descricao) {
    return res
      .status(400)
      .json("Os campos nome, estoque, preco e descricao são obrigatórios");
  }

  try {
    const produto = await conexao("produtos").returning("*").insert({
      usuario_id: usuario.id,
      nome,
      estoque,
      preco,
      categoria,
      descricao,
      imagem,
    });

    if (produto.length === 0) {
      return res.status(400).json("O produto não foi cadastrado");
    }

    return res.status(200).json("O produto foi cadastrado com sucesso.");
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    const queryBuilder = conexao
      .select("*")
      .from("produtos")
      .where("usuario_id", usuario.id);

    if (categoria) {
      queryBuilder.andWhere("categoria", "ilike", `%${categoria}%`);
    }

    const produtos = await queryBuilder;

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const obterProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const produto = await conexao("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const atualizarProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

  if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
    return res
      .status(400)
      .json("Informe ao menos um campo para atualização do produto");
  }

  try {
    const produtoExistente = await conexao("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produtoExistente) {
      return res.status(404).json("Produto não encontrado");
    }

    const atualizacao = {};
    if (nome) atualizacao.nome = nome;
    if (estoque) atualizacao.estoque = estoque;
    if (preco) atualizacao.preco = preco;
    if (categoria) atualizacao.categoria = categoria;
    if (descricao) atualizacao.descricao = descricao;
    if (imagem) atualizacao.imagem = imagem;

    const produtoAtualizado = await conexao("produtos")
      .where({ usuario_id: usuario.id, id })
      .update(atualizacao);

    if (produtoAtualizado === 0) {
      return res.status(400).json("O produto não foi atualizado");
    }

    return res.status(200).json("O produto foi atualizado com sucesso.");
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const produtoExistente = await conexao("produtos")
      .where({ usuario_id: usuario.id, id })
      .first();

    if (!produtoExistente) {
      return res.status(404).json("Produto não encontrado");
    }

    const produtoExcluido = await conexao("produtos").where({ id }).del();

    if (produtoExcluido === 0) {
      return res.status(400).json("O produto não foi excluído");
    }

    return res.status(200).json("Produto excluído com sucesso");
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  obterProduto,
  atualizarProduto,
  excluirProduto,
};
