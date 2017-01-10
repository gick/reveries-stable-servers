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

    mlgName: String,
    gameDescription:[{gameId:String,mlgOptional:Boolean,mlgScore:Number}]
});

module.exports = mongoose.model('MLG', mlg);
    // generating a hash

