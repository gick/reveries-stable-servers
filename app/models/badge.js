var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var badgeSchema = mongoose.Schema({
    label: String,
    badgeText: String,
    readonly: String,
    owner: String,
    status: String,
    type: { type: String, default: 'badge' },
    typeLabel: { type: String, default: 'Badge' },
    media: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
})

module.exports = mongoose.model('Badge', badgeSchema);