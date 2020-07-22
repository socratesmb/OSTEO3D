const pool = require('../database/database');
const helpers = require('../controllers/helper');
const randomstring = require('randomstring');

const model = {};

//-------- Modelo para Cargar la vista principal del super usuario ----------------
model.inicio = async (req, res) => {
    res.render('Generales/inicio.html');
};

module.exports = model;