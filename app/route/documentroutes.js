module.exports = function(app) {

        // normal routes ===============================================================
        var User = require('../models/user.js');
        var Game = require('../models/game.js');
        var MLG = require('../models/mlg.js');





        // Self explaining
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


        // Self explaining
        app.delete('/poi/:id', function deleteUserPOI(req, res) {
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




        // Handle reception of a new free text activity designed by conceptor
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
        // Handle reception of a new mcq activity designed by conceptor
        app.post('/mcq', function(req, res) {
            if (!req.isAuthenticated()) {
                res.send({
                    success: false,
                    message: "Please authenticate"
                });
                return;
            }
            var question = req.body.question;
            var distractor1 = req.body.distractor1;
            var distractor2 = req.body.distractor2;
            var response = req.body.response;
            var wrongMessage = req.body.wrongMessage;
            var correctMessage = req.body.correctMessage;
            var imageId = req.body.imageId;
            var condition = {
                '_id': req.user._id
            };
            var update = {
                $push: {
                    mcq: {
                        'question': question,
                        response: response,
                        distractor1: distractor1,
                        distractor2: distractor2,
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


        // Return the list of mcq owned by current user
        app.get('/mcq', function(req, res) {
            if (req.isAuthenticated()) {
                User.findOne({
                    _id: req.user._id
                }, function(err, user) {
                    res.send(user.mcq);

                })
            } else {
                res.send({
                    success: false,
                    message: 'User not authenticated'
                })
            }

        });






        // Return the list of freeTextActivities owned by current user
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

        });


        //Return the list of Game (user independant)
        app.get('/unitGame', function(req, res) {
            Game.find({}, function(err, game) {
                res.send(game);
            })

        })

        // Self explaining
        app.delete('/unitGame/:id', function(req, res) {
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
            Game.find({ _id: req.params.id }).remove(callback)
        })

        //Handle reception of a whole game unit, quite a lot of parameters
        // The game unit are saved in database mongodb://localhost/game to be accessible
        //from the game server

        app.post('/unitGame', function(req, res) {
                var activities = [];
                if (req.body.Activities) {
                    var transformed = req.body.Activities.replace('},{', '}},{{')
                    var activitiesList = transformed.split('},{');

                    for (var i = 0; i < activitiesList.length; i++) {
                        activities.push(JSON.parse(activitiesList[i]));
                    }
                }
                console.log(req.body)
                var gps = false;
                if (req.body.gps === 'on') {
                    gps = true;
                }
                var compass_map = false;
                if (req.body.map_compass === 'on') {
                    compass_map = true;
                }
                var noguidance = true;
                if (compass_map === true) {
                    noguidance = false;
                }
                var POI = JSON.parse(req.body.poi);
                var startMedia = JSON.parse(req.body.startMedia);
                var feedbackMedia = JSON.parse(req.body.feedbackMedia);
                var activity = JSON.parse(req.body.activity);



                var feedbackText = req.body.feedbackText;
                var game = new Game();
                game.activityName = req.body.activityName;
                game.startMedia = startMedia._id;
                game.feedbackMedia = feedbackMedia._id;
                game.startText = req.body.startText;
                game.noguidance = noguidance;
                game.activities = activity;
                game.compass_map = compass_map;
                game.POI = POI;
                game.feedbackText = feedbackText;
                game.save(function(err) {
                    if (err) {
                        console.log(err)
                        return 500;
                    }

                    res.send(game)
                });

            })
            //handle reception lgof a complete game
        app.get('/mlg', function(req, res) {
            MLG.find({}, function(err, game) {
                if (game) { res.send(game) }
            })
        })


        app.post('/mlg', function(req, res) {
                var mlg = new MLG();

                mlg.mlgName = req.body.mlgName,
                    mlg.gameDescription = [{
                        gameId: req.body.order,
                        mlgOptional: req.body.order,
                        mlgScore: req.body.score
                    }]

                mlg.save(function(err) {
                    if (err) {
                        console.log(err)
                        return 500;
                    }

                    res.send({success:'ok'})
                });


            })

            //handle reception of a POI posted from a map,
            // with possible trigger area

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
                console.log(poi)
                var update = {
                    $push: { 'poi': poi }
                }
                var options = {
                    multi: false
                };

                var callback = function(err, numberAffected) {
                    if (err) {
                        console.log('problem')

                        res.send({
                            success: false
                        })
                    } else {
                        console.log('ok')

                        res.send({

                            success: true,
                            number: numberAffected
                        })
                    }
                }
                User.update(condition, update, options, callback)

            })

            //self explaining
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
                    } else {
                        res.send({
                            success: true,
                            number: numberAffected
                        });
                    }
                }
                User.update(condition, update, options, callback);

            })




        }
