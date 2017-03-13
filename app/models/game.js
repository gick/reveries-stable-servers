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
var gameSchema = mongoose.Schema({

    activityName: String,
    startMediaId: String,
    POIId: String,
    compass: Boolean,
    map: Boolean,
    qrcodeId: String,
    passActivities: Boolean,
    activities: [],
    feedbackMediaId: String,
    poiScorePA: String,
    poiPA: String,
    act1successScore: String,
    act1successMed: String,
    act2successScore: String,
    act2successMed: String
});

// generating a hash

module.exports = mongoose.model('Game', gameSchema);
