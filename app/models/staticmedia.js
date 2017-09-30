var mongoose = require('mongoose');

var staticmediaSchema = mongoose.Schema({
            label: String,
            readonly: String,
            owner: String,
            type: { type: String, default: 'staticmedia' },
            typeLabel: { type: String, default: 'Multimedia document' },
            status: String,
            mkdown: String,
    })

module.exports = mongoose.model('StaticMedia', staticmediaSchema);
