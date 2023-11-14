const express = require('express');
const usuarios = require('../controladores/usuarios');
const login = require('../controladores/login');
const produtos = require('../controladores/produtos');
const verificaLogin = require('../filtros/verificaLogin');

const rotas = express();

rotas.post('/usuarios', usuarios.cadastrarUsuario);

rotas.post('/login', login.login);

rotas.use(verificaLogin);

rotas.get('/perfil', usuarios.obterPerfil);
rotas.put('/perfil', usuarios.atualizarPerfil);

rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.patch('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;