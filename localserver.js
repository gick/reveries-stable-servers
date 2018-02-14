// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var Grid = require('gridfs-stream');
var expressWinston=require('express-winston')
var winston       = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var busboyBodyParser = require('busboy-body-parser');
var configDB = require('./config/localdatabase.js');
 var webdir = require('./config/localconfig.js')

Grid.mongo = mongoose.mongo;
// configuration ===============================================================
mongoose.connect(configDB[0].url); // connect to our database
require('./config/passport.js')(passport); // pass passport for configuration

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());

    // required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
console.log(mongoose.connection)
var gfs = new Grid(mongoose.connection.db);


// routes ======================================================================
require('./app/route/routes.js')(app, passport,webdir); // load our routes and pass in our app and fully configured passport
require('./app/route/filesroutes.js')(app, passport,gfs);
require('./app/route/documentroutes.js')(app,gfs);
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
console.log('Reveries server started on localhostkey: "value", ' + port);
