var mongoose = require('mongoose');

var inventoryItemSchema = mongoose.Schema({ label:String,
	label:String,
	itemText:String,
	readonly:String,
	owner:String,
	status:String,
	itemPageId: String, 
	itemDocPageId: String, })

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
