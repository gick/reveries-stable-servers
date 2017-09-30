var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mcqSchema = mongoose.Schema({
    label: String,
    readonly: String,
    owner: String,
    status: String,
    question: String,
    distractor1: String,
    distractor2: String,
    response: String,
    media: { type: Schema.Types.ObjectId, ref: 'StaticMedia' },
    type: { type: String, default: 'mcq' },
    typeLabel: { type: String, default: 'Multiple choice question' },

    correctMessage: String,
    wrongMessage: String
})

module.exports = mongoose.model('MCQ', mcqSchema);