const conexao = require("../conector/conexao");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome || !email || !senha || !nome_loja) {
    return res.status(404).json("Todos os campos são obrigatórios");
  }

  try {
    const usuarioExistente = await conexao("usuarios")
      .where("email", email)
      .first();

    if (usuarioExistente) {
      return res.status(400).json("O email já existe");
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [usuario] = await conexao("usuarios")
      .insert({ nome, email, senha: senhaCriptografada, nome_loja })
      .returning(["id", "nome", "email", "nome_loja"]);

    if (!usuario) {
      return res.status(400).json("O usuário não foi cadastrado.");
    }

    return res.status(200).json("O usuário foi cadastrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterPerfil = async (req, res) => {
  return res.status(200).json(req.usuario);
};

const atualizarPerfil = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome && !email && !senha && !nome_loja) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização");
  }

  try {
    const updateBody = {};

    if (nome) {
      updateBody.nome = nome;
    }

    if (email && email !== req.usuario.email) {
      const usuarioExistente = await conexao("usuarios")
        .where("email", email)
        .first();

      if (usuarioExistente) {
        return res.status(400).json("O email já existe");
      }
      updateBody.email = email;
    }

    if (senha) {
      updateBody.senha = await bcrypt.hash(senha, 10);
    }

    if (nome_loja) {
      updateBody.nome_loja = nome_loja;
    }

    const [usuarioAtualizado] = await conexao("usuarios")
      .where("id", req.usuario.id)
      .update(updateBody)
      .returning(["id", "nome", "email", "nome_loja"]);

    if (!usuarioAtualizado) {
      return res.status(400).json("O usuário não foi atualizado");
    }

    return res.status(200).json("Usuário foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  obterPerfil,
  atualizarPerfil,
};
