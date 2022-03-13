const Usuario = require('../models/usuario');
const Producto = require('../models/productos.model');
const Carrito = require('../models/carrito.model');


const app = require('express')();

function crearCarrito(req, res) {
  var idProducto = req.body.idProducto;
  var cantidad = req.body.cantidad;
  var idUsuario = req.user.sub;


  Producto.findById({ _id: idProducto }, (err, productoEncontrado) => {
    if (err) return res.status(500).send({ message: 'error en la petición de productos' })
    if (!productoEncontrado) return res.status(404).send({ message: 'error al listar los productos' })

    Carrito.find({ idUsuario: idUsuario, "Productos.idProducto": idProducto }, (err, producto) => {
      if (err) return res.status(500).send({ message: 'error en la petician' })

      if (producto == 0) {
        if (productoEncontrado.cantidad < cantidad) return res.status(500).send({ message: 'No hay suficientes productos' })

        var total = productoEncontrado.precio * cantidad;

        Carrito.findByIdAndUpdate({ idUsuario: idUsuario },
          {
            $push: {
              Productos: {
                idProducto: idProducto,
                cantidad: cantidad, total: total
              }
            }
          },
          { new: true }, (err, agregar) => {
            productoEncontrado
            if (err) return res.status(500).send({ message: 'Error en la peticion 1' });
            if (!agregar) return res.status(404).send({ message: 'error al agregar' });

            return res.status(200).send({ carrito: agregar })
          })
      } else {
        Carrito.findOne({ idUsuario: req.user.sub, "Productos.idProducto": idProducto },
          { "Productos.$.cantidad": 1, _id: 0 }, (err, cantidad) => {
            var a = cantidad.Carrito[0].cantidad + Number(cantidad)
            var s = cantidad.Carrito[0].precio * cantidad

            if (a > stockProducto) return res.status(404).send({ message: 'No hay productos' })
            Carrito.updateOne({ idUsuario: req.user.sub, Productos: { $elemMatch: { idProducto: idProducto } } },
              { $inc: { "Productos.$.cantidad": cantidad, "Productos.$.subTotal": s } }, (err, cantidad) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de usuario' })
                if (!cantidad) return res.status(404).send({ message: 'error al actualizar el producto' })

                Carrito.findById({ idUsuario: req.user.sub }, (err, usuarioEncontrado) => {
                  return res.status(200).send({ Usuario: usuarioEncontrado })
                })
              })

          })


      }

    })

  })


}

module.exports = {
  crearCarrito
}