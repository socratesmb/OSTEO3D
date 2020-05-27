const express = require('express');
const rutas = express.Router();

const pool = require('../database/database');
const fileUpload = require('express-fileupload');
const passport = require('passport');

// ---- Carga Vista Principal ------
rutas.get('/', (req, res) => {
    res.render('login.html');
});

rutas.get('/recovery', (req, res) => {
    res.render('recovery.html')
});

rutas.get('/admin/creacion', (req, res) => {
    res.render('creacion.html');
});

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
rutas.get('/login', (req, res) => {
    res.render('index.html');
});
rutas.get('/registro', (req, res) => {
    res.render('registro.html');
});
rutas.get('/inicio', (req, res) => {
    res.render('publica.html');
});
rutas.get('/cuestionario', (req, res) => {
    res.render('cuestionario.html');
});
rutas.get('/preguntas', (req, res) => {
    res.render('preguntas.html');
});
module.exports = rutas;