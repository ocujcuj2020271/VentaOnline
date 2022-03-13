const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductosSchema = new Schema({
    nombre: String,
    cantidad: Number,
    precio: Number,
    idCategoria: {type: Schema.Types.ObjectId, ref: 'Categorias'}
});

module.exports = mongoose.model('Productos', ProductosSchema)