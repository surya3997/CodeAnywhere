var express = require('express');
var router = express.Router();
var path = require('path');
// var User = require('../models/user');


// GET route for reading data
router.get('/', function(req, res, next) {
    console.log("This is inside the router function! " + process.cwd());
    return res.sendFile(path.join(process.cwd() + '/frontend/index.html'));
});

module.exports = router;