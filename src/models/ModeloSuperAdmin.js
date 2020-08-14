const pool = require('../database/database');
const helpers = require('../controllers/helper');
const randomstring = require('randomstring');
const correo = require('../models/ModeloCorreo');
const { body } = require('express-validator');

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

let variables = {
    Ruta_Form: '/supadmin/Regis_Entidad',
    Titulo: 'Registro Entidad',
    Boton: 'Registrar Entidad'
};

let Id_Company = '';
let ID_TEntidad = '';
let ID_Identifi = '';

let Variables_Configuracion = {
    BotonEntidad: 'Guardar',
    TituloEntidad: 'Tipo Entidades',
    RutaEntidad: '/supadmin/Registro_TEntidades',
    BotonIdentificacion: 'Guardar',
    TituloIdentificacion: 'Identificacion',
    RutaIdentificacion: '/supadmin/Registro_Identificacion'
};

let Tipo_Entidad = {
    Nombre_Entidad: '',
    No_Usuarios: ''
}

let Tipo_Identificacion = '';
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

    const entidades = await pool.query("select * from Lista_Entidades");
    const sele_t_entidad = await pool.query("select tipo_entidad.Id_Tipo_Entidad, tipo_entidad.Nombre from tipo_entidad where Estado = 'ACTIVO'");

    res.render('SuperAdmin/entidades.html', { datos, menu, alerta, entidades, variables, sele_t_entidad, Entidad });

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
    };
};

model.buscar_entidad = async (req, res) => {
    const { Id_Entidad } = req.params;
    Id_Company = Id_Entidad;

    await pool.query("select * from Lista_Entidades where Id_Entidad = " + Id_Entidad, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: err
            };

            res.redirect('/supadmin/entidades');
        } else {
            console.log(result)

            Entidad = {
                TipoEntidad: result[0].Tipo_Entidad,
                NombreEntidad: result[0].Nombre_Entidad,
                NitEntidad: result[0].Nit_Entidad,
                TelefonoEntidad: result[0].Telefono_Entidad,
                DireccionEntidad: result[0].Direccion_Entidad,
                CorreoEntidad: result[0].Correo_Entidad,
                PlanPago: 'disabled',
                NoUsuarios: result[0].No_Usuarios,
                NombreContacto: result[0].Encargado_Entidad,
                IdContacto: result[0].Id_Encargado
            };

            variables = {
                Ruta_Form: '/supadmin/actualizar_entidad',
                Titulo: 'Actualizacion de Entidad',
                Boton: 'Actualizar Entidad'
            }

            res.redirect('/supadmin/entidades');
        }
    });
};

model.actualizar_entidad = async (req, res) => {
    console.log("Id de la Empresa " + Id_Company);
    await pool.query("update entidad set entidad.Nombre = '" + req.body.NombreEntidad + "', entidad.Tipo_Entidad_Id_Tipo_Entidad = " + req.body.TipoEntidad + ", entidad.Nit = " + req.body.NitEntidad + ", entidad.Telefono = '" + req.body.TelefonoEntidad + "', entidad.Direccion = '" + req.body.DireccionEntidad + "', entidad.Correo_Electronico = '" + req.body.CorreoEntidad + "', entidad.Encargado = '" + req.body.NombreContacto + "', entidad.No_Usuarios = " + req.body.NoUsuarios + " where entidad.Id_Entidad = " + Id_Company, (err, result) => {
        if (err) {
            console.log(err)
            Id_Company = '';
            LimpiarVariables();
            alerta = {
                tipo: 'peligro',
                mensaje: "No Se Pudo Actualizar La Entidad" + err
            };
            res.redirect('/supadmin/entidades');
        } else {
            Id_Company = '';
            LimpiarVariables();
            alerta = {
                tipo: 'correcto',
                mensaje: 'Entidad Modificada Correctamente'
            };

            res.redirect('/supadmin/entidades');
        }
    });

};

model.desactivar_entidad = async (req, res) => {
    const { Id_Entidad } = req.params;

    await pool.query("update entidad set entidad.Estado = 'INACTIVO' where entidad.Id_Entidad =" + Id_Entidad, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: err
            };

            res.redirect('/supadmin/entidades');
        } else {
            alerta = {
                tipo: 'correcto',
                mensaje: 'La Entidad Fue Inactivada Correctamente'
            };

            res.redirect('/supadmin/entidades');
        }
    })
};

model.cancelar_modificacion = async (req, res) => {
    LimpiarVariables();
    Id_Company = '';
    res.redirect('/supadmin/entidades');
};
//#endregion

//-------- Modelo para Cargar Vista de Configuracion de Datos Generales ------------
//#region 
model.configuracion = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const TEnti = await pool.query("select * from tipo_entidad");
    const TIden = await pool.query("select  * from identificacion");

    res.render('SuperAdmin/configuracion.html', { datos, menu, alerta, TEnti, TIden, Variables_Configuracion, Tipo_Entidad, Tipo_Identificacion });
    LimpiarVariables2();

}

