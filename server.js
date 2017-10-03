// server.js

// set up ======================================================================
// get all the tools we need

// To index :
// db.staticmedia.createIndex({label:'text',mkdown:'text',})
//db.freetexts.createIndex({label:'text',question:'text',response:'text',correctMessage:'text',wrongMessage:'text'})
//db.mcqs.createIndex({label:'text',correctMessage:'text',distractor1:'text',distractor2:'text',question:'text',response:'text',correctMessage:'text',wrongMessage:'text'})
// db.badges.createIndex({label:'text',badgeText:'text',})
// db.inventoryitems.createIndex({label:'text',itemText:'text',})

var express  = require('express');
var app      = express();
var HTTPS_PORT = 443;
var https = require('https')
var fs=require('fs')

var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var Grid = require('gridfs-stream');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var busboyBodyParser = require('busboy-body-parser');
var configDB = require('./config/database.js');
var webdir = require('./config/config.js');
Grid.mongo = mongoose.mongo;
// configuration ===============================================================
mongoose.connect(configDB[0].url); // connect to our database
require('./config/passport.js')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());

    // required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
var gfs = new Grid(mongoose.connection.db);




// routes ======================================================================
require('./app/route/routes.js')(app, passport,webdir); // load our routes and pass in our app and fully configured passport
require('./app/route/filesroutes.js')(app, passport,gfs);
require('./app/route/documentroutes.js')(app,gfs);
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport); 

// launch ======================================================================
var secureServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/conception.reveries-project.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/conception.reveries-project.fr/cert.pem')
  }, app)
  .listen(HTTPS_PORT, function () {
    console.log('Secure Server listening on port ' + HTTPS_PORT);
});

