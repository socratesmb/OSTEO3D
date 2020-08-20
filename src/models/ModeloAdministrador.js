const pool = require('../database/database');
const mkdirp = require('mkdirp');
const randomstring = require('randomstring');
const helpers = require('../controllers/helper');
const correo = require('../models/ModeloCorreo');

const model = {};

// -------------- Seccion de Arreglos para Datos
//#region 

let alerta = {
    tipo: '',
    mensaje: ''
};

let variables = {
    Ruta_Form: '/admin/docente/creacion',
    Titulo: 'Registro Docente',
    Boton: 'Registrar Docente'
};

let Docente = {
    Nombre: '',
    Apellido: '',
    Identificacion: '',
    Correo: ''
}

let Id_Docente = '';
//#endregion

// --------- Seccion para ver empresa y actualizar empresa ----------
//#region 
model.empresa = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const entidad = await pool.query("select * from entidad where entidad.Id_Entidad = " + datos.Id_Entidad);

    res.render('Administrador/empresa.html', { datos, menu, alerta, entidad });

    alerta = {
        tipo: '',
        mensaje: ''
    };
};

model.actualizar_entidad = async (req, res) => {
    datos = req.session.datos;
    await pool.query("update entidad set entidad.Nombre = '" + req.body.NombreEntidad + "', entidad.Nit = " + req.body.NitEntidad + ", entidad.Telefono = '" + req.body.TelefonoEntidad + "', entidad.Direccion = '" + req.body.DireccionEntidad + "', entidad.Correo_Electronico = '" + req.body.CorreoEntidad + "', entidad.Encargado = '" + req.body.NombreContacto + "' where entidad.Id_Entidad = " + datos.Id_Entidad, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'No se Pudo Actualizar la Información' + err
            };
            res.redirect('/admin/empresa');
        } else {
            console.log(result);
            alerta = {
                tipo: 'correcto',
                mensaje: 'Información Modificadas Correctamente'
            };

            res.redirect('/admin/empresa');
        }
    });
};
//#endregion

// --------- Seccion de vista docente, actualizacion y desactivacion ----------------
//#region 

model.docente = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const ListaDocente = await pool.query('select * from Lista_Docente where Id_Entidad = ' + datos.Id_Entidad);

    res.render('Administrador/docente.html', { datos, menu, alerta, variables, ListaDocente, Docente });

    LimpiarVariables();
};

model.registro_docente = async (req, res) => {
    datos = req.session.datos;
    var contrasena = await helpers.encryptPassword(req.body.Identificacion);

    await pool.query("call Registro_Docente('" + req.body.NombreDocente + "', '" + req.body.ApellidoDocente + "', " + req.body.Identificacion + ", '" + req.body.Correo + "', " + datos.Id_Entidad + ", '" + contrasena + "')", async (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al registrar el Usuario' + err
            }
            res.redirect('/admin/docentes');
        } else {
            correo.RegistroUsuario(req.body.Correo, req.body.Identificacion, req.body.Identificacion);
            alerta = {
                tipo: 'correcto',
                mensaje: 'El Usuario Ha Sido Creado, Por favor Revisar Correo Electronico'
            }
            res.redirect('/admin/docentes');
        }
    });
};

model.buscar_docente = async (req, res) => {
    const { Id_Persona } = req.params;
    Id_Docente = Id_Persona;
    await pool.query('select persona.Nombre, persona.Apellido, persona.Identificacion, persona.Correo_Electronico from persona where persona.Id_Persona = ' + Id_Persona, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al Consultar el Usuario' + err
            }
            res.redirect('/admin/docentes');
        } else {
            console.log(result);

            Docente = {
                Nombre: result[0].Nombre,
                Apellido: result[0].Apellido,
                Identificacion: result[0].Identificacion,
                Correo: result[0].Correo_Electronico
            }

            variables = {
                Ruta_Form: '/admin/docente/actualizacion',
                Titulo: 'Actualizar Docente',
                Boton: 'Actualizar Docente'
            };

            res.redirect('/admin/docentes');
        }
    });

};

model.actualizar_docente = async (req, res) => {
    console.log("Id del Docente: " + Id_Docente);
    await pool.query("update persona set persona.Nombre = '" + req.body.NombreDocente + "', persona.Apellido = '" + req.body.ApellidoDocente + "', persona.Identificacion = " + req.body.Identificacion + ", persona.Correo_Electronico = '" + req.body.Correo + "' where persona.Id_Persona = " + Id_Docente, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error En el Proceso' + err
            }
            res.redirect('/admin/docentes');
        } else {
            console.log(result)
            LimpiarVariables();
            alerta = {
                tipo: 'correcto',
                mensaje: 'El Docente fue Modificado Correctamente'
            }
            res.redirect('/admin/docentes');
        }
    });
};

model.desactivar_docente = async (req, res) => {
    const { Id_Persona } = req.params;
    await pool.query("update registro_pe set registro_pe.Estado = 'INACTIVO' where registro_pe.Persona_Id_Persona = " + Id_Persona, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al registrar el Usuario' + err
            }
            res.redirect('/admin/docentes');
        } else {
            console.log(result)
            alerta = {
                tipo: 'correcto',
                mensaje: 'El Docente fue Desactivado'
            }
            res.redirect('/admin/docentes');
        }
    });
};

model.Cancelar_Docente = async (req, res) => {
    LimpiarVariables();
    res.redirect('/admin/docentes');
};
//#endregion

//------- Funciones de Limpieza de Variables ----------
//#region 
function LimpiarVariables() {
    variables = {
        Ruta_Form: '/admin/docente/creacion',
        Titulo: 'Registro Docente',
        Boton: 'Registrar Docente'
    };

    alerta = {
        tipo: '',
        mensaje: ''
    };

    Docente = {
        Nombre: '',
        Apellido: '',
        Identificacion: '',
        Correo: ''
    };

    Id_Persona = '';
}
//#endregion

module.exports = model;
