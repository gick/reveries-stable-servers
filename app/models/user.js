// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var userSchema = mongoose.Schema({

    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isadmin: Boolean,
    creationDate: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    status: { type: String, default: 'Public' },
    readonly: { type: String, default: 'readwrite' },
    lastLogin: String,
    typeLabel: { type: String, default: 'user' },
    staticMedias: [{ type: Schema.Types.ObjectId, ref: 'StaticMedia' }],
    POI: [{ type: Schema.Types.ObjectId, ref: 'POI' }],
    Freetexts: [{ type: Schema.Types.ObjectId, ref: 'FreeText' }],
    MCQ: [{ type: Schema.Types.ObjectId, ref: 'MCQ' }],
    Badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    unitGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    MLG: [{ type: Schema.Types.ObjectId, ref: 'MLG' }],
    inventoryItems: [{ type: Schema.Types.ObjectId, ref: 'InventoryItem' }],
});

// generating a hash

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);