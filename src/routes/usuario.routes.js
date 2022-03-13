const { application } = require('express');
const express = require('express');
const controladorAdmin = require('../controllers/Admin.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/login', controladorAdmin.login);


// _______________________________________________ADMIN_______________________________________________


// -------------CATEGORIAS-------------------
api.post('/agregarCategoria',[md_autenticacion.Auth, md_roles.verAdmin] , controladorAdmin.AgregarCategoria);
api.get('/verCategorias', controladorAdmin.verCategorias);
api.delete('/EliminarCategoria/:idCategoria',[md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.eliminarCategoria);
api.put('/editarCategoria/:idCategoria', controladorAdmin.EditarCategorias);

// -------------PRODUCTOS-------------------
api.post('/agregarProductos',[md_autenticacion.Auth, md_roles.verAdmin] , controladorAdmin.AgregarProducto);
api.get('/verProductos', controladorAdmin.VerProductos );
api.put('/editarProducto/:idProducto',[md_autenticacion.Auth, md_roles.verAdmin] , controladorAdmin.EditarProducto);
api.delete('/eliminarProducto/:idProducto',[md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.eliminarProducto);
api.put('/agregarCategoriaProducto/:idProducto/:idCategoria',[md_autenticacion.Auth], controladorAdmin.AgregarCategoriasProducto);
api.put('/controlStock/:idProducto', controladorAdmin.stockProducto);
api.get('/productoXCategoria/:idCategoria', controladorAdmin.obtenerProductosCategoria)
api.get('/productosAgotados', controladorAdmin.obtenerProductoAgotado)

// -------------Usuarios-------------------
api.post('/agregarUsuario', [md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.AgregarUsuario );
api.put('/editarRolUsuario/:idUsuario',[md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.editarRol )
api.put('/editarUsuarioCliente/:idUsuario',[md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.editarUsuariosCliente)
api.delete('/eliminarCliente/:idUsuario',[md_autenticacion.Auth, md_roles.verAdmin], controladorAdmin.eliminarUsuarioCliente)

module.exports = api;