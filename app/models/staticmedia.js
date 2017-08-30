var mongoose = require('mongoose');

var staticmediaSchema = mongoose.Schema({
		label:String,
		readonly:String,
		owner:String,
	type:{type:String,default:'staticmedia'},
		status:String,
        mkdown: String,
    })

module.exports = mongoose.model('StaticMedia', staticmediaSchema);
