const express = require('express');
const cors = require('cors');
const app = express();
const UsuarioRouter = require('./src/routes/usuario.routes');
const ClienteRouter = require('./src/routes/cliente.routes');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());


app.use(cors());

app.use('/api', UsuarioRouter, ClienteRouter);


module.exports = app;