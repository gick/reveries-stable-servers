module.exports = function(app, passport) {

// normal routes ===============================================================
    var express  = require('express');
    var User = require('../models/user.js');

    app.use(express.static('/home/pgicquel/reveries/reveries-project/app'));
    app.use(express.static('/home/pgicquel/Downloads/'));




    // PROFILE SECTION =========================
    app.get('/profile', function(req, res) {
        if(req.isAuthenticated()){
        res.json({success:true,user:req.user})}
        else
        {
        res.json({success:false})}
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/profile', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));




        // SIGNUP =================================
        // show the signup form

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/profile', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.post('/mail', isLoggedIn, function(req,res) {
            var user = User.findOne({name:req.user.name});
            console.log(req.body);

        });



        app.post('/testmail', function(req,res) {
            res.send(req.body);
        });

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};



















// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
