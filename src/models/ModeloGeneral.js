const pool = require('../database/database');
const mkdirp = require('mkdirp');
const randomstring = require('randomstring');
const helpers = require('../controllers/helper');

const model = {};

// -------------- Seccion de Arreglos para Datos
//#region 

let alerta = {
    tipo: '',
    mensaje: ''
};

let Perfil = {
    Nombre: '',
    Apellido: '',
    No_Documento: '',
    Correo: '',
    Usuario: '',
    Entidad: '',
    Tipo_Entidad: '',
    Tipo_Usuario: '',
    Imagen: ''
}

//#endregion


//------------- Seccion de Login, Rgistro y Recuperacion de Password ---------------
//#region 
model.login = async (req, res) => {
    res.render('login.html', { alerta });
    LimpiarVariables();
};
//#endregion


//------------ Seccion de Perfil, Actualizacion y Cambio de Password --------------
//#region 

model.perfil = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const mod = await pool.query("select persona.Modificacion from persona where persona.Id_Persona = " + datos.Id_Empleado);        
    if (mod[0].Modificacion == 0) {
        console.log('Entro a la alerta')
        alerta = {
            tipo: 'registro',
            mensaje: 'Bienvenid@ A Osteo3D Para Seguir Con El Procedimiento Por Favor Modifique Sus Datos'
        };
    }

    const consulta = await pool.query("select usuario.Usuario as Usuario, persona.Nombre as Nombre, persona.Apellido as Apellido, persona.Identificacion as No_Documento, persona.Correo_Electronico as Correo, persona.Imagen as Imagen from persona inner join usuario on usuario.Id_Usuario = persona.Id_Persona where usuario.Id_Usuario = " + datos.Id_Empleado);

    Perfil = {
        Nombre: consulta[0].Nombre,
        Apellido: consulta[0].Apellido,
        No_Documento: consulta[0].No_Documento,
        Correo: consulta[0].Correo,
        Usuario: consulta[0].Usuario,
        Entidad: datos.Nombre_Entidad,
        Tipo_Entidad: datos.Tipo_Entidad,
        Tipo_Usuario: datos.Tipo_Usuario,
        Imagen: consulta[0].Imagen
    }    

    res.render('Generales/perfil.html', { datos, menu, Perfil, alerta });
    LimpiarVariables();
};

model.perfil_update = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    console.log(datos);

    await pool.query("update persona set persona.Nombre = '" + req.body.NombrePerfil + "', persona.Apellido = '" + req.body.ApellidoPerfil + "', persona.Correo_Electronico = '" + req.body.CorreoPerfil + "', persona.Modificacion = 1 where persona.Id_Persona = " + datos.Id_Empleado, (err, result) => {
        if (err) {
            alerta = {
                tipo: 'peligro',
                mensaje: 'No Se Puedo Actualizar Los Datos'
            };

            res.redirect('/perfil');
        } else {
            alerta = {
                tipo: 'correcto',
                mensaje: 'Actualización Exitosa, Para Continuar Con El Proceso Por Favor Vuelva A Iniciar Sesión'
            };

            res.redirect('/perfil');
        }
    });
}

model.password_update = async (req, res) => {
    datos = req.session.datos;
        
    await pool.query("select usuario.Password from usuario where usuario.Id_Usuario = " + datos.Id_Usuario, async (err, result) => {
        console.log(result)
        if (err) {
            alerta = {
                tipo: 'inseguro',
                mensaje: 'Contraseña Incorrecta'
            }
            res.redirect('/perfil');
        } else {
            const pass = req.body.ContraseñaPerfil;

            const validaUser = await helpers.macthPassword(pass, result[0].Password);
            if (validaUser) {
                var newpassword = req.body.ContraNuevaPerfil;
                var contrasena = await helpers.encryptPassword(newpassword);
                await pool.query("update usuario set usuario.Password = '" + contrasena + "' where usuario.Id_Usuario =" + datos.Id_Usuario, (err, result) => {
                    if (err) {
                        alerta = {
                            tipo: 'peligro',
                            mensaje: 'Error al Cambiar la Contraseña' + err
                        }
                        res.redirect('/perfil');
                    } else {
                        alerta = {
                            tipo: 'correcto',
                            mensaje: 'Contraseña Modificada, Por Su Seguridad Por Favor Vuelva A Iniciar Sesión'
                        }                        
                        res.redirect('/perfil');
                    }
                });
            } else {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'Contraseña Incorrecta'
                }
                res.redirect('/perfil');
            }
        }
    })
};
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
