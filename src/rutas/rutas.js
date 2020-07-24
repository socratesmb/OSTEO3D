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
rutas.get('/login', (req, res) => {
    res.render('login.html');
});

rutas.post('/signin', controlValidacion.inicio);

// ------ Cargar vista de Recuperar Contraseña ---------
rutas.get('/recovery', (req, res) => {
    res.render('recovery.html')
});

// ----- Cargar vista de Registro ------------
rutas.get('/registro', (req, res) => {
    res.render('registro.html');
});

// ------- Seccion de Super Administrador -------------

rutas.get('/supadmin/home', controlSuperAdmin.inicio);
// ----- Cargar vista de Registro de Entidad ------------
rutas.get('/entidades', (req, res) => {
    res.render('Entidades.html');
});
// ------- Seccion de Administrador -------------

// ------- Seccion de Docente --------------

// ------- Seccion de Estudiante --------------

// ------- Seccion Vistas Generales



rutas.get('/Especies', (req, res) => {
    res.render('especies.html');
});

rutas.get('/Grupos', (req, res) => {
    res.render('grupos.html');
});

rutas.get('/Caracteristica', (req, res) => {
    res.render('Caracteristicas_especie.html');
});
rutas.get('/perfil', (req, res) => {
    res.render('perfil.html');
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