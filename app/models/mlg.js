// load the things we need
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/play'); // connect to our database

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var mlg = mongoose.Schema({

    mlgName: String,
    gameDescription:[{gameId:String,mlgOptional:Boolean,mlgScore:Number}]
});

var MLG = db.model('MLG', mlg)
    // generating a hash

module.exports = MLG;