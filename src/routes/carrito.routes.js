const { application } = require('express');
const express = require('express');
const carrito = require('../controllers/Carrito.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();


api.put('/agregarProducto', md_autenticacion.Auth, carrito.crearCarrito);

module.exports = api;