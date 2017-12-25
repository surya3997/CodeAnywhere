var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/users');


// GET route for reading data
router.get('/', function(req, res, next) {
    //console.log("index page visited! " + process.cwd());
    return res.sendFile(path.join(process.cwd() + '/views/index.html'));
});

// GET route for reading data
router.get('/codeanywhere', function(req, res, next) {
    //console.log("codeanywhere visited! " + process.cwd());
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    return res.sendFile(path.join(process.cwd() + '/views/codeanywhere.html'));
                } else {
                    return res.redirect('/profile');
                }
            }
        });

});

//POST route for updating data
router.post('/codeanywhere', function(req, res, next) {
    // confirm that user typed same password twice
    console.log(req.body);
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function(error, user) {
            if (error) {
                console.log('There is an error!');
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        console.log(req.body);
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

// GET route after registering
router.get('/profile', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.sendFile(path.join(process.cwd() + '/views/coder.html'));
                    // return res.send('<h1>Name: </h1>' + user.firstname + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
});

// GET for logout logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/codeanywhere');
            }
        });
    }
});

module.exports = router;