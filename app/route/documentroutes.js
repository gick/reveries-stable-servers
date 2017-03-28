module.exports = function(app) {

    // normal routes ===============================================================
    var User = require('../models/user.js');
    var Game = require('../models/game.js');
    var MLG = require('../models/mlg.js');
    var POI = require('../models/poi.js')
    var FreeText = require('../models/freetext.js')
    var MCQ = require('../models/mcq.js')
    var StaticMedia = require('../models/staticmedia.js')


    // Handle reception of a new static media
    app.post('/staticmedia', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var staticmedia = new StaticMedia()
        staticmedia.label = req.body.label;
        staticmedia.owner = req.user._id
        staticmedia.status = req.body.status;
        staticmedia.mkdown = req.body.mkdown;

        staticmedia.save(function(err) {
            if (err) {
                console.log(err)
                res.send({ success: false })
            } else res.send({ success: true })
        })
    });


    app.get('/staticmedia', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            StaticMedia.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, staticmedias) {
                for (var i = 0; i < staticmedias.length; i++) {
                    var staticmedia = staticmedias[i]
                    if (staticmedia.owner == req.user._id) {
                        staticmedia.readonly = "readwrite"
                    } else {
                        staticmedia.readonly = "readonly"
                    }
                }

                res.send(staticmedias)
            })
    })


    app.get('/staticmedia/:id', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            StaticMedia.findOne({ '_id': req.params.id },
                function(err, doc) {
                    res.send(doc);
                })
    })


    app.delete('/staticmedia/:id', function(req, res) {
        if (!req.user._id) { res.send({ success: false, message: 'user not authenticated' }) }
        StaticMedia.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })
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
        var newFreeText = new FreeText()
        newFreeText.question = req.body.question;
        newFreeText.label = req.body.label;
        newFreeText.response = req.body.response;
        newFreeText.wrongMessage = req.body.wrongMessage;
        newFreeText.correctMessage = req.body.correctMessage;
        newFreeText.mediaId = req.body.mediaId;
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
        Mcq.mediaId = req.body.mediaId;
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

        mlg.label = req.body.label
        mlg.staticMedia = req.body.mediaId
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
            var startMediaId = null
            var POIId = null
            var activitiesArray
            var feedbackMediaId
            var situatedAct1;
            var situatedAct2;
            var situatedAct3;
            if (req.body.startMedia)
                startMediaId = req.body.startMedia;
            if (req.body.feedbackMedia)
                feedbackMediaId = req.body.feedbackMedia;
            if (req.body.poi)
                POIId = req.body.poi;
            if(req.body.situatedAct1){
                situatedAct1=req.body.situatedAct1
            }
            if(req.body.situatedAct2){
                situatedAct1=req.body.situatedAct2
            }
            if(req.body.situatedAct3){
                situatedAct1=req.body.situatedAct3
            }

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

            var game = new Game();
            
            game.activityName = activityName;
            game.startMediaId = startMediaId;
            game.feedbackMediaId = feedbackMediaId;
            game.POIId=POIId
            game.activities=[];
            if(situatedAct1)
                game.activities.push(situatedAct1)
            if(situatedAct2)
                game.activities.push(situatedAct2)
            if(situatedAct3)
                game.activities.push(situatedAct3)
            game.poiScorePA = req.body.poiScorePA
            game.poiPA = req.body.poiPA;
            game.act1successScore = req.body.act1successScore
            game.act1successMed = req.body.act1successMed
            game.act2successScore = req.body.act2successScore
            game.act2successMed = req.body.act2successMed

            game.gps = gps;
            game.map = map;
            game.compass_map = compass_map;




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

    app.put('/freetext/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        switchStatus(FreeText, req, res);

    })


    //Put operation allow to chhane the metadata
    // limited to share status for the moment 
    app.put('/mcq/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        switchStatus(MCQ, req, res);

    })

    app.put('/poi/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        switchStatus(POI, req, res);

    })


    //Put operation allow to chhane the metadata
    // limited to share status for the moment 
    app.put('/staticmedia/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        switchStatus(StaticMedia, req, res);

    })


    var switchStatus = function(model, req, res) {
        model.findById(req.params.id, function(err, resp) {
            if (!err) {
                if (resp && req.user._id == resp.owner) {
                    if (resp.status == "Public") { resp.status = "Private" } else {
                        resp.status = "Public"
                    }
                    resp.save(function(err) {
                            if (err) {
                                res.send({ success: false })
                            } else {
                                res.send({ success: true })
                            }

                        }

                    )
                } else {
                    res.send({
                        success: false,
                        message: 'User not owner of resource'
                    })
                }
            }
        })

    }



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
            label: req.body.label,
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
