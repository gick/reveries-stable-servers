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
        imageId: String,
        correctMessage: String,
        wrongMessage: String
    })

module.exports = mongoose.model('MCQ', mcqSchema);
