const pool = require('../database/database');
const helpers = require('../controllers/helper');
const randomstring = require('randomstring');

const model = {};

// -------------- Seccion de Arreglos para Datos
//#region 

//-- Arreglo de datos Entidad
let Entidad = {
    TipoEntidad: '',
    NombreEntidad: '',
    NitEntidad: '',
    TelefonoEntidad: '',
    DireccionEntidad: '',
    CorreoEntidad: '',
    PlanPago: '',
    NoUsuarios: '',
    NombreContacto: '',
    IdContacto: '',
};

//#endregion


//-------- Modelo para Cargar la vista principal del super usuario ----------------
model.inicio = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    res.render('Generales/inicio.html', { datos, menu });
};


//--------- Modelo para Cargar Vista de Creacion de Entidades ----------------
//#region 

model.entidades = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    res.render('SuperAdmin/entidades.html', { datos, menu });
};

model.registro_entidades = async (req, res) => {

    Entidad = {
        TipoEntidad: req.body.TipoEntidad,
        NombreEntidad: req.body.NombreEntidad,
        NitEntidad: req.body.NitEntidad,
        TelefonoEntidad: req.body.TelefonoEntidad,
        DireccionEntidad: req.body.DireccionEntidad,
        CorreoEntidad: req.body.CorreoEntidad,
        PlanPago: req.body.PlanPago,
        NoUsuarios: req.body.NoUsuarios,
        NombreContacto: req.body.NombreContacto,
        IdContacto: req.body.IdContacto
    };

    console.log(Entidad);
}

//#endregion
module.exports = model;