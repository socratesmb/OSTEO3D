const pool = require('../database/database');
const helpers = require('../controllers/helper');
const randomstring = require('randomstring');
const correo = require('../models/ModeloCorreo');

const model = {};

// -------------- Seccion de Arreglos para Datos
//#region 

let alerta = {
    tipo: '',
    mensaje: ''
};

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

    res.render('Generales/inicio.html', { datos, menu, alerta });
};


//--------- Modelo para Cargar Vista de Creacion de Entidades ----------------
//#region 

model.entidades = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    res.render('SuperAdmin/entidades.html', { datos, menu, alerta });

    LimpiarVariables();
};

model.registro_entidades = async (req, res) => {

    const valid = pool.query("select * from persona where persona.Identificacion = " + req.body.IdContacto);

    if (valid.length > 0) {
        alerta = {
            tipo: 'inseguro',
            mensaje: 'El Usuario Ya Esta Registrado En El Sistema, No Se Puede Registrar Un Usuario 2 Veces'
        };
        res.redirect('/supadmin/entidades');

    } else {
        var password = randomstring.generate(6);
        var contrasena = await helpers.encryptPassword(password);
        console.log('Contrase aleatoria:' + password);
        console.log('Contrase cifrada:' + contrasena);


        await pool.query("call Registro_Entidades(" + req.body.TipoEntidad + ", '" + req.body.NombreEntidad + "', " + req.body.NitEntidad + ", '" + req.body.TelefonoEntidad + "', '" + req.body.DireccionEntidad + "', '" + req.body.CorreoEntidad + "', " + req.body.Tiempo_Pago + ", " + req.body.NoUsuarios + ", '" + req.body.NombreContacto + "', '" + req.body.IdContacto + "', '" + contrasena + "');", (err, result) => {
            if (err) {
                console.log(err)
                alerta = {
                    tipo: 'peligro',
                    mensaje: err
                };

                res.redirect('/supadmin/entidades');
            } else {
                console.log('Resultado de la creacion de la entidad: ' + result);
                correo.EnvioCorreo(req.body.CorreoEntidad, req.body.IdContacto, password);

                alerta = {
                    tipo: 'correcto',
                    mensaje: 'Nueva Entidad Creada Correctamente'
                };

                res.redirect('/supadmin/entidades');
            }
        });

    }


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

//------- Funciones de Limpieza de Variables ----------
//#region 
function LimpiarVariables() {
    alerta = {
        tipo: '',
        mensaje: ''
    }

}
//#endregion
module.exports = model;