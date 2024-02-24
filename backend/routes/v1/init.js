const express = require('express');
const init = express.Router();
const path = require('path');

init.get("/", async function (req, res, next) {
    res.json({
        'version': 1.0,
        'name': 'Express.js & Socket.io API boilerplate'
    });
});



module.exports = init
