const pool = require('../database/database');
const helpers = require('../controllers/helper');

const model = {};

// -------------- Seccion de Arreglos para Datos -----------------
//#region 

let alerta = {
    tipo: '',
    mensaje: ''
};

//#endregion

model.inicio = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    res.render('Generales/inicio.html', { datos, menu, alerta });
};

module.exports = model;