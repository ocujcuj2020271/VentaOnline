const mongoose = require('mongoose');
const app = require('./app');
const usuario = require('./src/controllers/Admin.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Venta-Online',{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('se ha conectado correctamente a la base de datos');
    usuario.RegistrarAdmin();
    usuario.CategoriaDefault();
    app.listen(3000, function(){
        console.log("Servidor de express corriendo correctamente en el purto 3000");
    });
}).catch(error => console.log(error));