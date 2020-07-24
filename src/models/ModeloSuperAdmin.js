const pool = require('../database/database');
const helpers = require('../controllers/helper');
const randomstring = require('randomstring');

const model = {};

//-------- Modelo para Cargar la vista principal del super usuario ----------------
model.inicio = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;
        
    res.render('Generales/inicio.html', { datos, menu });
};

module.exports = model;