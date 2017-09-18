var mongoose = require('mongoose');

var inventoryItemSchema = mongoose.Schema({ label:String,
	label:String,
	itemText:String,
	readonly:String,
	owner:String,
	type:{type:String,default:'inventory'},
    typeLabel: { type: String, default: 'Inventory item' },

	status:String,
	itemPageId: String, 
	itemDocPageId: String, })

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
