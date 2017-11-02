// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var mlg = mongoose.Schema({

    label: String,
    isCompetition: Boolean,
    playerNbr: Number,
    startpage:  { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    unitGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    type: { type: String, default: 'mlg' },
    typeLabel: { type: String, default: 'Mobile learning game' },
    owner: String,
    readonly: String,
    status: { type: String, default: 'Public' },
    badge: { type: Schema.Types.ObjectId, ref: 'Badge' },
    gameDifficulty: String,
    gameDuration: String,
    gameProximity: String,
});
mlg.plugin(deepPopulate,{})
module.exports = mongoose.model('MLG', mlg);
// generating a hash