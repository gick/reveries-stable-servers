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
    passActivities: Boolean,
    activities: [],
    feedbackMediaId: String,
    poiScorePA: String,
    poiPAId: String,
    cluePOIId:String,
    poiGuidFolia:Boolean,
    poiGuidMap:Boolean,
		poiGuidType:String,
    poiGuidClue:Boolean,
    poiGPSValidation:Boolean,
    poiQRValidation:Boolean,
    poiIncorrectMessage:String,
    poiReachedMessage:String,
    poiReachedInventory:String,

});

// generating a hash

module.exports = mongoose.model('Game', gameSchema);
