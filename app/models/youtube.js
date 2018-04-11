var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var youtubeSchema = mongoose.Schema({
    label: String,
    videoId: String,
    startTime: Number,
    readonly: String,
    status: String,
    owner:String,
    type: { type: String, default: 'youtube' },
    typeLabel: { type: String, default: 'Youtube video' },
})

module.exports = mongoose.model('youtube', youtubeSchema);