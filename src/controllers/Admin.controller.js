const Usuario = require('../models/usuario');
const Categoria = require('../models/categorias.model');
const Producto = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const ModeloCategoria = require('../models/categorias.model')

const app = require('express')();

function login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                    } else {
                        return res.status(500).send({ mensaje: 'La contraseña no coincide' });
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'Error, el correo no  se encuentra registrado.' })
        }
    })
}

function RegistrarAdmin(req, res) {
    var usuarioModel = new Usuario();

    Usuario.find({ email: 'ADMIN' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return console.log({ mensaje: "Ya existe un Administrador" })
        } else {

            usuarioModel.nombre = 'ADMIN';
            usuarioModel.email = 'ADMIN';
            usuarioModel.rol = 'ADMIN'
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) console.log({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return console.log({ mensaje: 'Error al agregar el Usuario' });

                    return console.log({ usuario: 'Usuario Administrador Creado' });
                });
            });
        }
    })

}
//---------------------------USUARIO-------------------------------------


function AgregarUsuario(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if (parametros.nombre && parametros.email && parametros.rol) {
        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length > 0) {
                return res.status(500).send({ mensaje: "este correo ya se encuentra utilizado" })
            } else {
                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.email = parametros.email;
                modeloUsuario.rol = parametros.rol;
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

function editarRol(req, res) {
    var parametros = req.body;
    var id = req.params.idUsuario;

    delete parametros.password,
        delete parametros.nombre,
        delete parametros.email

    Usuario.findByIdAndUpdate(id, parametros, { new: true }, (err, rolEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!rolEditado) return res.status(500).send({ mensaje: 'Error al editar rol' });

        return res.status(200).send({ Usuario: rolEditado })
    })
}

function editarUsuariosCliente(req, res) {
    var parametros = req.body;
    var id = req.params.idUsuario;

    Usuario.findOne({ _id: id, rol: 'Cliente' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: 'No puedes editar un Usuario que no sea cliente' })
        }

        Usuario.findByIdAndUpdate(id, parametros, { new: true }, (err, usuarioEditado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!usuarioEditado) return res.status(500).send({ mensaje: 'Error al editar el usuario' });

            return res.status(200).send({ usuario: usuarioEditado });
        })

    })
}

function eliminarUsuarioCliente(req, res) {
    var id = req.params.idUsuario;

    Usuario.findOne({ _id: id, rol: 'Cliente' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            return res.status(500).send({ mensaje: 'No puedes Eliminar un Usuario que no sea cliente' })
        }

        Usuario.findByIdAndDelete(id, (err, clienteEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!clienteEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el cliente' })

            return res.status(200).send({ Cliente: 'Se elimino:', clienteEliminado })
        })


    })

}


//-------------------------CATEGORIAS---------------------------------

function CategoriaDefault(req, res) {
    var categoriaModel = Categoria();

    categoriaModel.nombre = "Por Defecto"

    Categoria.find({ nombre: "Por Defecto" }, (err, categoria) => {
        if (err) return console.log({ mensaje: 'Error en la peticion' });
        if (categoria.length >= 1) {
            return console.log({ mensaje: 'La categoria Fue creada' })
        } else {
            categoriaModel.save((err, guardar) => {
                if (err) return console.log({ mensaje: 'Error en la peticion' });
                if (guardar) {
                    console.log("Categoria Lista");
                } else {
                    console.log({ mensaje: "la categoria no se a creado" });
                }

            })
        }

    })
}

function AgregarCategoria(req, res) {
    var parametros = req.body;
    var modeloCategoria = new Categoria();
    if (parametros.nombre) {
        modeloCategoria.nombre = parametros.nombre;
        modeloCategoria.save((err, categoriaGuardado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaGuardado) return res.status(500).send({ mensaje: 'Error al guardad categoria' });
            return res.status(200).send({ categoria: categoriaGuardado });
        })
    } else {
        return res.status(500).send({ mensaje: 'Debe de ingresar los parametros obligatorios' });
    }
}


function AgregarCategoriasProducto(req, res) {
    var producto = req.params.idProducto;
    var categorias = req.params.idCategoria;

    Producto.findByIdAndUpdate(producto, { idCategoria: categorias }, { new: true },
        (err, categoriaAgregada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!categoriaAgregada) return res.status(500).send({ mensaje: 'Error al agregar el categoria' });

            return res.status(200).send({ product: categoriaAgregada });
        })
}


function verCategorias(req, res) {
    Categoria.find({}, (err, categoria) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoria) return res.status(500).send({ mensaje: 'Error al buscar la catergoria' });

        return res.status(200).send({ Categorias: categoria });
    })
}

function eliminarCategoria(req, res) {
    var id = req.params.idCategoria
    
    Categoria.find({nombre: {$regex: "Por Defecto", $options: "i"}},(err, defecto) => {
        if(defecto.id !== id){
            Categoria.findByIdAndDelete({_id: id}, (err, eliminar)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!eliminar) return res.status(500).send({mensaje: 'Error al Eliminar 1'});
                {
                    Producto.updateMany({idCategoria: id}, {idCategoria: defecto.id},{new: true},(err, actualizar)=>{
                        return res.status(200).send({mensaje: eliminar});
                    } )
                }
            })
        } else{
            return res.status(500).send({mensaje: "No puedes eliminar la categoria por defecto"});
        }
    })
  



}

