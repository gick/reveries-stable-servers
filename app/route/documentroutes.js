module.exports = function(app) {

    // normal routes ===============================================================
    var User = require('../models/user.js');

    app.get('/listPublicPoi', function(req, res) {
        User.aggregate([{ $unwind: { path: '$poi' } }, { $project: { '_id': '$poi._id', 'name': '$poi.name', 'date': '$poi.date', 'latitude': '$poi.latitude', longitude: '$poi.longitude', photo: '$poi.photo', comment: '$poi.comment', public: '$poi.public', creator: '$name' } }, { $match: { public: true } }], function(err, result) {
            if (err) {
                console.log(err)
                res.send({ success: false })
            } else {
                res.send(result)
            }
        })
    });



    app.delete('/poi/:id', function updateUserPOI(req, res) {
        var condition = { 'poi._id': req.params.id };
        var update = { $pull: { poi: { '_id': req.params.id } } };
        var options = { multi: false };
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({ success: false })
            } else res.send({ success: true, number: numberAffected });
        }
        User.update(condition, update, options, callback)
    });

}
