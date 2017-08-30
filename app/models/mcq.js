var mongoose = require('mongoose');

var mcqSchema = mongoose.Schema({
		label:String,
		readonly:String,
		owner:String,
		status:String,
        question: String,
        distractor1: String,
        distractor2: String,
        response: String,
        mediaId: String,
    type:{type:String,default:'mcq'},
        correctMessage: String,
        wrongMessage: String
    })

module.exports = mongoose.model('MCQ', mcqSchema);
