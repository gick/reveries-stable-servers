module.exports = function(app, passport, gfs) {

    // normal routes ===============================================================

    var User = require('../models/user.js');

    app.post('/picture', function(req, res) {
        if(req.isAuthenticated()){
        var part = req.files;
        var writestream = gfs.createWriteStream({
            filename: part.file.name,
            mode: 'w',
            content_type: part.file.mimetype,
        });
        writestream.write(part.file.data);

        writestream.on('close', function(file) {
             updateUser(req.user,file);
             res.send(file);

        })
        writestream.end();}
        else {
            res.send("Please authenticate first")
        }
    });

    app.get('/file/:id', function(req, res) {
        gfs.findOne({ _id: req.params.id}, function (err, file) {
      var readstream = gfs.createReadStream(
        file
      );
      res.set('Content-Type', file.contentType);

      req.on('error', function(err) {
        res.send(500, err);
      });
      readstream.on('error', function (err) {
        res.send(500, err);
      });
      readstream.pipe(res);
    });

    });

    function updateUser(user,file){
        User.findOne({_id:user._id},function(err,result){
            result.files.push(file._id);
            result.save(function(err){});
        })
    }

}
