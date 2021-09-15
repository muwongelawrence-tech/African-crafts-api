const root = require('../routes/home');
const shoes = require("../routes/shoes");
const users = require("../routes/users");
const materials = require("../routes/materials");
const auth = require("../routes/auth");
const cors = require('cors');
const error = require("../middleware/error");
const express = require('express');

module.exports =  function(app) {
    app.use(express.json());
    app.use(express.static('public'));
    app.use(cors());
    app.use('/',root);
    app.use('/api/users',users);
    app.use('/api/shoes',shoes);
    app.use('/api/materials',materials);
    app.use('/api/auth', auth);

    //logging error middleware in express
    app.use(error);

}