const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const pool = require('../database/database');
const helpers = require('./helper');

// ------------ Variables de Usuario Estaticas -------------

let Persona = {
    Id_Entidad: '',
    Nombre_Entidad: '',
    Nit_Entidad: '',
    Tipo_Entidad: '',
    Id_Empleado: '',
    Nombre_Usuario: '',
    Tipo_Usuario: ''
};

// ------------- Iniciar Sesion ------------
passport.use('local.signin', new Strategy({
    usernameField: 'nombre',
    passwordField: 'contrase',
    passReqToCallback: true
}, async (req, nombre, contrase, done) => {
    const row = await pool.query('select * from usuario where nombre = ?', [nombre]);
    console.log(row.length);
    if (row.length > 0) {
        const user = row[0];
        console.log(user)
        const validaUser = await helpers.macthPassword(contrase, user.contrase);
        console.log(validaUser)
        if (validaUser) {
            console.log('entro')
            done(null, user);
        } else {
            console.log('no entro')
            done(null, false);
        }
    } else {
        console.log('no hizo')
        done(null, false);
    }
}));

// -------- Registrar un SuperUsuario ------------
passport.use('local.signup', new Strategy({
    usernameField: 'Usuario',
    passwordField: 'Password',
    passReqToCallback: true
}, async (req, Usuario, Password, done) => {
    let newUser = {
        Usuario,
        Password
    };
    console.log(newUser);
    newUser.Password = await helpers.encryptPassword(Password);
    //Guardamos Datos    
    const consulta = "INSERT INTO usuario (Id_Usuario, Usuario, Password, Persona_Id_Persona) values (default,'" + newUser.Usuario + "','" + newUser.Password + "', '1');";
    console.log(consulta)
    const result = await pool.query(consulta);
    newUser.id = result.insertId;
    console.log(newUser.id)
    return done(null, newUser);
}));

// ------ Codificar el Usuario --------
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
});

// ----- Descodificar el usuario ------
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('select * from usuario where id_usuario = ?', [id]);
    done(null, rows[0]);
});
