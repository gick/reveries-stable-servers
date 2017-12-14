var mongoose = require('mongoose');

var tutorialSchema = mongoose.Schema({
    label: String,
    creationDate: Date,
    reference:String,
    order:Number,
    readonly: String,
    owner: String,
    type: { type: String, default: 'tutorial' },
    typeLabel: { type: String, default: 'Tutorial document' },
    status: String,
    mkdown: String,
})

module.exports = mongoose.model('Tutorial', tutorialSchema);