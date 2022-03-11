const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductosSchema = new Schema({
    nombre: String,
    cantidad: Number,
    precio: Number,
    Categoria: [{
       ref: "Categorias",
       type: Schema.Types.ObjectId
    }]
});

module.exports = mongoose.model('Productos', ProductosSchema)