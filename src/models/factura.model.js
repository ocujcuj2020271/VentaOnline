var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    nombre: String,
    idProducto: {type: Schema.Types.ObjectId, ref: 'Productos'}
});

module.exports = mongoose.model('Facturas', FacturaSchema);