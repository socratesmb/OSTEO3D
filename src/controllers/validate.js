const passport = require('passport');
const pool = require('../database/database');

const model = {};

let alerta = {
    tipo: '',
    mensaje: ''
};

model.inicio = (req, res, next) => {
    passport.authenticate('local.signin', (error, user, data) => {
        if (error) {
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
                        req.session.menu = await pool.query("select * from menu_usuarios where menu_usuarios.Id_Entidad = " + req.session.Id_Entidad + " and menu_usuarios.Id_Persona = " + req.session.Id_Usuario);
                        console.log(req.session.menu);

                        if (user.Tipo_Usuario == 'SUPER ADMINISTRADOR') {
                            return res.redirect('/supadmin/home');

                        } if (user.Tipo_Usuario == 'ADMINISTRADOR') {
                            return res.redirect('/admin/inicio');
                            
                        } if (user.Tipo_Usuario == 'DOCENTE') {
                            return res.redirect('/models/inicio');
                            
                        } if (user.Tipo_Usuario = 'ESTUDIANTE') {
                            return res.redirect('/models/inicio');

                        }
                    }
                });
            }
        }
    })(req, res, next);
};

model.salir = (req, res) => {
    req.session.destroy(() => {
        req.logOut();
        res.clearCookie('CookieSession');
        res.status(200);
        res.redirect('/');
    });
};

module.exports = model;