var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var User = require('../models/users');
var ExpressBrute = require('express-brute');
var storemem = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var arr = require('./compilers');
var sandBox = require('./DockerSandbox');
var saveUser = '';

var bruteforce = new ExpressBrute(storemem, {
    freeRetries: 50,
    lifetime: 3600
});

// GET route for reading data
router.get('/', function(req, res, next) {
    return res.sendFile(path.join(process.cwd() + '/views/index.html'));
});

// GET route for reading data
router.get('/codeanywhere', function(req, res, next) {
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
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("<h1>passwords dont match<h1>");
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
                res.send("<h1>Error creating user!<br>Please try after sometime or with different email id!<h1>");
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                res.send("<h1>Wrong email or password.<h1>");
                return next(err);
            } else {
                req.session.cookie.expires = false
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        res.send("<h1>All fields required!<h1>");
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
                    return res.send("<h1>Not Authorized! Go back!</h1>");
                } else {
                    saveUser = user.firstname;
                    return res.sendFile(path.join(process.cwd() + '/views/coder.html'));
                }
            }
        });
});

router.post('/getUserName', function(req, res, next) {
    return res.send('{"name": "' + saveUser + '"}');
})

// GET for logout logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                res.send("<h1>Error logging out of your account!<h1>");
                return next(err);
            } else {
                saveUser = '';
                return res.redirect('/codeanywhere');
            }
        });
    }
});

function random(size) {
    //returns a crypto-safe random
    return require("crypto").randomBytes(size).toString('hex');
}

router.post('/compileCode', function(req, res, next) {
    var language = req.body.language;
    var code = req.body.code;

    var objectId = req.session.userId;

    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                res.send("<h1>There is an error verifying your account. Try again!<h1>");
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    res.send("<h1>Not authorized! Go back!<h1>");
                    return next(err);
                }
            }
        });

    var userDirectory = path.join(process.cwd() + '/compiler/source/' + objectId + '/');
    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, { recursive: true });
    }
    console.log(userDirectory);
    var newLang = '7';
    switch (language) {
        case 'C':
            var ts = Math.round((new Date()).getTime() / 1000);
            fs.writeFile(userDirectory + ts.toString() + '.c', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            fs.writeFile(userDirectory + 'compile.c', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            newLang = '7';
            break;
        case 'C++':
            var ts = Math.round((new Date()).getTime() / 1000);
            fs.writeFile(userDirectory + ts.toString() + '.cpp', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            fs.writeFile(userDirectory + 'compile.cpp', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            newLang = '7';
            break;
        case 'Java':
            var ts = Math.round((new Date()).getTime() / 1000);
            fs.writeFile(userDirectory + ts.toString() + '.java', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            fs.writeFile(userDirectory + 'compile.java', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            newLang = '8';
            break;
        case 'Python':
            var ts = Math.round((new Date()).getTime() / 1000);
            fs.writeFile(userDirectory + ts.toString() + '.py', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            fs.writeFile(userDirectory + 'compile.py', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            newLang = '0';
            break;
        case 'Go':
            var ts = Math.round((new Date()).getTime() / 1000);
            fs.writeFile(userDirectory + ts.toString() + '.go', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            fs.writeFile(userDirectory + 'compile.go', code, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
            newLang = '6';
            break;
        default:
    }

    var stdin = '';
    language = newLang;

    var folder = 'temp/' + random(10); //folder in which the temporary folder will be saved

    var work_path = __dirname + "/"; //current working path
    var vm_name = 'virtual_machine'; //name of virtual machine that we want to execute
    var timeout_value = 30; //Timeout Value, In Seconds

    //details of this are present in DockerSandbox.js
    var sandboxType = new sandBox(timeout_value, work_path, folder, vm_name, arr.compilerArray[language][0], arr.compilerArray[language][1], code, arr.compilerArray[language][2], arr.compilerArray[language][3], arr.compilerArray[language][4], stdin);


    //data will contain the output of the compiled/interpreted code
    //the result maybe normal program output, list of error messages or a Timeout error
    sandboxType.run(function(data, exec_time, err) {
        console.log("Data received: " + data);
        res.send({ output: data, langid: language, code: code, errors: err, time: exec_time });
    });

})

module.exports = router;