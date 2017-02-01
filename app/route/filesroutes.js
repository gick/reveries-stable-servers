module.exports = function(app, passport, gfs) {

    // normal routes ===============================================================

    var User = require('../models/user.js');
    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################


    //update an existing PIO or create a new one if there is no
    //matching id
    function savePOI(file, req, res) {
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (file) {
                var poi = {
                    name: req.body.name,
                    date: Date.now(),
                    comment: req.body.comment,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    photo: file._id,
                    public: req.body.public
                }
                user.poi.push(poi);
                user.save(function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send({
                            success: true
                        });
                    }
                })
            } else {
                var poi = {
                    name: req.body.name,
                    date: Date.now(),
                    comment: req.body.comment,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    public: req.body.public
                }
                user.poi.push(poi);
                user.save(function(err) {
                    if (err) {
                        res.send({ success: false })
                    } else {
                        res.send({
                            success: true
                        })

                    }
                })
            }


        });
    }




    // handle POI posted from app, since POI might contains a photo
    // we handle that case with if(req.files.file)
    app.post('/poi', function(req, res) {
        if (req.isAuthenticated()) {
            if (req.files.file) {
                var part = req.files;
                var writestream = gfs.createWriteStream({
                    filename: part.file.name,
                    mode: 'w',
                    content_type: part.file.mimetype,
                    metadata: {
                        creator: req.user._id,
                        poi: true
                    }
                });
                writestream.write(part.file.data);

                writestream.on('close', function(file) {
                    updateUserPOI(file, req, res);
                })
                writestream.end();
            } else {
                res.send({
                    success: true
                })
                updateUserPOI(null, req, res);

            }
        } else {
            res.send('Please authenticate first')
        }
    });


    // handle media posted by authenticated users
    app.post('/file', function(req, res) {
        if (req.isAuthenticated()) {
            var part = req.files;
            var writestream = gfs.createWriteStream({
                filename: part.file.name,
                mode: 'w',
                content_type: part.file.mimetype,
                metadata: {
                    owner: req.user._id,
                    status: 'Private',
                    title: part.file.name

                }
            });
            writestream.write(part.file.data);

            writestream.on('close', function() {
                res.send({
                    success: true
                });

            })
            writestream.end();

        } else {
            res.send('Please authenticate first')
        }
    });



    // handle special case of medua : qr-codes  
  /*  app.post('/qrcode', function(req, res) {
        if (req.isAuthenticated()) {
            var part = req.files;
            var writestream = gfs.createWriteStream({
                filename: 'qrCode',
                mode: 'w',
                content_type: part.file.mimetype,

                metadata: {
                    creator: req.user._id,
                    public: req.body.public === 'true',
                    qrcode: req.body.qrcode,
                    type: 'qrcode'
                }
            });
            writestream.write(part.file.data);

            writestream.on('close', function() {
                res.send({
                    success: true
                });

            })
            writestream.end();

        } else {
            res.send('Please authenticate first')
        }
    });*/



    app.delete('/file/:id', function(req, res) {
        var options = {
            _id: req.params.id
        };
        gfs.remove(options, function(err, file) {
            if (err) {
                res.send({
                    success: false
                });
            } else {
                res.send({
                    success: true
                })
            }

        });

    });


    // test function, not used in the web app
    app.get('/listAllFiles', function(req, res) {
        gfs.files.find({}).toArray(function(err, files) {
            res.send(files);
        })
    });


    // return all files owned by the user except photo associated
    // to POI and QRCode. The web client decides which files are media or not
    app.get('/listUserMediaFiles', function(req, res) {
        if (req.isAuthenticated()) {
            gfs.files.find({
                $or: [{ 'metadata.owner': req.user._id }, { 'metadata.status': 'Public' }],
                'metadata.poi': {
                    $exists: false
                }
            }).toArray(function(err, files) {
                for (var i = 0; i < files.length; i++) {
                    var filedata = files[i]
                    if (filedata.owner && filedata.owner == req.user._id) {
                        filedata.readonly = "readwrite"
                    } else {
                        filedata.readonly = "readonly"
                    }
                }

                res.send(files);
            })
        } else {
            res.send({
                success: false,
                message: 'User not authenticated'
            })
        }
    });

    app.get('/listUserQrcode', function(req, res) {
        if (req.isAuthenticated()) {
            gfs.files.find({
                'metadata.creator': req.user._id,
                'metadata.type': 'qrcode'
            }).toArray(function(err, files) {
                res.send(files);
            })
        } else {
            res.send({
                success: false,
                message: 'User not authenticated'
            })
        }
    });

    app.get('/listUserAudioVideo', function(req, res) {
        if (req.isAuthenticated()) {
            gfs.files.find({
                $and: [
                    { $or: [{ contentType: /.*audio.*/ }, { contentType: /.*video.*/ }] }, {
                        'metadata.creator': req.user._id
                    }
                ]
            }).toArray(function(err, files) {
                res.send(files);
            })
        } else {
            res.send({
                success: false,
                message: 'User not authenticated'
            })
        }
    });


    // return all images files owned by the user execpt qr code
    app.get('/listUserImages', function(req, res) {
        if (req.isAuthenticated()) {
            gfs.files.find({
                contentType: /.*image.*/,
                $or: [{ 'metadata.owner': req.user._id }, { 'metadata.status': 'Public' }],
                'metadata.poi': {
                    $exists: false
                }
            }).toArray(function(err, files) {
                for (var i = 0; i < files.length; i++) {
                    var filedata = files[i]
                    if (filedata.metadata.owner && filedata.metadata.owner.toString() == req.user._id.toString()) {
                        filedata.metadata.readonly = "readwrite"
                    } else {
                        filedata.metadata.readonly = "readonly"
                    }
                }

                res.send(files);
            })
        } else {
            res.send({
                success: false,
                message: 'User not authenticated'
            })
        }
    });
    app.get('/poi/:id', function getSinglePOI(req, res) {
        User.findOne({
            'poi._id': req.params.id
        }, {
            'poi.$': 1
        }, function(err, result) {
            if (result) {
                res.send(result);
            } else {
                res.send({
                    success: false,
                    message: 'POI does not exists'
                })
            }


        })
    })



    /*
    Getting file by id, either the complete file (not a range request, in else), or 
    a partial content (for video/audio streaming)
    */
    app.get('/file/:id', function(req, res) {
        if (req.headers.range) {
            gfs.findOne({
                _id: req.params.id
            }, function(err, file) {
                if (!file) {
                    res.send({
                        success: false
                    });
                    return;
                }
                var parts = req.headers['range'].replace(/bytes=/, '').split('-');
                var partialstart = parts[0];
                var partialend = parts[1];

                var start = parseInt(partialstart, 10);
                var end = partialend ? parseInt(partialend, 10) : file.length - 1;
                var chunksize = (end - start) + 1;
                res.status(206)
                res.set({
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': file.contentType,
                });

                var readstream = gfs.createReadStream({
                    _id: req.params.id,
                    range: {
                        startPos: start,
                        endPos: end
                    }
                });

                req.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.pipe(res);
            });

        } else {


            gfs.findOne({
                _id: req.params.id
            }, function(err, file) {
                if (!file) {
                    res.send({
                        success: false
                    });
                    return;
                }

                var readstream = gfs.createReadStream({
                    _id: req.params.id
                });
                res.set('Content-Type', file.contentType);
                res.set('Content-Length', file.length);

                req.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.on('error', function(err) {
                    res.send(500, err);
                });
                readstream.pipe(res);
            });



        }
    });



}
