const pool = require('../database/database');
const helpers = require('../controllers/helper');

const model = {};

// -------------- Seccion de Arreglos para Datos -----------------
//#region 

let alerta = {
    tipo: '',
    mensaje: ''
};

var Id_Grupoo = '';
//#endregion

// -------- Seccion de Actividades, agregar, borrar y realizar activdades ---------
//#region 
model.actividades = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    console.log(datos);
    const DatosGrupo = await pool.query("select * from lista_grupos where Id_Entidad = " + datos.Id_Entidad);
    const ArrayGrupos = await pool.query("select * from Grupo_Estudiantes where Id_Entidad = " + datos.Id_Entidad + " and Id_Persona = " + datos.Id_Empleado);

    res.render('Estudiante/actividades.html', { datos, menu, alerta, DatosGrupo, ArrayGrupos });
    LimpiarVariables();
};

model.registro_grupo = async (req, res) => {
    datos = req.session.datos;
    console.log("Entro a la condicion")
    await pool.query("select Registro_Grupos_Estudiantes(" + req.body.MateriaGrupo + ", '" + req.body.contrasena + "', " + datos.Id_Empleado + ", " + datos.Id_Entidad + ") as resultado;", (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/estudiante/actividades');
        } else {
            console.log(result)
            if (result[0].resultado == 0) {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'Contraseña Incorrecta'
                };
                res.redirect('/estudiante/actividades');
            } else if (result[0].resultado == 1) {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'Ya Esta Registrado En El Grupo'
                };
                res.redirect('/estudiante/actividades');
            } else {
                alerta = {
                    tipo: 'correcto',
                    mensaje: 'Registro Exitoso'
                };
                res.redirect('/estudiante/actividades');
            }
        }
    });
};

model.salir_grupo = async (req, res) => {
    datos = req.session.datos;
    const { Id_Grupo } = req.params;
    await pool.query("update inscripcion_grupo set inscripcion_grupo.Estado = 'INACTIVO' where inscripcion_grupo.Grupo_Id_Grupo = " + Id_Grupo + " and inscripcion_grupo.Persona_Id_Persona = " + datos.Id_Empleado + " and inscripcion_grupo.Entidad_Id_Entidad = " + datos.Id_Entidad, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/estudiante/actividades');
        } else {
            console.log(result)
            alerta = {
                tipo: 'correcto',
                mensaje: 'Grupo Borrado'
            };
            res.redirect('/estudiante/actividades');
        }
    });
}

model.cargar_actividad = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    var { Id_Grupo } = req.params;
    Id_Grupoo = Id_Grupo;

    var Actividades = await pool.query("select * from cuestionario where cuestionario.grupo_Id_Grupo = " + Id_Grupo + " and cuestionario.Valides = 'ACTIVO'");
    //var Actividades2 = await pool.query("select cuestionario.Id_Cuestionario, cuestionario.Pregunta, cuestionario.Opcion from cuestionario where cuestionario.grupo_Id_Grupo = " + Id_Grupo + " and cuestionario.Valides = 'ACTIVO'");

    if (Actividades.length > 0) {
        res.render('Estudiante/preguntas_acti.html', { datos, menu, alerta, Actividades });
    } else {
        alerta = {
            tipo: 'inseguro',
            mensaje: 'El Grupo No Tiene Actividades Creadas'
        };
        res.redirect('/estudiante/actividades');
    };
}

model.guardar_actividad = async (req, res) => {
    datos = req.session.datos;
    var Actividades = await pool.query("select * from cuestionario where cuestionario.grupo_Id_Grupo = " + Id_Grupoo + " and cuestionario.Valides = 'ACTIVO'");
    let arreglo = JSON.stringify(req.body);

    var str1 = arreglo.replace('{', '');
    var str2 = str1.replace('}', '');

    var str3 = str2;
    var aux = '';

    for (let j = 0; j < str2.length; j++) {
        aux = str3.replace('"', '');
        str3 = aux;
    }

    var str5 = str3.split('/');
    var str6 = JSON.stringify(str5);

    var xx = 0;

    for (let i = 1; i < 6; i++) {
        var pre = 'Pregunta' + i;
        var ress = ',Respuesta' + i + 1;

        var var1 = str6.search(pre);
        var var2 = str6.search(ress);

        var var11 = var1 + 10;
        var pregunta = str6.slice(var11, var2);

        for (let j = 1; j < 5; j++) {
            var ress = 'Respuesta' + i + j;
            var opc = ',Opcion' + i + j;

            var x1 = str6.search(ress);
            var x2 = str6.search(opc);

            var x11 = x1 + 12;
            var x22 = x2 + 10;
            var x33 = x22 + 1;

            var respuesta = str6.slice(x11, x2);
            var opcion = str6.slice(x22, x33);

            console.log(pregunta + " / " + respuesta + " / " + opcion + " / " + Actividades[xx].Id_Cuestionario);
            console.log('---------------------')
            
            await pool.query("insert into `respuestas` (Id_Respuestas, Respuesta, Cuestionario_Id_Cuestionario, Persona_Id_Persona, Grupo_Id_Grupo) values (default, '" + opcion + "', " + Actividades[xx].Id_Cuestionario + ", " + datos.Id_Empleado + ", " + Id_Grupoo + ");");
            xx = xx + 1;
        }
    }

    alerta = {
        tipo: 'correcto',
        mensaje: 'Gracias por Realizar la Actividad'
    };
    res.redirect('/estudiante/actividades');
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