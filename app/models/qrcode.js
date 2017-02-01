var mongoose = require('mongoose');

var qrCodeSchema = mongoose.Schema({
		owner:String,
		status:String,
        qrcode:String,
        fileId:String
    })

module.exports = mongoose.model('QRcode', qrCodeSchema);
