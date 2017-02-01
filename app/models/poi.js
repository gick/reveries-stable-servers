
var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({
        owner:String,
        readonly:String,
        status:String,
        label: String,
        comment: String,
        date: Date,
        latitude: Number,
        longitude: Number,
        photo: String,
        map: {
            marker: String,
            areaLat: Number,
            areaLong: Number,
            areaRadius: Number,
            mapLatitude: Number,
            mapLongitude: Number,
            mapZoom: Number,
        }
    })

module.exports = mongoose.model('POI', poiSchema);
