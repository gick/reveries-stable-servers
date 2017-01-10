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
    startText: String,
    startMediaId:  String,
    POIId: String,
    compass: Boolean,
    map:Boolean,
    passActivities: Boolean,
    activities: [],
    feedbackText: String,
    feedbackMediaId:  String,
});

    // generating a hash

module.exports = mongoose.model('Game', gameSchema);
