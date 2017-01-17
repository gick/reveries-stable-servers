// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var mlg = mongoose.Schema({

    name: String,
    activityDescription : String,
    objectivesDescription : String,
    unitGames:[]
});

module.exports = mongoose.model('MLG', mlg);
    // generating a hash

