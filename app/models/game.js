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
var gameSchema = mongoose.Schema({

    label: String,
    startMedia: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    POI: { type: Schema.Types.ObjectId, ref: 'POI' },
    passActivities: Boolean,
    readonly: String,
    owner: String,
    creationDate: Date,
    status: String,
    inventoryPage: String,
    freetextActivities: [{ type: Schema.Types.ObjectId, ref: 'FreeText' }],
    mcqActivities: [{ type: Schema.Types.ObjectId, ref: 'MCQ' }],
    activityOrder: [String],
    feedbackMedia: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    poiScorePA: String,
    poiPAId: String,
    status: { type: String, default: 'Private' },
    clueGuidance: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    typeLabel: { type: String, default: 'Unit game' },
    poiGuidFolia: Boolean,
    poiGuidMap: Boolean,
    poiGuidType: String,
    poiGuidClue: Boolean,
    poiGPSValidation: Boolean,
    poiQRValidation: Boolean,
    poiIncorrectMessage: String,
    poiReachedMessage: String,
    inventoryItem: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },
    activity1Success: String,
    activity1Fail: String,
    activity2Success: String,
    activity2Fail: String,
    activity3Success: String,
    activity3Fail: String,
    type: { type: String, default: 'unitgame' },

});

// generating a hash
gameSchema.plugin(deepPopulate,{})

module.exports = mongoose.model('Game', gameSchema);