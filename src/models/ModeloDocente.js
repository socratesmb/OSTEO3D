const pool = require('../database/database');
const helpers = require('../controllers/helper');

const model = {};

// -------------- Seccion de Arreglos para Datos -----------
//#region 
let alerta = {
    tipo: '',
    mensaje: ''
};

let IDG = '';
//#endregion


//-------- Seccion de Grupos, creacion y vista de los grupos --------------
//#region 
model.grupos = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const ArrayGrupos = await pool.query("select * from lista_grupos where Id_Entidad = " + datos.Id_Entidad + " and Id_Persona = " + datos.Id_Empleado);

    res.render('Docente/grupos.html', { datos, menu, alerta, ArrayGrupos });
    LimpiarVariables();
};

model.agregar_grupos = async (req, res) => {
    datos = req.session.datos;

    await pool.query("select Registro_Grupos('" + req.body.NombreGrupo + "','" + req.body.Materia + "','" + req.body.CodigoGrupo + "','" + req.body.contrasena + "', " + datos.Id_Empleado + ", " + datos.Id_Entidad + ") as resultado;", (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/docente/grupos');
        } else {
            console.log(result)
            if (result[0].resultado == 0) {
                console.log(err)
                alerta = {
                    tipo: 'peligro',
                    mensaje: 'Error al crear el grupo' + err
                };
                res.redirect('/docente/grupos');
            } else {
                alerta = {
                    tipo: 'correcto',
                    mensaje: 'Grupo Creado Correctamente'
                };
                res.redirect('/docente/grupos');
            }
        }
    });
};

model.desactivar_grupo = async (req, res) => {
    const { Id_Grupo } = req.params;
    await pool.query("update inscripcion_grupo set inscripcion_grupo.Estado = 'INACTIVO' where inscripcion_grupo.Grupo_Id_Grupo = " + Id_Grupo, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/docente/grupos');
        } else {
            console.log(result)
            alerta = {
                tipo: 'correcto',
                mensaje: 'Grupo Desactivado'
            };
            res.redirect('/docente/grupos');
        }
    });
}

model.lista_grupos = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const { Id_Grupo } = req.params;
    IDG = Id_Grupo;

    const ArrayEstudiantes = await pool.query("select * from Lista_Estudiantes_Grupos where Id_Grupo = " + Id_Grupo);

    res.render('Docente/listagrupos.html', { datos, menu, ArrayEstudiantes, alerta });
    LimpiarVariables();
}

model.quitar_estudiante = async (req, res) => {
    const { Id_InsGrupo } = req.params;

    await pool.query("update inscripcion_grupo set inscripcion_grupo.Estado = 'INACTIVO' where inscripcion_grupo.Id_Inscripcion_Grupo = " + Id_InsGrupo, (err, result) => {
        if (err) {
            console.log(err)
            alerta = {
                tipo: 'peligro',
                mensaje: 'error' + err
            };
            res.redirect('/docente/grupos/ver/' + IDG);
        } else {
            console.log(result)
            alerta = {
                tipo: 'correcto',
                mensaje: 'Estudiante Eliminado'
            };
            res.redirect('/docente/grupos/ver/' + IDG);
            IDG = '';
        }
    });
}

//#endregion

//-------- Seccion para actividades creacion y asignacion --------------
//#region 
model.actividades = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;
    const DatosGrupo = await pool.query("select * from lista_grupos where Id_Entidad = " + datos.Id_Entidad);
    const ListaActividades = await pool.query("select * from Lista_Actividades where Id_Entidad =" + datos.Id_Entidad);

    res.render('Docente/actividades.html', { datos, menu, alerta, DatosGrupo, ListaActividades });
    LimpiarVariables();
};

model.guardar_actividad = async (req, res) => {
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

    var tit = str6.search('Titulo');
    var tit2 = str6.search(',MateriaGrupo');
    var tit1 = tit + 7;
    var titulo = str6.slice(tit1, tit2);

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

            console.log(titulo + " / " + pregunta + " / " + respuesta + " / " + opcion + " / 'ACTIVO' / " + req.body.MateriaGrupo);
            console.log('---------------------')

            await pool.query("INSERT INTO `cuestionario` (Id_Cuestionario, Titulo, Pregunta, Opcion, Estado, Valides, grupo_Id_Grupo) VALUES (default, '" + titulo + "', '" + pregunta + "', '" + respuesta + "', " + opcion + ", 'ACTIVO', " + req.body.MateriaGrupo + ");");
        }
    }

    alerta = {
        tipo: 'correcto',
        mensaje: 'Actividad Creada Exitosamente'
    };
    res.redirect('/docente/actividades');
}

//#endregion

//--------- Seccion para ver los resultados o notas ----------------
model.informes = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const ArrayGrupos = await pool.query("select * from lista_grupos where Id_Entidad = " + datos.Id_Entidad + " and Id_Persona = " + datos.Id_Empleado);

    res.render('Docente/informes.html', { datos, menu, alerta, ArrayGrupos });
    LimpiarVariables();
}

model.info_notas = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;

    const { Id_Grupo } = req.params;

    let Id_Personas = await pool.query("select distinct Persona_Id_Persona as id from respuestas where Grupo_Id_Grupo =" + Id_Grupo);

    if (Id_Personas.length > 0) {
        var ArrayNotas = [];

        for (let i = 0; i < Id_Personas.length; i++) {
            let nombres = await pool.query("select concat(Nombre, ' ' , Apellido) as nombre from persona where Id_Persona =" + Id_Personas[i].id);
            let nota = await CalculoNota(Id_Personas[i].id, Id_Grupo);

            console.log('-------------------------')
            console.log(nombres[0].nombre)
            console.log(nota)
            console.log('-------------------------')
            var nombress = nombres[0].nombre;

            ArrayNotas.push = (nombress, nota);
            console.log(ArrayNotas);
            console.log('-------------------------')
        }
        console.log(ArrayNotas);

        res.render('Docente/info_notas.html', { datos, menu, ArrayNotas, alerta });
        LimpiarVariables();

    } else {
        alerta = {
            tipo: 'inseguro',
            mensaje: 'No hay Respuestas de Estudiantes'
        };
        res.redirect('/docente/informes');
    }
}


//------- Funciones de Limpieza de Variables ----------
//#region 
function LimpiarVariables() {
    alerta = {
        tipo: '',
        mensaje: ''
    }
}

async function CalculoNota(Id_Persona, Id_Grupo) {
    let respuestas = await pool.query("select Cuestionario_Id_Cuestionario as Id, respuesta from respuestas where Grupo_Id_Grupo = " + Id_Grupo + " and Persona_Id_Persona =" + Id_Persona);
    let cuestionario = await pool.query("select Id_Cuestionario as Id, Estado from cuestionario where grupo_Id_Grupo =" + Id_Grupo);

    var nota = 0;

    for (let i = 0; i < cuestionario.length; i++) {
        if (cuestionario[i].Estado == 1) {
            if (cuestionario[i].id == respuestas[i].Id) {
                if (cuestionario[i].Estado == respuestas[i].respuesta) {
                    nota = nota + 1;
                }
            }
        }
    }

    if (nota > 5) {
        nota = 5;
    }

    return nota;

}
//#endregion


module.exports = model;