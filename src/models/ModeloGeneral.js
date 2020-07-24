const pool = require('../database/database');
const mkdirp = require('mkdirp');
const randomstring = require('randomstring');
const helpers = require('../controllers/helper');

const model = {};

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

model.perfil = async (req, res) => {
    datos = req.session.datos;
    menu = req.session.menu;
    
    const consulta = await pool.query("select usuario.Usuario as Usuario, persona.Nombre as Nombre, persona.Apellido as Apellido, persona.Identificacion as No_Documento, persona.Correo_Electronico as Correo, persona.Imagen as Imagen from persona inner join usuario on usuario.Id_Usuario = persona.Id_Persona where usuario.Id_Usuario = " + datos.Id_Usuario);

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

    console.log(Perfil);

    res.render('Generales/perfil.html', { datos, menu, Perfil });
};

module.exports = model;
