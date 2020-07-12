const passport = require('passport');
const pool = require('../database/database');


const modelo = {};
let alerta = {
    tipo: '',
    mensaje: ''
};

modelo.inicio = (req, res, next) => {
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