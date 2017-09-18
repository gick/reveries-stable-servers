var mongoose = require('mongoose');

var freeTextSchema = mongoose.Schema({ label:String,
	readonly:String,
	owner:String,
	status:String,
	label: String,
	responseLabel:String,
	question: String, 
	response: String, 
	mediaId: String, 
	type:{type:String,default:'freetext'},
    typeLabel: { type: String, default: 'Free text question' },

	wrongMessage: String, 
	correctMessage: String })

module.exports = mongoose.model('FreeText', freeTextSchema);
