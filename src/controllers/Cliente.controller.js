const Usuario = require('../models/usuario')
const Producto = require('../models/productos.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const app = require('express')();

//esto funcionaba pero al grabar el video dejo de hacerlo :c
function AgregarUsuario(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if (parametros.nombre && parametros.email ) {
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length > 0) {
                return res.status(500).send({ mensaje: "este correo ya se encuentra utilizado" })
            } else {
                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.email = parametros.email;
                modeloUsuario.rol = "Cliente";
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    modeloUsuario.password = passwordEncriptada;

                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al guardar el usuario' })

                        return res.status(200).send({ usuario: usuarioGuardado })
                    })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe ingresar el rol' })
    }
}

function editarUsuario(req, res) {
    var parametros = req.body;
    var id = req.params.idUsuario;

    if (id !== req.user.sub) {
        return res.status(500).send({ mensaje: 'No puedes editar otro Perfil' })
    }

    Usuario.findByIdAndUpdate(id, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error en al buscar Usuario' });

        return res.status(200).send({ mensaje: usuarioEncontrado });
    })
}

function eliminarCuenta(req, res) {
    var id = req.params.idUsuario;

    if (id !== req.user.sub) {
        return res.status(500).send({ mensaje: 'No puedes eliminar otro Perfil' })
    }

    Usuario.findByIdAndDelete(id, (err, clienteEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!clienteEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el cliente' })

        return res.status(200).send({ Cliente: 'Se elimino:', clienteEliminado })
    })
}

function buscarProducto(req, res) {
    var params = req.body;

    Producto.find({ nombre: params.nombre },
        (err, productos) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!productos) return res.status(500).send({ mensaje: 'error al buscar Producto' });

            return res.status(200).send({ productos: productos })
        })
}



module.exports = {
    AgregarUsuario,
    editarUsuario,
    eliminarCuenta,
    buscarProducto
}