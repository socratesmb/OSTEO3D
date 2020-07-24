const pool = require('../database/database');
const mkdirp = require('mkdirp');
const randomstring = require('randomstring');
const helpers = require('../controllers/helper');

const model = {};

model.perfil = async (req, res) => {
    res.render('perfil.html');
};


module.exports = model;
