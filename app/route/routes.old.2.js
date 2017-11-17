module.exports = function(app, passport,webdir) {

    // normal routes ===============================================================
    var express = require('express');
    var User = require('../models/user.js');
    app.use(express.static(webdir));




    // PROFILE SECTION =========================
    // it is a way to know if user is currently authenticated (after reload for example)
    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ success: true, user: req.user })
        } else {
            req.logout()
            res.json({ success: false ,info:"Login ou mot de passe incorrect"})
        }
    });

    app.get('/newprofile', function(req, res) {
        if (req.isAuthenticated()) {
            var user=req.user
            user.new=true
            res.json({ success: true, user: user })
        } else {
            res.json({ success: false })
        }
    });


    app.get('/newprofilefail', function(req, res) {
            req.logout()
            res.json({ success: false ,info:"Le nom d'utilisateur est déjà utilisé"})
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
        User.find({},function(err,doc){
            res.set({'Content-Type': 'application/json; charset=utf-8'})
            res.send(JSON.stringify(doc,undefined,5))})
        
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