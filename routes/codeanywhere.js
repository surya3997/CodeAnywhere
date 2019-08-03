var express = require('express');
var router = express.Router();
var path = require('path');
// var User = require('../models/user');


/* // GET route for reading data
router.get('/', function(req, res, next) {
    console.log("index page visited! " + process.cwd());
    return res.sendFile(path.join(process.cwd() + '/frontend/index.html'));
}); */

// GET route for reading data
router.get('/codeanywhere/', function(req, res, next) {
    console.log("codeanywhere visited! " + process.cwd());
    return res.sendFile(path.join(process.cwd() + '/frontend/codeanywhere.html'));
});

module.exports = router;