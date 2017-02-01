module.exports = function(app) {

    // normal routes ===============================================================
    var User = require('../models/user.js');
    var Game = require('../models/game.js');
    var MLG = require('../models/mlg.js');
    var POI = require('../models/poi.js')
    var FreeText = require('../models/freetext.js')
    var MCQ = require('../models/mcq.js')






    // Handle reception of a new free text activity designed by conceptor
    app.post('/freetextactivity', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var newFreeText = new FreeText()
        newFreeText.question = req.body.question;
        newFreeText.label=req.body.label;
        newFreeText.name = req.body.name;
        newFreeText.response = req.body.response;
        newFreeText.wrongMessage = req.body.wrongMessage;
        newFreeText.correctMessage = req.body.correctMessage;
        newFreeText.imageId = req.body.imageId;
        newFreeText.owner = req.user._id
        newFreeText.status = req.body.status;
        newFreeText.save(function(err) {
            if (err) {
                console.log(err)
                res.send({ success: false })
            } else res.send({ success: true })
        })
    });



    app.get('/freetextactivity', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            FreeText.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, freetexts) {
                for (var i = 0; i < freetexts.length; i++) {
                    var freetext = freetexts[i]
                    if (freetext.owner == req.user._id) {
                        freetext.readonly = "readwrite"
                    } else {
                        freetext.readonly = "readonly"
                    }
                }

                res.send(freetexts)
            })
    })

    app.delete('/freetextactivity/:id', function(req, res) {
        if (!req.user._id) { res.send({ success: false, message: 'user not authenticated' }) }
        FreeText.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })
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
        var Mcq = new MCQ();
        Mcq.owner = req.user._id
        Mcq.status = req.body.status
        Mcq.label = req.body.label
        Mcq.question = req.body.question;
        Mcq.distractor1 = req.body.distractor1;
        Mcq.distractor2 = req.body.distractor2;
        Mcq.response = req.body.response;
        Mcq.wrongMessage = req.body.wrongMessage;
        Mcq.correctMessage = req.body.correctMessage;
        Mcq.imageId = req.body.imageId;
        Mcq.save(function(err) {
            if (err) {
                console.log(err)
                res.send({ success: false })
            } else res.send({ success: true })

        })
    });


    // Return the list of mcq owned by current user
    app.get('/mcq', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            MCQ.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, mcqs) {
                for (var i = 0; i < mcqs.length; i++) {
                    var mcq = mcqs[i]
                    if (mcq.owner == req.user._id) {
                        mcq.readonly = "readwrite"
                    } else {
                        mcq.readonly = "readonly"
                    }
                }
                res.send(mcqs)
            })

    });

    app.delete('/mcq/:id', function(req, res) {
        if (!req.user._id) { res.send({ success: false, message: 'user not authenticated' }) }
        MCQ.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })

    })

    app.post('/mlg', function(req, res) {
        var mlg = new MLG();

        mlg.name = req.body.name
        mlg.activityDescription = req.body.activityDescription
        mlg.objectivesDescription = req.body.objectivesDescription
        mlg.unitGames = req.body.unitGameId.split(',')
        mlg.save(function(err) {
            if (err) {
                console.log(err)
                return 500;
            }

            res.send({ success: 'ok' })
        });


    })




    // Return the list of freeTextActivities owned by current user


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
            var activityName = req.body.activityName;
            var startText = req.body.startText;
            var startMediaId = req.body.startMedia.split(',')[0];
            var gps = false;
            if (req.body.gps === 'on') {
                gps = true;
            }
            var map = false;
            if (req.body.map === 'on') {
                map = true;
            }
            var compass_map = false;
            if (req.body.map_compass === 'on') {
                compass_map = true;
            }
            var qrcodeId;
            if (req.body.qrcode) {
                qrcodeId = req.body.qrcode;
            }

            var POIId = req.body.poi.split(',')[0];
            var feedbackMediaId = req.body.fbMedia.split(',')[0];
            var feedbackText = req.body.feedbackText;
            var game = new Game();
            game.startText = startText;
            game.activityName = activityName;
            game.startMediaId = startMediaId;
            game.feedbackMediaId = feedbackMediaId;
            game.gps = gps;
            game.map = map;
            game.qrcodeId = qrcodeId;
            game.compass_map = compass_map;
            game.POIId = POIId;
            game.feedbackText = feedbackText;
            var activities = []
            var activitiesArray = req.body.activities.split(',');
            for (var i = 0; i < activitiesArray.length - 1; i++) {
                var unitActivity = { "type": activitiesArray[i + 1], "id": activitiesArray[i] };
                activities.push(unitActivity);
            }
            game.activities = activities;



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

    app.put('/mcq/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        MCQ.findById(req.params.id, function(err, mcq) {
            if (!err) {
                if (req.user._id == mcq.owner) {
                    res.send({
                        success: true
                    })
                } else {
                    res.send({
                        success: false,
                        message: 'User not owner of resource'
                    })
                }
            }
        })

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
            owner: req.user._id,
            status: req.body.status,
            label: req.body.label,
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
        var Poi = new POI(poi)
        Poi.save(function(err) {
            if (err) {
                console.log(err)
                return 500;
            }

            res.send({ success: 'ok' })
        });

    })

    // Self explaining
    app.get('/poi', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            POI.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, pois) {
                for (var i = 0; i < pois.length; i++) {
                    var poi = pois[i]
                    if (poi.owner == req.user._id) {
                        poi.readonly = "readwrite"
                    } else {
                        poi.readonly = "readonly"
                    }
                }

                res.send(pois)
            })
    })



    // Self explaining
    app.delete('/poi/:id', function(req, res) {
        if (!req.params.user) { res.send({ success: false, message: 'user not authenticated' }) }
        POI.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })
    });



    app.delete('/mlg/:id', function(req, res) {
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
            MLG.find({ _id: req.params.id }).remove(callback)

        })
        //self explaining





}
