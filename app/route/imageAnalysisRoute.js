module.exports = function(app,passport, gfs) {

    // normal routes ===============================================================
    var QrCode = require('qrcode-reader');

    //########################################


    app.get('/qrcode/:id', function(req, res) {
        var options = {
            _id: req.params.id
        };

        var qr = new QrCode();
        qr.callback = function(result, err) {
            if (result) {
                res.send(result);
            }
            if(err){
                res.send({success:false,error:err})
            }
        }


        gfs.files.find(options, function(err, file) {
            if (err) {
                res.send({
                    success: false
                });
            } else {
                qr.decode('localhost/file/'+options._id)
            }

        });

    });


       // handle media posted by authenticated users
    app.post('/qrcode', function(req, res) {
        if (req.isAuthenticated()) {
            var part = req.files;
            var writestream = gfs.createWriteStream({
                filename: part.file.name,
                mode: 'w',
                content_type: part.file.mimetype,
                metadata: {
                    qrcode : true,
                    creator: req.user._id,
                    public: req.body.public === 'true',
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

}
