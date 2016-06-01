module.exports = function(app) {

    // normal routes ===============================================================
    var User = require('../models/user.js');
    var Game = require('../models/game.js')

    app.get('/listPublicPoi', function(req, res) {
        User.aggregate([{
            $unwind: {
                path: '$poi'
            }
        }, {
            $project: {
                '_id': '$poi._id',
                'name': '$poi.name',
                'date': '$poi.date',
                'latitude': '$poi.latitude',
                longitude: '$poi.longitude',
                photo: '$poi.photo',
                comment: '$poi.comment',
                public: '$poi.public',
                creator: '$name'
            }
        }, {
            $match: {
                public: true
            }
        }], function(err, result) {
            if (err) {
                console.log(err);
                res.send({
                    success: false
                });
            } else {
                res.send(result)
            }
        })
    });



    app.delete('/poi/:id', function updateUserPOI(req, res) {
        var condition = {
            'poi._id': req.params.id
        };
        var update = {
            $pull: {
                poi: {
                    '_id': req.params.id
                }
            }
        };
        var options = {
            multi: false
        };
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({
                    success: false
                })
            } else res.send({
                success: true,
                number: numberAffected
            });
        }
        User.update(condition, update, options, callback)
    });

    app.post('/freetextactivity', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var question = req.body.question;
        var name = req.body.name;
        var response = req.body.response;
        var wrongMessage = req.body.wrongMessage;
        var correctMessage = req.body.correctMessage;
        var imageId = req.body.imageId;
        var condition = {
            '_id': req.user._id
        };
        var update = {
            $push: {
                freetext: {
                    'question': question,
                    response: response,
                    name: name,
                    correctMessage: correctMessage,
                    wrongMessage: wrongMessage,
                    imageId: imageId
                }
            }
        };
        var options = {
            multi: false
        };
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({
                    success: false
                })
            } else res.send({
                success: true,
                number: numberAffected
            });
        }
        User.update(condition, update, options, callback)
    });


    app.get('/freetextactivity', function(req, res) {
        if (req.isAuthenticated()) {
            User.findOne({
                _id: req.user._id
            }, function(err, user) {
                res.send(user.freetext);

            })
        } else {
            res.send({
                success: false,
                message: 'User not authenticated'
            })
        }

    })
    app.post('/unitGame', function(req, res) {
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({
                    success: false
                })
            } else {
                res.send({
                    success: true,
                    number: numberAffected
                });
            }
        };
        var activities = [];
        console.log(typeof(req.body.Activities))
        if (req.body.Activities) {
            var transformed=req.body.Activities.replace('},{','}},{{')
            var activitiesList = transformed.split('},{');
            
            for (var i = 0; i < activitiesList.length; i++) { 
                activities.push(JSON.parse(activitiesList[i]));
            }
        }
        var gps = false;
        if (req.body.gps === 'on') {
            gps = true;
        }
        var compass = false;
        if (req.body.compass === 'on') {
            compass = true;
        }
        var POI = JSON.parse(req.body.POI);
        console.log(POI);
        console.log(typeof(POI))
        var startMedia =JSON.parse(req.body['Starting media'])._id;
        var idFeedbackMedia = JSON.parse(req.body['Feedback media'])._id;
        var feedbackText = req.body.feedbackText;
        var game = new Game();
        game.activityName = req.body.activityName;
        game.startMedia=startMedia;
        game.feedbackMedia=idFeedbackMedia;
        game.startText = req.body.startText;
        game.gps = gps;
        game.activities = activities
        game.compass = compass;
        game.POI = POI;
        game.feedbackText = feedbackText;
        game.save(function(err) {
            if (err){
                console.log(err)
                return 500;
            }

            res.send(game)
        });

    })

    app.post('/poimap', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var condition = {
            '_id': req.user._id
        };

        var poi = {
            name: req.body.name,
            date: Date.now(),
            comment: req.body.comment,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photo: req.body.imageId,
            map: {
                marker: req.body.marker,
                mapLatitude: req.body.mapLatitude,
                mapLongitude: req.body.mapLongitude,
                mapZoom: req.body.mapZoom,
                areaLat: req.body.areaLat,
                areaLong: req.body.areaLong,
                areaRadius: req.body.radius,
            }
        }
        var update = {
            $push: { 'poi': poi }
        }
        var options = {
            multi: false
        };
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({
                    success: false
                })
            } else res.send({
                success: true,
                number: numberAffected
            });
        }
        User.update(condition, update, options, callback)


    })


    app.delete('/freetextactivity/:id', function(req, res) {
        var condition = {
            'freetext._id': req.params.id
        };
        var update = {
            $pull: {
                freetext: {
                    '_id': req.params.id
                }
            }
        };
        var options = {
            multi: false
        };
        var callback = function(err, numberAffected) {
            if (err) {
                res.send({
                    success: false
                })
            } else res.send({
                success: true,
                number: numberAffected
            });
        };
        User.update(condition, update, options, callback);
    })
}
