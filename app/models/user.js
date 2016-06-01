// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
/*
var mapinfoSchema = mongoose.Schema({
    marker:String,
    centerLatitude:Number,
    centerLongitude:Number,
    zoomLevel:Number,
})*/
var userSchema = mongoose.Schema({

    name: String,
    email: String,
    password: String,
    unitGame:[{activityName:String,startText:String,compass:Boolean,startMedia:{id:String},POI:{id:String},passActivities:Boolean,activities:[{id:String}],feedbackText:String,feedbackMedia:{id:String}}],
    scenario: [{ name: String, public: Boolean, date: Date, json_rep: String }],
    poi: [{
        name: String,
        comment: String,
        date: Date,
        latitude: Number,
        longitude: Number,
        photo: String,
        public: Boolean,
        map: {
            marker: String,
            areaLat:Number,
            areaLong:Number,
            areaRadius:Number,
            mapLatitude: Number,
            mapLongitude: Number,
            mapZoom: Number,
        }
    }],
    freetext: [{ name:String,question: String, response: String, imageId: String, wrongMessage: String, correctMessage: String }],
    isadmin: Boolean,
});

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
