module.exports = function(app, passport, gfs) {

        // normal routes ===============================================================

        var User = require('../models/user.js');

        app.post('/poi', function(req, res) {
            if (req.isAuthenticated()) {
                console.log(req.body);
                console.log(req.files);
                if(req.files.file){
                var part = req.files;
                var writestream = gfs.createWriteStream({
                    filename: part.file.name,
                    mode: 'w',
                    content_type: part.file.mimetype,
                    metadata: { creator: req.user._id, poi: true }
                });
                writestream.write(part.file.data);

                writestream.on('close', function(file) {
                    updateUserPOI(file, req);
                })
                writestream.end();
                res.send({success:true})
                }
                else{
                res.send({success:true})
                updateUserPOI(null, req);

                }
            } else {
                res.send("Please authenticate first")
            }
        });



        app.post('/file', function(req, res) {
            if (req.isAuthenticated()) {
                var part = req.files;
                var writestream = gfs.createWriteStream({
                    filename: part.file.name,
                    mode: 'w',
                    content_type: part.file.mimetype,
                    metadata: { creator: req.user._id, public: true }
                });
                writestream.write(part.file.data);

                writestream.on('close', function(file) {

                })
                writestream.end();
                res.send({success:true});

            } else {
                res.send("Please authenticate first")
            }
        });

        app.get('/listAllFiles', function(req, res) {
            gfs.files.find({}).toArray(function(err, files) {
                res.send(files);
            })
        });

        app.get('/listUserMediaFiles', function(req, res) {
            if (req.isAuthenticated()) {
                gfs.files.find({ "metadata.creator": req.user._id, "metadata.poi": { $exists: false } }).toArray(function(err, files) {
                    res.send(files);
                })
            } else {
                res.send({ success: false, message: "User not authenticated" })
            }
        });
        app.get('/poi', function updateUserPOI(req, res) {
            if (req.isAuthenticated()) {
                User.findOne({ _id: req.user._id }, function(err, user) {
                    res.send(user.poi);

                })
            } else {
                res.send({ success: false, message: "User not authenticated" })
            }
        })



        app.get('/removeAllFiles', function(req, res) {
            removeAllFiles();
            res.send("console")
        });



        /*
        Getting file by id, either the complete file (not a range request, in else), or 
        a partial content (for video/audio streaming)
        */
        app.get('/file/:id', function(req, res) {
                if (req.headers.range) {
                gfs.findOne({ _id: req.params.id }, function(err, file) {
                     var parts = req.headers['range'].replace(/bytes=/, "").split("-");
                     var partialstart = parts[0];
                     var partialend = parts[1];

                     var start = parseInt(partialstart, 10);
                     var end = partialend ? parseInt(partialend, 10) : file.length -1;
                     var chunksize = (end-start)+1;
                     res.status(206)
                     res.set({
                        "Content-Range": "bytes " + start + "-" + end + "/" + file.length,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": file.contentType,
                     });

                    var readstream = gfs.createReadStream(
                        {_id:req.params.id, range : { startPos: start, endPos: end}}
                    );

                    req.on('error', function(err) {
                        res.send(500, err);
                    });
                    readstream.on('error', function(err) {
                        res.send(500, err);
                    });
                    readstream.pipe(res);
                });

                }


                
                else 
                {


                gfs.findOne({ _id: req.params.id }, function(err, file) {
                    var readstream = gfs.createReadStream(
                        {_id:req.params.id}
                    );
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


            function updateUserPOI(file, req) {
                User.findOne({ _id: req.user._id }, function(err, user) {
                    console.log(user);
                    if(file){
                    var poi = { name: req.body.name, date:Date.now(), comment: req.body.comment, latitude: req.body.latitude, longitude: req.body.longitude, photo: file._id ,public:req.body.public}
                    user.poi.push(poi);
                    console.log(user);
                    user.save(function(err) {
                        if (err) { console.log(err) } else { console.log("POI added for user" + req.user.name) }
                    })}
                    else{
                    var poi = { name: req.body.name, date:Date.now(),comment: req.body.comment, latitude: req.body.latitude, longitude: req.body.longitude ,public:req.body.public}
                    user.poi.push(poi);
                    console.log(user);
                    user.save(function(err) {
                        if (err) { console.log(err) } else { console.log("POI added for user" + req.user.name) }
                    })
                    }


                });
            }

            function listAllFiles() {
                gfs.files.find({}).toArray(function(err, files) {
                    files.forEach(logArrayElements)
                })
            }

            function removeFiles(element, index, array) {
                gfs.remove({ _id: element._id }, function(err) {
                    if (err) { console.log(err) } else {
                        console.log('success');
                    }
                });
            }


            function removeAllFiles() {
                gfs.files.find({}).toArray(function(err, files) {
                    files.forEach(removeFiles)
                })


            }


        }
