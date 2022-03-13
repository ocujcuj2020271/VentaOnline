const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriasSchema = new Schema({
    nombre: String,
    
})

module.exports = mongoose.model('Categorias', CategoriasSchema);