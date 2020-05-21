const express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    session = require('express-session'),
    mysqlsession = require('express-mysql-session')(session),
    passport = require('passport');

// Carga de archivos
const fileUpload = require('express-fileupload')

const { database } = require('./keys');
// Inicializacion
const app = express();
require('./controllers/passport');

// Importar rutas
const routes = require('./rutas/rutas');

// Configuracion
app.set('port', 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var sqlsession = new mysqlsession(database);

// Middlewares
app.use(session({
    secret: 'MasterCode',
    name: 'CookieSession',
    resave: false,
    saveUninitialized: false,
    store: sqlsession,
    cookie: {
        secure: false,
        maxAge: 36000000,
        httpOnly: false,
    }
}));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser());
app.use(methodOverride());


// Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('mensaje');
    app.locals.user = req.user;
    next();
});

// Rutas
app.use(routes);

// Cargar Archivos
app.use(fileUpload());


// Funcion para mostrar el error 404
function error404(req, res, next) {
    let error = new Error();
    error.status = 404
    res.render('./partials/404.html');
    next();
};

// Funcion para capturar los errores
function logErrors(err, req, res, next) {
    console.error(err.stack, 'asd');
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.redirect('/');
}

// Codificar el Usuario
passport.serializeUser((user, done) => {
    done(null, user);
});

// Descodificar el usuario
passport.deserializeUser(async (id, done) => {    
    await pool.query('select * from login where id_login = ?', [id.id_login], (err, user) => {
        if (err) {
            console.log(err);
            done(err);
        } else {            
            done(err, user);
        }
    });
});

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log(`servidor en linea en puerto: ${app.get('port')}`);
});

// Metodo para usar el error 404 y cargar los demas errores
app.use(error404);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);