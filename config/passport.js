// load all the things we need
var LocalStrategy = require('passport-local').Strategy
// load up the user model
var User = require('../app/models/user')
var dateFormat = require('dateformat')

// load the auth variables
module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	})

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user)
		})
	})

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	function(req, email, password, done) {
		// asynchronous
		process.nextTick(function() {
			User.findOne({ 'email': email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err)

				// if no user is found, return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.'))

				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))

				// all is well, return user
				else {
					var now = new Date()
					user.lastLogin = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT')
					user.save()
					return done(null, user)

				}
			})
		})

	}))

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({ 'email': email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err)
				// check to see if theres already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
				} else {
					var newUser = new User()
					newUser.email = email
					newUser.name=req.body.name
					newUser.password = newUser.generateHash(password)
					var isadmin = req.body.isadmin == 'on'
					newUser.isadmin = isadmin
					var now = new Date()
					newUser.creationDate = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT')
					newUser.lastLogin = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT')

					newUser.save(function(err) {
						if (err)
							return done(err)

						return done(null, newUser)
					})
				}

			})


		})

	}))





}