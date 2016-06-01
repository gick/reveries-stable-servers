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
var game = mongoose.Schema({

    activityName: String,
    startText: String,
    compass: Boolean,
    feedbackMedia:  String,
    startMedia:  String,
    POI: {
        name: String,
        comment: String,
        date: Date,
        latitude: Number,
        longitude: Number,
        photo: String,
        public: Boolean,
        map: {
            marker: String,
            areaLat: Number,
            areaLong: Number,
            areaRadius: Number,
            mapLatitude: Number,
            mapLongitude: Number,
            mapZoom: Number,
        }
    },
    passActivities: Boolean,
    activities: [{  name:String,question: String, response: String, imageId: String, wrongMessage: String, correctMessage: String  }],
    feedbackText: String,
});

var Game = db.model('Play', game)
    // generating a hash

module.exports = Game;
