const query = require("../conector/conexao");
const jwt = require("jsonwebtoken");
const senhaHash = require("../senha/senhaHash");

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, senhaHash);

    const usuario = await query("usuarios").select("*").where("id", id).first();

    if (!usuario) {
      return res.status(404).json("Usuário não encontrado");
    }

    const { senha, ...dadosUsuario } = usuario;

    req.usuario = dadosUsuario;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = verificaLogin;
