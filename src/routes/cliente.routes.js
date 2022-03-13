const express = require('express');
const controladorCliente = require('../controllers/Cliente.controller');
const controladorAdmin = require('../controllers/Admin.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/IniciarSesion', controladorAdmin.login);

api.post('/registar', controladorCliente.AgregarUsuario);
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth, controladorCliente.editarUsuario);
api.delete('/eliminarCuenta/:idUsuario',md_autenticacion.Auth, controladorCliente.eliminarCuenta);
api.get('buscarProductoXNombre/:nombre', controladorCliente.buscarProducto)

module.exports = api;
