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


//------------- Seccion de Login, Registro y Recuperacion de Password ---------------
//#region 
model.login = async (req, res) => {
    res.render('login.html', { alerta });
    LimpiarVariables();
};

model.recovery = async (req, res) => {
    res.render('recovery.html', { alerta });
    LimpiarVariables();
};

model.registro = async (req, res) => {
    const entidades = await pool.query("select entidad.Id_Entidad as Id_Entidad, entidad.Nombre as Nombre_Entidad from entidad");
    const identi = await pool.query("select * from identificacion where identificacion.Estado = 'ACTIVO'");

    res.render('registro.html', { alerta, entidades, identi });
};

model.recuperar_password = async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.identificacion);

    await pool.query("select persona.Correo_Electronico, usuario.Id_Usuario from persona inner join usuario on usuario.Persona_Id_Persona = persona.Id_Persona where persona.Correo_Electronico = '" + req.body.email + "' and persona.Identificacion = " + req.body.identificacion, async (err, result) => {
        if (err) {
            alerta = {
                tipo: 'inseguro',
                mensaje: 'El Usuario No Esta Registrado En Sistema',
            }
            res.redirect('/recovery');
        } else {
            console.log(result)
            if (result[0].Correo_Electronico == req.body.email) {
                var newpassword = randomstring.generate(6);
                var contrasena = await helpers.encryptPassword(newpassword);

                await pool.query("update usuario set usuario.Password = '" + contrasena + "' where usuario.Id_Usuario =" + result[0].Id_Usuario, async (erro, reulta) => {
                    if (err) {
                        console.log("Fallo de Modificacion" + err);
                    } else {
                        correo.PasswordCorreo(req.body.email, req.body.identificacion, newpassword);

                        alerta = {
                            tipo: 'correcto',
                            mensaje: 'El Usuario y Contraseña Fue Enviado al Correo, Porfavor Revise en Spam o Correo No Deseado',
                        }
                        res.redirect('/recovery');
                    }
                });
            }
        }
    });

};

model.registro_usuario = async (req, res) => {
    var contrasena = await helpers.encryptPassword(req.body.ContraseñaRegistro);

    await pool.query("call Registro_Usuario('" + req.body.NombreRegistro + "', '" + req.body.ApellidoRegistro + "', " + req.body.TipoDocumento + ", " + req.body.NumeroDocumento + ", '" + req.body.CorreoPerfil + "', " + req.body.Entidad + ", '" + contrasena + "')", async (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'Error al registrar el Usuario' + err
            }
            res.redirect('/registro');
        } else {
            correo.RegistroUsuario(req.body.CorreoPerfil, req.body.NumeroDocumento, req.body.ContraseñaRegistro);
            alerta = {
                tipo: 'correcto',
                mensaje: 'El Usuario Ha Sido Creado, Por favor Revise Su Correo En Sección De Spam O No Deseados.'
            }
            res.redirect('/registro');
        }
    });
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

// ------- Modelo para CargarVista Modelos3D y Objetos Partes Individuales ----------
//#region 
model.inicio = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const Lista_Animales = await pool.query("select * from lista_animales where Estado_Animal = 'ACTIVO' and Id_Entidad = 1 and Id_Entidad = " + datos.Id_Entidad);

    console.log(Lista_Animales)

    res.render('Generales/inicio.html', { datos, menu, alerta, Lista_Animales });
};


model.Cargar_Modelo3D = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;
    
    const { Id_Animal } = req.params;

    const List_Ani = await pool.query("select * from Lista_Modelos3D where Id_Animal =" + Id_Animal);   

    res.render('Generales/especie.html', { datos, menu, List_Ani});
};
//#endregion

//-------- Modelo para Crear y Registrar Modelos3D y sus partes -----------------
//#region 
model.Modelo3D = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const lista_animales = await pool.query("select * from Lista_Partes_Animales where id_entidad = " + datos.Id_Entidad);
    const sele_t_animal = await pool.query("select Id_Animal, N_Cientifico from lista_animales where id_entidad =" + datos.Id_Entidad);

    res.render('Generales/modelos3d.html', { datos, menu, alerta, lista_animales, sele_t_animal });
    LimpiarVariables();
};

model.Registro_Animal = async (req, res) => {
    datos = req.session.datos;
    await pool.query("select Registro_Animal('" + req.body.NombreAnimal + "','" + req.body.NombreCAnimal + "', '" + req.body.DescripcionAnimal + "', " + datos.Id_Entidad + ") as resultado;", (err, result) => {
        if (err) {
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            console.log(err)
            res.redirect('/supadmin/modelos');
        } else {
            if (result[0].resultado == 0) {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'El Animal Ya Esta Registrado En El Sistema, Porfavor Verifique'
                };
                res.redirect('/supadmin/modelos');
            } else {
                alerta = {
                    tipo: 'correcto',
                    mensaje: 'Nuevo Animal Registrado Exitosamente'
                };
                res.redirect('/supadmin/modelos');
            }
        }
    });
};

model.Resgistro_Hueso = async (req, res) => {
    datos = req.session.datos;
    await pool.query("select registro_parte_animal(" + req.body.IdAnimal + ", '" + req.body.NombreHueso + "', '" + req.body.DescripcionHueso + "', '" + req.body.CaracteristicasAnimal + "', '" + req.body.RutaHueso + "') as resultado;", (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/supadmin/modelos');
        } else {
            console.log(result)
            if (result[0].resultado == 0) {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'El Hueso o Parte de Animal que Intenta Ingresar Ya Esta Cargado en el Sistema'
                };
                res.redirect('/supadmin/modelos');
            } else {
                alerta = {
                    tipo: 'correcto',
                    mensaje: 'Nueva Parte de Animal Cargada Exitosamente'
                };
                res.redirect('/supadmin/modelos');
            }
        }
    });
};

model.Desactivar_Hueso = async (req, res) => {
    const { Id_Hueso } = req.params;
    await pool.query("update huesos set huesos.Estado = 'INACTIVO' where huesos.Id_Huesos =" + Id_Hueso, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/supadmin/modelos');
        } else {
            alerta = {
                tipo: 'correcto',
                mensaje: 'Nueva Parte de Animal Desactivada'
            };
            res.redirect('/supadmin/modelos');
        }
    });
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
