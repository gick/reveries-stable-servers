var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inventoryItemSchema = mongoose.Schema({
    label: String,
    label: String,
    itemText: String,
    readonly: String,
    owner: String,
    type: { type: String, default: 'inventory' },
    typeLabel: { type: String, default: 'Inventory item' },
    media: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    inventoryDoc: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },

    status: String,

})

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);