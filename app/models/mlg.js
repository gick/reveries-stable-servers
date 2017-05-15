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

    label: String,
    staticMedia: String,
    unitGames:[],
    badges:[],
    gameDifficulty:String,
    gameDuration:String,
    gameProximity:String,
});

module.exports = mongoose.model('MLG', mlg);
    // generating a hash

