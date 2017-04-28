module.exports = function(app, gfs) {
    var spawn = require('child_process').spawn;
    // normal routes ===============================================================
    var User = require('../models/user.js');
    var Game = require('../models/game.js');
    var Badge = require('../models/badge.js');
    var InventoryItem = require('../models/inventoryItem.js');

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
        if (!req.body.itemId) {

            staticmedia.save(function(err) {
                if (err) {
                    console.log(err)
                    res.send({ success: false })
                } else res.send({ success: true })
            })
        }
        if (req.body.itemId && req.body.itemId.length > 0) {
            StaticMedia.findById(req.body.itemId, function(err, toUpdate) {
                if (!toUpdate) {
                    console.log("Err, Freetext with id " + req.body.itemId + " does not exists")
                } else {
                    console.log("Updating question " + req.body.itemId)
                    toUpdate.label = req.body.label;
                    toUpdate.owner = req.user._id
                    toUpdate.status = req.body.status;
                    toUpdate.mkdown = req.body.mkdown;
                    toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                    })

                }

            })
        }

    });


    app.post('/badge', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var badge = new Badge()
        badge.label = req.body.label;
        badge.badgeText = req.body.badgeText;
        badge.owner = req.user._id
        badge.status = req.body.status;
        badge.badgePageId = req.body.badgePageId;

        if (!req.body.itemId) {
            badge.save(function(err) {
                if (err) {
                    console.log(err)
                    res.send({ success: false })
                } else res.send({ success: true })
            })
        }
        if (req.body.itemId && req.body.itemId.length > 0) {
            Badge.findById(req.body.itemId, function(err, toUpdate) {
                if (!toUpdate) {
                    console.log("Err, Badge with id " + req.body.itemId + " does not exists")
                } else {
                    console.log("Updating badge " + req.body.itemId)
                    toUpdate.label = req.body.label;
                    toUpdate.badgeText = req.body.badgeText;

                    toUpdate.owner = req.user._id
                    toUpdate.status = req.body.status;
                    toUpdate.mediaId = req.body.mediaId;
                    toUpdate.badgePageId = req.body.badgePageId;
                    toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                    })

                }

            })
        }

    });

    app.get('/badge', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            Badge.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, badges) {
                for (var i = 0; i < badges.length; i++) {
                    var badge = badges[i]
                    if (badge.owner == req.user._id) {
                        badge.readonly = "readwrite"
                    } else {
                        badge.readonly = "readonly"
                    }
                }
                res.send(badges)
            })
    })
    app.delete('/badge/:id', function(req, res) {
        if (!req.user._id) { res.send({ success: false, message: 'user not authenticated' }) }
        Badge.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })
    });
    app.get('/inventory', function(req, res) {
        if (!req.user) {
            res.send({ success: false, 'message': 'please authenticate' })
        } else
            InventoryItem.find({
                $or: [{ owner: req.user._id }, { status: 'Public' }]
            }, function(err, inventorys) {
                for (var i = 0; i < inventorys.length; i++) {
                    var inventory = inventorys[i]
                    if (inventory.owner == req.user._id) {
                        inventory.readonly = "readwrite"
                    } else {
                        inventory.readonly = "readonly"
                    }
                }
                res.send(inventorys)
            })
    })
    app.delete('/inventory/:id', function(req, res) {
        if (!req.user._id) { res.send({ success: false, message: 'user not authenticated' }) }
        InventoryItem.findOneAndRemove({ '_id': req.params.id, owner: req.user._id },
            function(err, doc) {
                res.send(doc);
            })
    });
    app.post('/inventory', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        var inventory = new InventoryItem()
        inventory.label = req.body.label;
        inventory.itemText = req.body.itemText;
        inventory.owner = req.user._id
        inventory.status = req.body.status;
        inventory.itemPageId = req.body.itemPageId;
        inventory.itemDocPageId = req.body.itemDocPageId;

        if (!req.body.itemId) {
            inventory.save(function(err) {
                if (err) {
                    console.log(err)
                    res.send({ success: false })
                } else res.send({ success: true })
            })
        }
        if (req.body.itemId && req.body.itemId.length > 0) {
            InventoryItem.findById(req.body.itemId, function(err, toUpdate) {
                if (!toUpdate) {
                    console.log("Err, Badge with id " + req.body.itemId + " does not exists")
                } else {
                    console.log("Updating badge " + req.body.itemId)
                    toUpdate.label = req.body.label;
                    toUpdate.itemText = req.body.itemText;
                    toUpdate.owner = req.user._id
                    toUpdate.status = req.body.status;
                    toUpdate.itemPageId = req.body.itemPageId;
                    toUpdate.itemDocPageId = req.body.itemDocPageId;
                    toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                    })

                }

            })
        }

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

        if (!req.body.itemId) {
            newFreeText.save(function(err) {
                if (err) {
                    console.log(err)
                    res.send({ success: false })
                } else res.send({ success: true })
            })
        }

        if (req.body.itemId && req.body.itemId.length > 0) {
            FreeText.findById(req.body.itemId, function(err, toUpdate) {
                if (!toUpdate) {
                    console.log("Err, Freetext with id " + req.body.itemId + " does not exists")
                } else {
                    console.log("Updating question " + req.body.itemId)
                    toUpdate.question = req.body.question;
                    toUpdate.label = req.body.label;
                    toUpdate.response = req.body.response;
                    toUpdate.wrongMessage = req.body.wrongMessage;
                    toUpdate.correctMessage = req.body.correctMessage;
                    toUpdate.mediaId = req.body.mediaId;
                    toUpdate.owner = req.user._id
                    toUpdate.status = req.body.status;
                    toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                    })

                }

            })
        }

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
        //save if no mediaId
        if (!req.body.itemId) {
            Mcq.save(function(err) {
                if (err) {
                    console.log(err)
                    res.send({ success: false })
                } else res.send({ success: true })

            })
        }
        //update existing MCQ if mediaId
        if (req.body.itemId && req.body.itemId.length > 0) {
            MCQ.findById(req.body.itemId, function(err, toUpdate) {
                if (!toUpdate) {
                    console.log("Err, MCQ with id " + req.body.itemId + " does not exists")
                } else {
                    console.log("Updating question " + req.body.itemId)
                    toUpdate.owner = req.user._id
                    toUpdate.status = req.body.status
                    toUpdate.label = req.body.label
                    toUpdate.question = req.body.question;
                    toUpdate.distractor1 = req.body.distractor1;
                    toUpdate.distractor2 = req.body.distractor2;
                    toUpdate.response = req.body.response;
                    toUpdate.wrongMessage = req.body.wrongMessage;
                    toUpdate.correctMessage = req.body.correctMessage;
                    toUpdate.mediaId = req.body.mediaId;
                    toUpdate.save(function(err) {
                        if (err) {
                            console.log(err)
                            res.send({ success: false })
                        } else res.send({ success: true })

                    })

                }

            })
        }
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
        if(req.body.badgeId){
            mlg.badges=req.body.badgeId.split(',')
        }
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

            var poiPAId
            var poiGuidFolia
            var poiGuidMap
            var poiGuidClue

            var poiGPSValidation
            var poiQRValidation
            var poiIncorrectMessage
            var poiReachedMessage
            var cluePOIId

            var situatedAct1;
            var situatedAct2;
            var situatedAct3;
            if (req.body.gps) {
                poiGPSValidation = true
            }
            if (req.body.poiIncorrectMessage) {
                poiIncorrectMessage = req.body.poiIncorrectMessage
            }
            if (req.body.poiReachedMessage) {
                poiReachedMessage = req.body.poiReachedMessage
            }

            if (req.body.QR) {
                poiQRValidation = true
            }

            if (req.body.map) {
                poiGuidMap = true
            }
            if (req.body.folia) {
                poiGuidFolia = true
            }
            if (req.body.cluePoiMedia) {
                poiGuidClue = true
            }

            if (req.body.cluePOIId) {
                cluePOIId = req.body.cluePOIId
            }

            if (req.body.poiPAId) {
                poiPAId = req.body.poiPAId
            }
            if (req.body.startMedia)
                startMediaId = req.body.startMedia;
            if (req.body.feedbackMedia)
                feedbackMediaId = req.body.feedbackMedia;
            if (req.body.poi)
                POIId = req.body.poi;
            if (req.body.situatedAct1) {
                situatedAct1 = req.body.situatedAct1
            }
            if (req.body.situatedAct2) {
                situatedAct2 = req.body.situatedAct2
            }
            if (req.body.situatedAct3) {
                situatedAct3 = req.body.situatedAct3
            }


            var game = new Game();
            game.poiIncorrectMessage = poiIncorrectMessage
            game.poiReachedMessage = poiReachedMessage
            game.poiGPSValidation = poiGPSValidation
            game.poiQRValidation = poiQRValidation
            game.poiGuidMap = poiGuidMap
            game.poiGuidClue = poiGuidClue
            game.poiGuidFolia = poiGuidFolia
            game.activityName = activityName;
            game.startMediaId = startMediaId;
            game.feedbackMediaId = feedbackMediaId;
            game.POIId = POIId
            game.poiPAId = poiPAId
            game.cluePOIId = cluePOIId
            game.activities = [];
            if (situatedAct1)
                game.activities.push(situatedAct1)
            if (situatedAct2)
                game.activities.push(situatedAct2)
            if (situatedAct3)
                game.activities.push(situatedAct3)
            game.poiScorePA = req.body.poiScorePA
            game.poiPA = req.body.poiPA;
            game.act1successScore = req.body.act1successScore
            game.act1successMed = req.body.act1successMed
            game.act2successScore = req.body.act2successScore
            game.act2successMed = req.body.act2successMed



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
    app.put('/badge/:id/share', function(req, res) {
        if (!req.isAuthenticated()) {
            res.send({
                success: false,
                message: "Please authenticate"
            });
            return;
        }
        switchStatus(badge, req, res);

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

    app.get('/qrcode/:id', function(req, res) {
        //res.header('Content-Type', 'image/png');

        tail = spawn('qrencode', ['-o', '-', '[' + req.params.id + ']', '-s', 30]);
        tail.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
            res.write(data, 'utf-8');
        });
        tail.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            res.write(data, 'utf-8');
        });
        tail.on('exit', function(code) {
            console.log('child process exited with code ' + code);
            res.end(code);
        });
    });



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
