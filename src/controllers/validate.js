const passport = require('passport');
const pool = require('../database/database');
const { mode } = require('crypto-js');

const model = {};
let alerta = {
    tipo: '',
    mensaje: ''
};

//Creacion del primer super usuario
model.insertar = passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
});

model.inicio = (req, res, next) => {
    passport.authenticate('local.signin', (error, user, data) => {
        if (err) {
            alerta = {
                tipo: 'inseguro',
                mensaje: 'Usuario o Contraseña Incorrecto'
            }
            res.render('index.html', { alerta });
        } else {
            if (data) {
                alerta = {
                    tipo: 'inseguro',
                    mensaje: 'El Usuario Esta Inactivo'
                }
                res.render('index.html', { alerta });
            } else {
                req.logIn(user, async (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        req.session.menu = await pool.query("")
                    }
                });
            }
        }
    })(req, res, next);
};