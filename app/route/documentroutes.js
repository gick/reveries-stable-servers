module.exports = function(app) {

        // normal routes ===============================================================
        var User = require('../models/user.js');

        app.get('/listPublicPoi', function(req, res) {
            User.aggregate([{$unwind : {path:'$poi'}},{$project : {'name':'$poi.name','date':'$poi.date','latitude':'$poi.latitude',longitude:'$poi.longitude',photo:'$poi.photo',comment:'$poi.comment',public:'$poi.public',creator:'$name' }},{$match:{public:true}}], function(err, result) {
            		if(err){
            			console.log(err)
            			res.send({success:false})
            		}else{
            			res.send(result)
            		}
            	})
        })
}