/*
function eliminarCategoriasProducto(req, res) {

}

function EliminarCategorias(req, res) {
    const categoriaId = req.params.idCategoria;

    Categoria.findOne({ nombre: 'Por Defecto' }, (err, categoriaEncontrada) => {
        if (!categoriaEncontrada) {

            const modeloCategoria = new Categoria();
            modeloCategoria.nombre = 'Por Defecto';

            modeloCategoria.save((err, categoriaGuardada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!categoriaGuardada) return res.status(400).send({ mensaje: 'Error al guardar Categoria' });

                Producto.updateMany({ idCategoria: categoriaId }, { idCategoria: categoriaGuardada._id },
                    (err, categoriaEditada) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al actualizar Categoria' });

                        Categoria.findOneAndUpdate((err, categoriaEliminada) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!categoriaEliminada) return res.status(500).send({ mensaje: '1 Error al eliminar la categoria' });

                            return res.status(200).send({ Editar: categoriaEditada, eliminar: categoriaEliminada })
                        })
                    })
            })
        } else {
            Producto.updateMany({ idCategoria: categoriaId }, { idCategoria: categoriaEncontrada._id },
                (err, categoriaActualizada) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Actualizar Categorias' });

                    Categoria.findOneAndUpdate({ Categoria: { $elemMatch: { _id: categoriaId } } },
                        { $pull: { Categoria: { _id: categoriaId } } }, { new: true }, (err, categoriaEliminada) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!categoriaEliminada) return res.status(500).send({ mensaje: '2 Error al eliminar la categoria' });

                            return res.status(200).send({ Editar: categoriaActualizada, eliminar: categoriaEliminada })
                        })
                })
        }
    })
}

*/

function EditarCategorias(req, res) {
    var Id = req.params.idCategoria;
    var parametros = req.body;

    Categoria.findByIdAndUpdate(Id, parametros, { new: true }, (err, categoriaEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoriaEditado) return res.status(404).send({ mensaje: 'Error al Editar la categoria' });

        return res.status(200).send({ Categoria: categoriaEditado })
    })

}

function obtenerProductosCategoria(req, res) {
    var Id = req.params.idCategoria;

    Producto.find({ idCategoria: Id }, (err, categorias) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categorias) return res.status(404).send({ mensaje: 'Error al Editar la categoria' });

        return res.status(200).send({ categoria: categorias })
    })
}

// --------------------------PRODUCTOS----------------------------------

function AgregarProducto(req, res) {
    const parametros = req.body;
    const modeloProducto = new Producto();

    Producto.find({ nombre: parametros.nombre }, (err, productoEncontrado) => {
        if (productoEncontrado.length > 0) {
            return res.status(500).send({ mensaje: 'Ya existe un producto con este Nombre, modifica la cantidad' })
        } else {

            if (parametros.nombre) {
                modeloProducto.nombre = parametros.nombre;
                modeloProducto.cantidad = parametros.cantidad;
                modeloProducto.precio = parametros.precio;

                modeloProducto.save((err, productoGuardar) => {
                    if (err) return res.status(400).send({ mensaje: 'Error en la peticion.' });
                    if (!productoGuardar) return res.status(400).send({ mensaje: 'Error al agregar el Producto.' });

                    return res.status(200).send({ productos: productoGuardar });
                })
            } else {
                return res.status(400).send({ mensaje: 'Debe de ingresar parametros obligatorios' });
            }

        }
    })



}

function VerProductos(req, res) {
    Producto.find({}, (err, productosEncontrados) => {
        return res.send({ productos: productosEncontrados });
    })
}

function EditarProducto(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    Producto.findByIdAndUpdate(idProd, parametros, { new: true }, (err, productoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEditado) return res.status(404).send({ mensaje: 'Error al Editar el Producto' });

        return res.status(200).send({ producto: productoEditado });
    })
}

function eliminarProducto(req, res) {
    var id = req.params.idProducto;

    Producto.findByIdAndDelete(id, (err, eliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Producto' });

        return res.status(200).send({ producto: eliminado });
    })
}

function stockProducto(req, res) {
    const id = req.params.idProducto;
    const parametros = req.body;

    Producto.findByIdAndUpdate(id, { $inc: { cantidad: parametros.cantidad } }, { new: true },
        (err, stockModificado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!stockModificado) return res.status(500).send({ mensaje: 'Error incrementar la cantidad del producto' });
            return res.status(200).send({
                producto: stockModificado
            })
        })
}

function obtenerProductoAgotado(req, res) {
    Producto.find({ cantidad: 0 }).exec(
        (err, producto) => {
            if (err) {
                return res.status(500).send({ mensaje: 'Error en la peticion' })
            } else {
                if (!producto) return res.status(500).send({ mensaje: 'no hay productos existentes' })

                return res.status(200).send({ producto });
            }
        }
    )

}



module.exports = {
    RegistrarAdmin,
    login,
    AgregarCategoria,
    verCategorias,
    eliminarCategoria,
    EditarCategorias,
    AgregarProducto,
    obtenerProductoAgotado,
    VerProductos,
    EditarProducto,
    stockProducto,
    AgregarCategoriasProducto,
    AgregarUsuario,
    editarRol,
    editarUsuariosCliente,
    eliminarUsuarioCliente,
    eliminarProducto,
    obtenerProductosCategoria,
    CategoriaDefault,

}