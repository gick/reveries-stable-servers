var mongoose = require('mongoose');

var freeTextSchema = mongoose.Schema({ label:String,
	readonly:String,
	owner:String,
	status:String,
	label: String,
	question: String, 
	response: String, 
	mediaId: String, 
	wrongMessage: String, 
	correctMessage: String })

module.exports = mongoose.model('FreeText', freeTextSchema);
