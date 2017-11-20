module.exports = function(app, passport, webdir) {

    // normal routes ===============================================================
    var express = require('express');
    var User = require('../models/user.js');
    var nodemailer = require("nodemailer");
    var crypto = require('crypto');
    var async = require('async')

    app.use(express.static(webdir));

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }
                    user.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        res.send({ operation: 'reset', success: true, info: 'Opération réussie, vous pouvez vous connecter a votre compte' })
                    });
                });
            },
        ], function(err) {
           // res.redirect('/#login');
        });
    });

    app.post('/forgot', function(req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                User.findOne({ email: req.body.email }, function(err, user) {

                    if (!user) {
                        res.send({ operation: 'reset', success: true, info: 'Pas de compte associé à ce mail' });
                        return
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {

                var smtpConfig = {
                    host: 'SSL0.OVH.NET',
                    port: 587,
                    secure: false, // upgrade later with STARTTLS
                    auth: {
                        user: 'conception@reveries-project.fr',
                        pass: 'twXLpAxH1984'
                    }
                };

                var transporter = nodemailer.createTransport(smtpConfig)
                var mailOptions = {
                    to: user.email,
                    from: 'passwordreset@reveries-project.fr',
                    subject: 'Réinitialiser votre mot de passe',
                    text: 'Vous avez reçu ce mail car vous avez demandé une réinitialisation de votre mot de passe.\n\n' +
                        'Copiez le lien suivant dans votre browser pour initier la réinitialisation:\n\n' +
                        'https://' + req.headers.host + '/reset/' + token + '\n\n'
                };
                transporter.sendMail(mailOptions, function(err) {
                    done(err, 'done');
                });
            }
        ], function(err) {
            res.send({ operation: 'reset', success: true, info: 'Un email à été envoyé à cette adresse' });
            if (err) return next(err);
        });


    })

    app.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.redirect('/#reset' + '?token=' + req.params.token);
        });
    });

    // PROFILE SECTION =========================
    // it is a way to know if user is currently authenticated (after reload for example)
    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ success: true, user: req.user })
        } else {
            req.logout()
            res.json({ success: false, info: "Login ou mot de passe incorrect" })
        }
    });

    app.get('/newprofile', function(req, res) {
        if (req.isAuthenticated()) {
            var user = req.user
            user.new = true
            res.json({ success: true, user: user })
        } else {
            res.json({ success: false })
        }
    });


    app.get('/newprofilefail', function(req, res) {
        req.logout()
        res.json({ success: false, info: "Le nom d'utilisateur est déjà utilisé" })
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE 
    // =============================================================================

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // if authentification succeeds, /profile will return user info
        failureRedirect: '/profile', // if authentification fails, /profile will return {success:false}
        failureFlash: true // allow flash messages
    }));



    // SIGNUP =================================
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/newprofile', // redirect to the secure profile section
        failureRedirect: '/newprofilefail', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));




    app.get('/listUser', function(req, res) {
        User.find({}, function(err, doc) {
            res.set({ 'Content-Type': 'application/json; charset=utf-8' })
            res.send(JSON.stringify(doc, undefined, 5))
        })

    });

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN)
    // =============================================================================

    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


};



















// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}