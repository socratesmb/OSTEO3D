const express = require('express');
const rutas = express.Router();

const pool = require('../database/database');
const fileUpload = require('express-fileupload');
const passport = require('passport');

// ---------- Controladores --------------
const controlValidacion = require('../controllers/validate');
const controlSuperAdmin = require('../models/ModeloSuperAdmin');
const controlAdmin = require('../models/ModeloAdministrador');
const controlDocen = require('../models/ModeloDocente');
const controlEstud = require('../models/ModeloEstudiante');
const controlGeneral = require('../models/ModeloGeneral');

// --------- Seccion Protegida de Creacion Usuario ----------------

rutas.get('/admin/creacion', (req, res) => {
    res.render('creacion.html');
});

rutas.post('/add', passport.authenticate('local.signup', {
    successRedirect: '/admin/creacion',
    failureRedirect: '/',
    failureFlash: true
}));

// ---- Carga Vista Principal ------
rutas.get('/', (req, res) => {
    res.render('index.html');
});

// --------- Modeleo para cerrar sesion y salir ---------
rutas.get('/salir', controlValidacion.salir);

// ----- Cargar Vista de Login, Inicio de Sesion --------
rutas.get('/login', controlGeneral.login);

rutas.post('/signin', controlValidacion.inicio);


// ------- Seccion de Super Administrador -------------

rutas.get('/supadmin/home', controlSuperAdmin.inicio);

rutas.get('/supadmin/entidades', controlSuperAdmin.entidades);

rutas.post('/supadmin/Regis_Entidad', controlSuperAdmin.registro_entidades);

rutas.get('/supadmin/buscar_entidad/:Id_Entidad', controlSuperAdmin.buscar_entidad);

rutas.post('/supadmin/actualizar_entidad', controlSuperAdmin.actualizar_entidad);

rutas.get('/supadmin/bloquear_entidad/:Id_Entidad', controlSuperAdmin.desactivar_entidad);

rutas.get('/supadmin/cancelar', controlSuperAdmin.cancelar_modificacion);
// ------- Seccion de Administrador -------------

rutas.get('/admin/inicio', controlAdmin.inicio);

// ------- Seccion de Docente --------------

// ------- Seccion de Estudiante --------------

rutas.get('/models/inicio', controlEstud.inicio);

// ------- Seccion Vistas Generales -------------

rutas.get('/perfil', controlGeneral.perfil);

rutas.post('/actualizar_perfil', controlGeneral.perfil_update);

rutas.post('/actualizar_password', controlGeneral.password_update);

rutas.get('/recovery', controlGeneral.recovery);

rutas.post('/send/recovery', controlGeneral.recuperar_password);

rutas.get('/registro', controlGeneral.registro);

rutas.post('/crear/usuario', controlGeneral.registro_usuario);
//-----------------------------------------
rutas.get('/Especies', (req, res) => {
    res.render('especies.html');
});

rutas.get('/Grupos', (req, res) => {
    res.render('grupos.html');
});

rutas.get('/Caracteristica', (req, res) => {
    res.render('Caracteristicas_especie.html');
});



rutas.get('/inicio', (req, res) => {
    res.render('inicio.html');
});
rutas.get('/cuestionario', (req, res) => {
    res.render('cuestionario.html');
});
rutas.get('/preguntas', (req, res) => {
    res.render('preguntas.html');
});
module.exports = rutas;