model.Guardar_Tipo_Entidad = async (req, res) => {
    await pool.query("insert into tipo_entidad values (default, '" + req.body.NomTipoEntidad + "', 'ACTIVO', " + req.body.NumeroUsuarios + ")", (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            alerta = {
                tipo: 'correcto',
                mensaje: 'Nuevo Tipo de Entidad Creada Correctamente'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Consultar_Tipo_Entidad = async (req, res) => {
    const { Id_Tipo_Entidad } = req.params;
    ID_TEntidad = Id_Tipo_Entidad;

    await pool.query("select tipo_entidad.Nombre as NombreTipoEntidad, tipo_entidad.No_Usuarios from tipo_entidad where tipo_entidad.Id_Tipo_Entidad = " + Id_Tipo_Entidad, (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error de consulta' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            console.log(result)

            Tipo_Entidad = {
                Nombre_Entidad: result[0].NombreTipoEntidad,
                No_Usuarios: result[0].No_Usuarios
            }

            Variables_Configuracion = {
                BotonEntidad: 'Actualizar Entidad',
                TituloEntidad: 'Actualizar Entidades',
                RutaEntidad: '/supadmin/Actualizacion_TEntidades',
                BotonIdentificacion: 'Guardar',
                TituloIdentificacion: 'Identificacion',
                RutaIdentificacion: '/supadmin/Registro_Identificacion'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Actualizar_Tipo_Entidad = async (req, res) => {
    console.log("Id del Tipo de Entidad Es: " + ID_TEntidad);
    await pool.query("update tipo_entidad set tipo_entidad.Nombre = '" + req.body.NomTipoEntidad + "', tipo_entidad.No_Usuarios = " + req.body.NumeroUsuarios + " where tipo_entidad.Id_Tipo_Entidad = " + ID_TEntidad, (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'No se Pudo Actualizar los Datos' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            ID_TEntidad = '';
            alerta = {
                tipo: 'correcto',
                mensaje: 'Datos Modificados Correctamente'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Desactivar_Tipo_Entidad = async (req, res) => {
    const { Id_Tipo_Entidad } = req.params;
    await pool.query("update tipo_entidad set tipo_entidad.Estado = 'INACTIVO' where tipo_entidad.Id_Tipo_Entidad =" + Id_Tipo_Entidad, (err, result) => {
        if (err) {
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al Desactivar la Entidad' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            alerta = {
                tipo: 'correcto',
                mensaje: 'Regristro Desactivado Correctamente'
            };
            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Guardar_Identificacion = async (req, res) => {
    await pool.query("insert into identificacion values (default, '" + req.body.TipoIdentificacion + "', 'ACTIVO')", (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: err
            };

            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            alerta = {
                tipo: 'correcto',
                mensaje: 'Nueva Identificacion Creada Correctamente'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Consultar_Identificacion = async (req, res) => {
    const { Id_Identificacion } = req.params;
    ID_Identifi = Id_Identificacion;

    await pool.query("select identificacion.Tipo as Tipo from identificacion where identificacion.Id_Identificacion = " + Id_Identificacion, (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error de consulta' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            console.log(result)

            Tipo_Identificacion = result[0].Tipo;

            Variables_Configuracion = {
                BotonEntidad: 'Guardar',
                TituloEntidad: 'Tipo Entidades',
                RutaEntidad: '/supadmin/Registro_TEntidades',
                BotonIdentificacion: 'Actualizar Identificacion',
                TituloIdentificacion: 'Actualizar Identificacion',
                RutaIdentificacion: '/supadmin/Actualizacion_Identificacion'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Actualizar_Identificacion = async (req, res) => {
    console.log("Id de la Identificacion Es: " + ID_Identifi);
    await pool.query("update identificacion set identificacion.Tipo = '" + req.body.TipoIdentificacion + "' where identificacion.Id_Identificacion =" + ID_Identifi, (err, result) => {
        if (err) {
            console.log(err)
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'No se Pudo Actualizar los Datos' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            ID_Identifi = '';
            alerta = {
                tipo: 'correcto',
                mensaje: 'Datos Modificados Correctamente'
            };

            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Desactivar_Identificacion = async (req, res) => {
    const { Id_Identificacion } = req.params;
    await pool.query("update identificacion set identificacion.Estado = 'INACTIVO' where identificacion.Id_Identificacion =" + Id_Identificacion, (err, result) => {
        if (err) {
            LimpiarVariables2();
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al Desactivar la Entidad' + err
            };
            res.redirect('/supadmin/configuracion');
        } else {
            LimpiarVariables2();
            alerta = {
                tipo: 'correcto',
                mensaje: 'Regristro Desactivado Correctamente'
            };
            res.redirect('/supadmin/configuracion');
        }
    });
};

model.Cancelar_TI_Modificaciones = async (req, res) => {
    ID_TEntidad = '';
    ID_Identifi = '';
    LimpiarVariables2();
    res.redirect('/supadmin/configuracion');
};
//#endregion

//------- Funciones de Limpieza de Variables ----------
//#region 
function LimpiarVariables() {
    alerta = {
        tipo: '',
        mensaje: ''
    };

    variables = {
        Ruta_Form: '/supadmin/Regis_Entidad',
        Titulo: 'Registro Entidad',
        Boton: 'Registrar Entidad'
    }

    Entidad = {
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

};

function LimpiarVariables2() {
    Variables_Configuracion = {
        BotonEntidad: 'Guardar',
        TituloEntidad: 'Tipo Entidades',
        RutaEntidad: '/supadmin/Registro_TEntidades',
        BotonIdentificacion: 'Guardar',
        TituloIdentificacion: 'Identificacion',
        RutaIdentificacion: '/supadmin/Registro_Identificacion'
    };

    Tipo_Entidad = {
        Nombre_Entidad: '',
        No_Usuarios: ''
    };

    Tipo_Identificacion = '';

    alerta = {
        tipo: '',
        mensaje: ''
    };
};

function LimpiarVariables3() {

};
//#endregion
module.exports = model;