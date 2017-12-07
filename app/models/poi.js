var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({
    owner: String,
    readonly: String,
    dateCreated:String,

    status: String,
    label: String,
    type: { type: String, default: 'poi' },
    typeLabel: { type: String, default: 'Point of interest' },
    comment: String,
    qrcodeid: String,
    creationDate: String,
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